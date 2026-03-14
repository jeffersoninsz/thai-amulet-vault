@echo off
cd /d "%~dp0"

echo [1/2] Checking for processes on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo Killing PID %%a
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo [2/2] Starting Next.js Dev Server...
call npm run dev

echo.
echo Script finished. Press any key to exit.
pause
