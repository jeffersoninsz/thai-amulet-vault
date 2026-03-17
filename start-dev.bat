@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ========================================================
echo  🚀 Siam Treasures 正在启动 (幻X 2025 专属优化版)
echo ========================================================

echo [1/3] Checking for processes on port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo Killing existing process on port 3000 (PID: %%a)...
    taskkill /f /pid %%a >nul 2>&1
)

echo [2/3] Detecting Local network IP...
for /f "tokens=*" %%i in ('python scripts/get_ip.py') do set LOCAL_IP=%%i

if "%LOCAL_IP%"=="" set LOCAL_IP=127.0.0.1

echo ========================================================
echo  📌 你自己的本机访问: http://127.0.0.1:3000
echo  📌 发给同事局域网用: http://%LOCAL_IP%:3000
echo ========================================================
echo  💡 系统提示: 
echo  - 已自动过滤 Clash / VMware 等所有虚拟网卡。
echo  - 无论路由器如何分配 IP，上方的局域网地址都会保持最新。
echo ========================================================
echo.

echo [3/3] Starting Next.js Dev Server...
call npm run dev

pause
