@echo off
echo ================================================================
echo   AURAMIRROR - STARTING PHYSICAL SENSOR HARDWARE BRIDGE
echo ================================================================
echo.

python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not found in PATH!
    echo Please install Python 3.9+ and make sure 'Add Python to PATH' is checked.
    pause
    exit /b 1
)

echo [INFO] Checking and installing required Python libraries (pyserial, websockets)...
python -m pip install pyserial websockets --quiet

echo.
echo [INFO] Launching AuraMirror Sensor Bridge...
echo [INFO] Connect your Arduino / ESP32 via USB.
echo.
python sensor_bridge.py
pause
