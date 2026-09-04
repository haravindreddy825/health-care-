#!/usr/bin/env python3
"""
AuraMirror Physical Sensor Bridge Daemon
========================================
Connects external microcontroller sensors (MAX30102, Temperature, Ultrasonic Distance)
via USB Serial and broadcasts real-time telemetry over WebSocket & HTTP REST to the Smart Mirror frontend.

Usage:
  python sensor_bridge.py              # Normal mode (auto-scans USB COM ports)
  python sensor_bridge.py --port COM3  # Connect to specific port
  python sensor_bridge.py --baud 115200# Set baud rate (default 115200)
  python sensor_bridge.py --demo       # Hardware simulation mode (for testing without physical sensors)
"""

import sys
import os
import time
import json
import argparse
import threading
import subprocess
from datetime import datetime, timezone

# Ensure required libraries are installed
def ensure_dependencies():
    missing = []
    try:
        import serial
        import serial.tools.list_ports
    except ImportError:
        missing.append("pyserial")
    
    try:
        import websockets
        import asyncio
    except ImportError:
        missing.append("websockets")

    if missing:
        print(f"[BOOTSTRAP] Installing missing Python packages: {', '.join(missing)}...")
        try:
            subprocess.check_call([sys.executable, "-m", "pip", "install", *missing])
            print("[BOOTSTRAP] Successfully installed dependencies.")
        except Exception as e:
            print(f"[BOOTSTRAP WARNING] Could not auto-install: {e}. Running with standard library fallback.")

ensure_dependencies()

try:
    import serial
    import serial.tools.list_ports
    HAS_SERIAL = True
except ImportError:
    HAS_SERIAL = False

try:
    import asyncio
    import websockets
    HAS_WEBSOCKETS = True
except ImportError:
    HAS_WEBSOCKETS = False

from http.server import HTTPServer, BaseHTTPRequestHandler
import socketserver

# Global State
WS_PORT = 8765
HTTP_PORT = 8766
CONNECTED_CLIENTS = set()
LATEST_TELEMETRY = {
    "timestamp": datetime.now(timezone.utc).isoformat(),
    "connected": False,
    "port": None,
    "baudRate": 115200,
    "packetCount": 0,
    "sensors": {
        "heartRate": { "connected": False, "value": None, "unit": "BPM", "sensor": "MAX30102" },
        "spo2": { "connected": False, "value": None, "unit": "%", "sensor": "MAX30102" },
        "temperature": { "connected": False, "value": None, "unit": "°C", "sensor": "IR/Contact Thermometer" },
        "distance": { "connected": False, "value": None, "unit": "cm", "sensor": "HC-SR04 / VL53L0X" }
    }
}
STATE_LOCK = threading.Lock()


def get_available_ports():
    """Returns list of available COM / USB serial ports."""
    ports = []
    if HAS_SERIAL:
        try:
            for p in serial.tools.list_ports.comports():
                ports.append({
                    "port": p.device,
                    "description": p.description,
                    "hwid": p.hwid
                })
        except Exception as e:
            print(f"[SERIAL] Port scan error: {e}")
    return ports


def parse_sensor_payload(raw_line):
    """
    Parses incoming microcontroller serial strings (JSON or CSV).
    Supported formats:
    1. JSON: {"hr": 76, "spo2": 98, "temp": 36.7, "dist": 72}
    2. JSON: {"heartRate": 76, "spo2": 98, "temperature": 36.7, "distance": 72}
    3. CSV:  76,98,36.7,72 (HR, SpO2, Temp, Distance)
    """
    line = raw_line.strip()
    if not line:
        return None

    # Try JSON parsing
    if line.startswith("{") and line.endswith("}"):
        try:
            data = json.loads(line)
            hr = data.get("hr") or data.get("heartRate") or data.get("bpm")
            spo2 = data.get("spo2") or data.get("spO2") or data.get("oxygen")
            temp = data.get("temp") or data.get("temperature")
            dist = data.get("dist") or data.get("distance")

            return {
                "heartRate": int(hr) if hr is not None and not is_invalid(hr) else None,
                "spo2": int(spo2) if spo2 is not None and not is_invalid(spo2) else None,
                "temperature": float(temp) if temp is not None and not is_invalid(temp) else None,
                "distance": int(dist) if dist is not None and not is_invalid(dist) else None
            }
        except Exception:
            pass

    # Try CSV parsing (e.g. 76,98,36.7,72)
    if "," in line:
        parts = [p.strip() for p in line.split(",")]
        try:
            hr = int(parts[0]) if len(parts) > 0 and parts[0] and not is_invalid(parts[0]) else None
            spo2 = int(parts[1]) if len(parts) > 1 and parts[1] and not is_invalid(parts[1]) else None
            temp = float(parts[2]) if len(parts) > 2 and parts[2] and not is_invalid(parts[2]) else None
            dist = int(parts[3]) if len(parts) > 3 and parts[3] and not is_invalid(parts[3]) else None
            return {
                "heartRate": hr,
                "spo2": spo2,
                "temperature": temp,
                "distance": dist
            }
        except Exception:
            pass

    return None


def is_invalid(val):
    try:
        f = float(val)
        return f <= 0 or f > 400
    except (ValueError, TypeError):
        return True


def update_telemetry(parsed_data, port_name="HARDWARE", is_demo=False):
    """Updates the global telemetry object thread-safely."""
    global LATEST_TELEMETRY
    now_iso = datetime.now(timezone.utc).isoformat()

    with STATE_LOCK:
        LATEST_TELEMETRY["timestamp"] = now_iso
        LATEST_TELEMETRY["connected"] = True
        LATEST_TELEMETRY["port"] = port_name
        LATEST_TELEMETRY["isDemo"] = is_demo
        LATEST_TELEMETRY["packetCount"] = LATEST_TELEMETRY.get("packetCount", 0) + 1

        s = LATEST_TELEMETRY["sensors"]
        
        # Heart Rate
        hr = parsed_data.get("heartRate")
        s["heartRate"]["connected"] = hr is not None
        s["heartRate"]["value"] = hr
        s["heartRate"]["source"] = "demo" if is_demo else ("hardware" if hr is not None else "unavailable")

        # SpO2
        spo2 = parsed_data.get("spo2")
        s["spo2"]["connected"] = spo2 is not None
        s["spo2"]["value"] = spo2
        s["spo2"]["source"] = "demo" if is_demo else ("hardware" if spo2 is not None else "unavailable")

        # Temperature
        temp = parsed_data.get("temperature")
        s["temperature"]["connected"] = temp is not None
        s["temperature"]["value"] = temp
        s["temperature"]["source"] = "demo" if is_demo else ("hardware" if temp is not None else "unavailable")

        # Distance
        dist = parsed_data.get("distance")
        s["distance"]["connected"] = dist is not None
        s["distance"]["value"] = dist
        s["distance"]["source"] = "demo" if is_demo else ("hardware" if dist is not None else "unavailable")


def mark_disconnected(port_name=None):
    """Marks hardware as disconnected without inventing fake values."""
    global LATEST_TELEMETRY
    with STATE_LOCK:
        LATEST_TELEMETRY["connected"] = False
        LATEST_TELEMETRY["port"] = port_name
        LATEST_TELEMETRY["timestamp"] = datetime.now(timezone.utc).isoformat()
        for k in LATEST_TELEMETRY["sensors"]:
            LATEST_TELEMETRY["sensors"][k]["connected"] = False
            LATEST_TELEMETRY["sensors"][k]["value"] = None
            LATEST_TELEMETRY["sensors"][k]["source"] = "unavailable"


# --- Hardware Serial Worker Thread ---
def serial_worker(target_port=None, baud_rate=115200, demo_mode=False):
    """Scans and reads physical USB serial port or generates synthetic packets in demo mode."""
    if demo_mode:
        print("[DEMO MODE] Running in Demo Simulation Mode...")
        step = 0
        while True:
            step += 1
            sim_hr = 72 + int(4 * (step % 5 - 2))
            sim_spo2 = 98 if (step % 4 != 0) else 97
            sim_temp = round(36.6 + (step % 3) * 0.1, 1)
            sim_dist = 68 + int((step % 7) - 3)

            parsed = {
                "heartRate": sim_hr,
                "spo2": sim_spo2,
                "temperature": sim_temp,
                "distance": sim_dist
            }
            update_telemetry(parsed, port_name="DEMO-SIMULATOR", is_demo=True)
            time.sleep(0.3)

    if not HAS_SERIAL:
        print("[SERIAL WARNING] pyserial is not available. Please run: pip install pyserial")
        while True:
            time.sleep(2)

    print(f"[SERIAL] Auto-discovering hardware sensors (Baud: {baud_rate})...")

    while True:
        ports = get_available_ports()
        chosen_port = target_port

        if not chosen_port and ports:
            # Auto-select first available COM port
            chosen_port = ports[0]["port"]

        if not chosen_port:
            mark_disconnected()
            print("[SERIAL] No hardware COM port detected. Waiting for USB sensor connection...", end="\r")
            time.sleep(2)
            continue

        print(f"\n[SERIAL] Connecting to external sensor on {chosen_port} @ {baud_rate} baud...")
        try:
            ser = serial.Serial(chosen_port, baud_rate, timeout=1.5)
            time.sleep(1.8) # Wait for microcontroller DTR reset
            print(f"[SERIAL] ✓ Connected successfully to {chosen_port}!")

            while True:
                line = ser.readline().decode('utf-8', errors='ignore')
                if line:
                    parsed = parse_sensor_payload(line)
                    if parsed:
                        update_telemetry(parsed, port_name=chosen_port, is_demo=False)
                        print(f"[{datetime.now().strftime('%H:%M:%S')}] TELEMETRY [{chosen_port}] -> HR: {parsed['heartRate'] or '--'} BPM | SpO2: {parsed['spo2'] or '--'}% | Temp: {parsed['temperature'] or '--'}°C | Dist: {parsed['distance'] or '--'} cm")
                else:
                    # Timeout check
                    time.sleep(0.05)

        except Exception as e:
            print(f"[SERIAL] Connection closed or error on {chosen_port}: {e}")
            mark_disconnected(chosen_port)
            time.sleep(2)


# --- HTTP REST API Server ---
class SensorRestHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Enable CORS
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.end_headers()

        if self.path == "/api/sensors" or self.path == "/":
            with STATE_LOCK:
                resp = json.dumps(LATEST_TELEMETRY)
            self.wfile.write(resp.encode('utf-8'))
        elif self.path == "/api/ports":
            ports = get_available_ports()
            self.wfile.write(json.dumps({"ports": ports}).encode('utf-8'))
        elif self.path == "/api/status":
            with STATE_LOCK:
                status = {
                    "connected": LATEST_TELEMETRY["connected"],
                    "port": LATEST_TELEMETRY["port"],
                    "packetCount": LATEST_TELEMETRY["packetCount"],
                    "timestamp": LATEST_TELEMETRY["timestamp"]
                }
            self.wfile.write(json.dumps(status).encode('utf-8'))
        else:
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "*")
        self.end_headers()

    def log_message(self, format, *args):
        # Suppress noisy HTTP request logging
        return


def run_http_server(port=HTTP_PORT):
    try:
        server = HTTPServer(("0.0.0.0", port), SensorRestHandler)
        print(f"[HTTP API] REST API active at http://localhost:{port}/api/sensors")
        server.serve_forever()
    except Exception as e:
        print(f"[HTTP API] Server notice: {e}")


# --- WebSocket Broadcast Server ---
async def ws_handler(websocket):
    CONNECTED_CLIENTS.add(websocket)
    print(f"[WEBSOCKET] Frontend client connected! (Total clients: {len(CONNECTED_CLIENTS)})")
    try:
        while True:
            with STATE_LOCK:
                payload = json.dumps(LATEST_TELEMETRY)
            await websocket.send(payload)
            await asyncio.sleep(0.15) # Send 6.6 Hz updates
    except Exception:
        pass
    finally:
        CONNECTED_CLIENTS.discard(websocket)
        print(f"[WEBSOCKET] Client disconnected. (Remaining clients: {len(CONNECTED_CLIENTS)})")


async def run_ws_server(port=WS_PORT):
    if not HAS_WEBSOCKETS:
        print("[WEBSOCKET WARNING] websockets package missing. REST API will serve as communication bridge.")
        return

    print(f"[WEBSOCKET] WebSocket Server listening at ws://localhost:{port}")
    async with websockets.serve(ws_handler, "0.0.0.0", port):
        await asyncio.Future() # keep running


def main():
    parser = argparse.ArgumentParser(description="AuraMirror Physical Sensor Bridge")
    parser.add_argument("--port", type=str, default=None, help="Target serial COM port (e.g. COM3 or /dev/ttyUSB0)")
    parser.add_argument("--baud", type=int, default=115200, help="Serial baud rate (default: 115200)")
    parser.add_argument("--demo", action="store_true", help="Run in demo simulation mode")
    parser.add_argument("--ws-port", type=int, default=8765, help="WebSocket server port (default: 8765)")
    parser.add_argument("--http-port", type=int, default=8766, help="HTTP REST server port (default: 8766)")

    args = parser.parse_args()

    print("====================================================================")
    print("      AURAMIRROR AI SMART HEALTH MONITOR - HARDWARE SENSOR BRIDGE   ")
    print("====================================================================")
    print(f"• WebSocket Server Endpoint : ws://localhost:{args.ws_port}")
    print(f"• HTTP REST API Endpoint   : http://localhost:{args.http_port}/api/sensors")
    print(f"• Mode                      : {'DEMO SIMULATION' if args.demo else 'PHYSICAL HARDWARE SCANNER'}")
    print("====================================================================\n")

    # Start Hardware Serial Thread
    t_serial = threading.Thread(
        target=serial_worker,
        kwargs={"target_port": args.port, "baud_rate": args.baud, "demo_mode": args.demo},
        daemon=True
    )
    t_serial.start()

    # Start HTTP Server Thread
    t_http = threading.Thread(
        target=run_http_server,
        kwargs={"port": args.http_port},
        daemon=True
    )
    t_http.start()

    # Start WebSocket Server in Main Event Loop
    if HAS_WEBSOCKETS:
        try:
            asyncio.run(run_ws_server(args.ws_port))
        except KeyboardInterrupt:
            print("\n[SHUTDOWN] Sensor bridge stopped.")
    else:
        # Keep main thread alive for HTTP thread
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n[SHUTDOWN] Sensor bridge stopped.")


if __name__ == "__main__":
    main()
