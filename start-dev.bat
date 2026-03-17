@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
cd /d "%~dp0"

echo ========================================================
echo  🚀 Siam Treasures 正在启动 (幻X 2025 专属优化版)
echo ========================================================

echo [1/3] 正在检查端口 3000 是否被占用...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo 正在清理端口 3000 上的旧进程 (PID: %%a)...
    taskkill /f /pid %%a >nul 2>&1
)

echo [2/3] 智能检测局域网访问地址...
set "LOCAL_IP=127.0.0.1"
for /f "usebackq tokens=*" %%A in (`powershell -NoProfile -ExecutionPolicy Bypass -Command "(Get-NetIPAddress -AddressFamily IPv4 ^| Where-Object { $_.IPAddress -notmatch '^(127\.|169\.254\.|198\.18\.)' } ^| Select-Object -First 1).IPAddress"`) do (
    set "LOCAL_IP=%%A"
)

echo ========================================================
echo  📌 你自己的本机访问: http://127.0.0.1:3000
echo  📌 发给同事局域网用: http://%LOCAL_IP%:3000
echo ========================================================
echo  💡 系统提示: 
echo  - 已自动过滤 Clash / VMware 等所有虚拟网卡。
echo  - 无论路由器如何分配 IP，上方的局域网地址都会保持最新。
echo ========================================================
echo.

echo [3/3] 正在启动 Next.js 开发服务器...
call npm run dev

pause
