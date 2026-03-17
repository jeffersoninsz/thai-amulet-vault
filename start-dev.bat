@echo off
setlocal
:: Ensure English output for system setup
chcp 437 >nul

:: ============================================================
:: 🚀 Siam Treasures V4 - Dev Environment Launcher
:: ============================================================
:: This batch script is a wrapper for a stable Python runner.
:: Using Python avoids common CMD parenthesis-escaping bugs
:: and encoding/garbling issues in the Windows console.

title Siam Treasures V4 Launcher

:: Check for Python
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python not found in PATH!
    echo Falling back to standard npm launch...
    npm run dev
    pause
    exit /b %errorlevel%
)

:: Ensure scripts directory exists
if not exist "scripts\start-dev.py" (
    echo [ERROR] Missing scripts\start-dev.py!
    echo Trying to launch directly with npm...
    npm run dev
    pause
    exit /b 1
)

:: Launch the smart python script
python scripts\start-dev.py

if %errorlevel% neq 0 (
    echo launcher exited with code %errorlevel%
    pause
)
