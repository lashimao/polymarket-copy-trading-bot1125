@echo off
setlocal enabledelayedexpansion

rem Install dependencies and build (no start)
rem Usage: deploy_only.bat [--install]  (use --install to force npm install)

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

set FORCE_INSTALL=0
if /I "%~1"=="--install" set FORCE_INSTALL=1

if %FORCE_INSTALL%==0 (
    if not exist "node_modules" (
        echo [INFO] node_modules not found, running npm install...
        set FORCE_INSTALL=1
    )
)

if %FORCE_INSTALL%==1 (
    echo [STEP] Installing dependencies...
    npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed.
        goto :end
    )
) else (
    echo [STEP] Skipping npm install (node_modules present). Use --install to force.
)

echo [STEP] Building project...
npm run build
if errorlevel 1 (
    echo [ERROR] npm run build failed.
    goto :end
)

echo [DONE] Deploy step finished. Run start_only.bat to launch the bot.

:end
popd
endlocal
echo.
echo Press any key to close...
pause >nul
