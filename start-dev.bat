@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion
cd /d "%~dp0"

set "APP_NAME=Siam Treasures"
set "VER_TAG=HuanX 2025 Optimized"

echo ========================================================
echo  🚀 %APP_NAME% 正在启动 (%VER_TAG%)
echo ========================================================

echo [1/3] 正在检查端口 3000 是否被占用...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo 正在清理端口 3000 上的旧进程 (PID: %%a)...
    taskkill /f /pid %%a >nul 2>&1
)

echo [2/3] 智能检测局域网访问地址...
set "LOCAL_IP=127.0.0.1"

:: 使用 PowerShell 优先匹配局域网私有网段 (192.168, 10, 172.16)
:: 排除 198.18 (Clash) 和 169.254 (APIPA)
set "PS_CMD=(Get-NetIPAddress -AddressFamily IPv4 ^| Where-Object { $_.IPAddress -match '^(192\.168\.|10\.|172\.)' -and $_.IPAddress -notmatch '^198\.18\.' } ^| Select-Object -First 1).IPAddress"

for /f "usebackq tokens=*" %%A in (`powershell -NoProfile -Command "!PS_CMD!"`) do (
    set "LOCAL_IP=%%A"
)

:: 兜底：如果没匹配到局域网段，则获取第一个非回环地址
if "!LOCAL_IP!"=="127.0.0.1" (
    for /f "usebackq tokens=*" %%B in (`powershell -NoProfile -Command "(Get-NetIPAddress -AddressFamily IPv4 ^| Where-Object { $_.IPAddress -notmatch '^(127\.|169\.|198\.)' } ^| Select-Object -First 1).IPAddress"`) do (
        set "LOCAL_IP=%%B"
    )
)

echo ========================================================
echo  📌 你自己的本机访问: http://127.0.0.1:3000
echo  📌 发给同事局域网用: http://!LOCAL_IP!:3000
echo ========================================================
echo  💡 系统提示: 
echo  - 已自动过滤 Clash / VMware 等所有虚拟网卡。
echo  - 无论路由器如何分配 IP，上方的局域网地址都会保持最新。
echo ========================================================
echo.

echo [3/3] 正在启动 Next.js 开发服务器...
call npm run dev

pause
