@echo off
setlocal enabledelayedexpansion
:: 设置字符集为 UTF-8 确保中文显示不乱码
chcp 65001 >nul

:: ============================================
:: 🚀 暹罗御藏 (Siam Treasures) 官方一键启动脚本
:: ============================================

title 🚀 Siam Treasures V4 - 开发模式启动控制台

cls
echo.
echo ============================================================
echo   暹罗御藏 (Siam Treasures) - 自动化部署引导程序
echo ============================================================
echo.
echo [1/4] 🔍 正在进行环境自检...

:: 检查 Node.js 模块
if not exist "node_modules\" (
    echo [❌] 错误：丢失 node_modules 目录！
    echo      请在终端执行 "npm install" 后再试。
    pause
    exit /b 1
)

:: 检查 .env 文件
if not exist ".env" (
    echo [⚠️] 警告：未发现 .env 配置文件。
    echo      系统将尝试使用默认配置启动。
)

:: ============================================================
:: [2/4] 📡 智能探测真实物理网卡 IP (精准绕过虚拟网卡)
:: ============================================================
echo [2/4] 📡 正在探测物理网卡局域网 IP (排除虚拟网卡影响)...

set "LOCAL_IP=127.0.0.1"

:: 执行 PowerShell 脚本进行精准探测
for /f "usebackq tokens=*" %%A in (`powershell -NoProfile -Command "(Get-NetAdapter | Where-Object { $_.Status -eq 'Up' -and $_.InterfaceDescription -notmatch 'Virtual|VMware|Wintun|Meta|Clash|TAP|Tunnel|Bluetooth' } | Get-NetIPAddress -AddressFamily IPv4 | Select-Object -First 1).IPAddress"`) do (
    set "LOCAL_IP=%%A"
)

if "%LOCAL_IP%"=="127.0.0.1" (
    echo [⚠️] 提示：未能检测到外部物理网卡 IP，将使用回环地址。
) else (
    echo [✅] 成功识别物理 IP: !LOCAL_IP!
)

:: ============================================================
:: [3/4] ⚙️ 动态重写当前 Session 环境变量
:: ============================================================
:: 为了兼容手机端 Auth 认证，必须动态指定 NEXTAUTH_URL
set "NEXT_PUBLIC_APP_URL=http://!LOCAL_IP!:3000"
set "NEXTAUTH_URL=http://!LOCAL_IP!:3000"

echo [⚙️] 动态配置：
echo      - NEXTAUTH_URL: !NEXTAUTH_URL!
echo      - 监听主机: 0.0.0.0 (支持全网段访问)

:: ============================================================
:: [4/4] 🔥 正在启动 Next.js 极速模式
:: ============================================================
echo.
echo ============================================================
echo   🚀 服务已就绪！请扫描下方地址访问：
echo.
echo   [🖥️  电脑端]  http://localhost:3000
echo   [📱 无线端]  http://!LOCAL_IP!:3000
echo.
echo   * 如果无法连接，请确保手机与电脑在【同一 WiFi】下
echo   * 并且已关闭防火墙或放行 3000 端口
echo ============================================================
echo.

:: 使用 -H 0.0.0.0 确保局域网内所有设备均可访问
npm run dev -- -H 0.0.0.0

pause
