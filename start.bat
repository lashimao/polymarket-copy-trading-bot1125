@echo off
setlocal enabledelayedexpansion

rem Start bot (no install/build)

pushd "%~dp0"

if not exist ".env" (
    echo [ERROR] .env file not found. Copy .env.example and fill in your values.
    goto :end
)

where node >nul 2>nul
if errorlevel 1 (
    echo [ERROR] Node.js 18+ is required. Install from https://nodejs.org/ then rerun this script.
    goto :end
)

if not exist "node_modules" (
    echo [ERROR] node_modules not found. Run deploy_only.bat --install first.
    goto :end
)

echo [STEP] Starting bot...
npm start

:end
popd
endlocal
echo.
echo Press any key to close...
pause >nul
