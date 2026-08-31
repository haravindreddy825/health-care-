@echo off
echo ===================================================
echo   AI-POWERED SMART MIRROR - STARTING APPLICATION
echo ===================================================
echo.

IF NOT EXIST node_modules (
    echo [INFO] Installing required dependencies...
    call npm install
)

echo.
echo [INFO] Starting local development server...
echo [INFO] Open your browser at http://localhost:5173
echo.
call npm run dev
pause
