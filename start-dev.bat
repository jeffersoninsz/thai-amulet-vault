@echo off
chcp 65001 >nul 2>&1
title 🚀 Siam Treasures V4 - LAN Auto IP

:: ============================================
:: 1. 智能获取真实物理网卡 IP (精准绕过虚拟网卡)
:: ============================================
set "LOCAL_IP=127.0.0.1"

for /f "usebackq tokens=*" %%A in (`powershell -NoProfile -Command "(Get-NetAdapter | Where-Object { $_.Status -eq 'Up' -and $_.InterfaceDescription -notmatch 'Virtual|VMware|Wintun|Meta|Clash|TAP|Tunnel|Bluetooth' } | Get-NetIPAddress -AddressFamily IPv4 | Select-Object -First 1).IPAddress"`) do (
    set "LOCAL_IP=%%A"
)

:: ============================================
:: 2. 注入动态环境变量 (认证重定向关键)
:: ============================================
:: 必须设置 NEXTAUTH_URL 否则手机访问时，登录跳转会失败
set "NEXTAUTH_URL=http://%LOCAL_IP%:3000"
set "NEXT_PUBLIC_APP_URL=http://%LOCAL_IP%:3000"

:: ============================================
:: 3. 启动界面展示
:: ============================================
cls
echo ========================================================
echo  🚀 暹罗御藏 (Siam Treasures) 正在启动
echo ========================================================
echo  📌 本机预览地址: http://localhost:3000
echo  📌 局域网/手机端: http://%LOCAL_IP%:3000
echo ========================================================
echo  💡 系统提示: 
echo  - 已自动过滤 Clash / VMware / VPN 等所有虚拟网卡。
echo  - 认证同步地址: %NEXTAUTH_URL%
echo ========================================================
echo.

:: ============================================
:: 4. 启动 Next.js (监听全网段)
:: ============================================
npm run dev -- -H 0.0.0.0

pause
