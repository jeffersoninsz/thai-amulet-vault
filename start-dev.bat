@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul 2>&1
title 🚀 Siam Treasures V4 - LAN Auto IP

set "LOCAL_IP=127.0.0.1"
echo 正在探测网络配置，请稍候...

:: ============================================
:: 智能获取真实物理网卡 IP (精准绕过虚拟网卡)
:: ============================================
for /f "usebackq tokens=*" %%A in (`powershell -NoProfile -Command "(Get-NetAdapter | Where-Object { $_.Status -eq 'Up' -and $_.InterfaceDescription -notmatch 'Virtual|VMware|Wintun|Meta|Clash|TAP|Tunnel|Bluetooth' } | Get-NetIPAddress -AddressFamily IPv4 | Select-Object -First 1).IPAddress"`) do (
    set "LOCAL_IP=%%A"
)

:: ============================================
:: 设置环境变量
:: ============================================
set "NEXTAUTH_URL=http://!LOCAL_IP!:3000"
set "NEXT_PUBLIC_APP_URL=http://!LOCAL_IP!:3000"

:: ============================================
:: 启动界面展示
:: ============================================
cls
echo ========================================================
echo  🚀 暹罗御藏 (Siam Treasures) 正在启动
echo ========================================================
echo  📌 本机预览地址: http://localhost:3000
echo  📌 局域网/手机端: http://!LOCAL_IP!:3000
echo ========================================================
echo  💡 系统提示: 
echo  - 已自动过滤虚拟网卡
echo  - 认证同步地址: !NEXTAUTH_URL!
echo ========================================================
echo.

:: ============================================
:: 尝试多种方式启动 npm (适配不同的系统配置)
:: ============================================
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [❌] 错误: 系统未找到 npm。请确保已安装 Node.js。
    pause
    exit /b 1
)

:: 尝试使用 cmd /c 启动。这比 call 更稳定，因为它会打开子 shell
cmd /c "npm run dev -- -H 0.0.0.0"

if %errorlevel% neq 0 (
    echo.
    echo [❌] 启动失败。代码: %errorlevel%
    echo 尝试方案 B (备选路径启动)...
    call npm run dev -- -H 0.0.0.0
)

pause
