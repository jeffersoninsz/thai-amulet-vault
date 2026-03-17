@echo off
setlocal enabledelayedexpansion
chcp 65001 >nul 2>&1
title 🚀 Siam Treasures V4 - LAN Auto IP

:: ============================================
:: 1. 智能获取真实物理网卡 IP (精准绕过虚拟网卡)
:: ============================================
set "LOCAL_IP=127.0.0.1"

echo 正在探测网络配置...

:: 使用 powershell 直接打印结果，避免 for 循环可能出现的转义崩坏
for /f "usebackq tokens=*" %%A in (`powershell -NoProfile -Command "(Get-NetAdapter | Where-Object { $_.Status -eq 'Up' -and $_.InterfaceDescription -notmatch 'Virtual|VMware|Wintun|Meta|Clash|TAP|Tunnel|Bluetooth' } | Get-NetIPAddress -AddressFamily IPv4 | Select-Object -First 1).IPAddress"`) do (
    set "LOCAL_IP=%%A"
)

:: ============================================
:: 2. 注入动态环境变量 (认证重定向关键)
:: ============================================
set "NEXTAUTH_URL=http://!LOCAL_IP!:3000"
set "NEXT_PUBLIC_APP_URL=http://!LOCAL_IP!:3000"

:: ============================================
:: 3. 启动界面展示
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
:: 4. 启动 Next.js (使用 call 确保命令执行后继续)
:: ============================================
call npm run dev -- -H 0.0.0.0

if %errorlevel% neq 0 (
    echo.
    echo [❌] 启动失败！请检查 node_modules 是否完整，或端口 3000 是否被占用。
    echo 错误代码: %errorlevel%
    pause
)

pause
