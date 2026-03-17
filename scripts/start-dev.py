import subprocess
import socket
import os
import sys
import io

# ============================================================
# ⚙️  Siam Treasures Smart Dev Launcher
# ============================================================
# This script handles encoding, IP detection, and environment
# variable injection to ensure a 100% stable dev environment.
# ============================================================

def setup_encoding():
    """
    Stabilizes terminal encoding to UTF-8 for Windows console
    """
    try:
        # Avoid crashes on shells where standard streams are weirdly mapped
        if sys.stdout and sys.stdout.buffer:
            sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
    except:
        pass

def get_physical_ip():
    """
    Gets the real local physical IP by querying up-adapters and
    excluding virtual ones (VirtualBox, VMware, VPNs, etc.)
    """
    # Defensive PowerShell command for Windows
    cmd = "(Get-NetAdapter | Where-Object { $_.Status -eq 'Up' -and $_.InterfaceDescription -notmatch 'Virtual|VMware|Wintun|Meta|Clash|TAP|Tunnel|Bluetooth' } | Get-NetIPAddress -AddressFamily IPv4 | Select-Object -First 1).IPAddress"
    try:
        result = subprocess.check_output(["powershell", "-NoProfile", "-Command", cmd], text=True).strip()
        if result and "." in result:
            return result
    except Exception:
        # No worries, fall back to standard socket-based detection
        pass
    
    # Standard fallback (doesn't always skip virtual adapters but works globally)
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(("8.8.8.8", 80)) # Doesn't actually send packets
        ip = s.getsockname()[0]
        s.close()
        return ip
    except:
        return "127.0.0.1"

def check_env():
    """
    Ensures .env exists and node_modules are present
    """
    if not os.path.isdir("node_modules"):
        print("\n[❌] 致命错误：丢失 node_modules 目录！")
        print("      请先在终端运行 'npm install' 安装依赖。")
        return False
    
    if not os.path.isfile(".env"):
        print("\n[⚠️] 警告：未发现 .env 配置文件，系统可能运行不完整。")
    
    return True

def run():
    setup_encoding()
    
    print("\n" + "="*60)
    print("   🚀 暹罗御藏 (Siam Treasures) - 自动化启动引擎 (STABLE)")
    print("="*60 + "\n")
    
    if not check_env():
        return

    # 1. Detect Networking
    print("[1/3] 📡 正在探测物理网卡局域网 IP...")
    local_ip = get_physical_ip()
    print(f"      识别到物理 IP：{local_ip}")
    
    # 2. Inject Dynamic Environment Variables
    # NEXTAUTH_URL is vital for mobile authentication / redirects
    app_url = f"http://{local_ip}:3000"
    
    # We create a copy of the parent env and update our targets
    full_env = os.environ.copy()
    full_env["NEXTAUTH_URL"] = app_url
    full_env["NEXT_PUBLIC_APP_URL"] = app_url
    
    print(f"[2/3] ⚙️  注入动态环境变量：")
    print(f"      - NEXTAUTH_URL: {app_url}")
    print(f"      - 监听地址配置: ANY (0.0.0.0)")

    # 3. Launch Next.js
    print("\n[3/3] 🔥 正在启动开发服务器...")
    print("-" * 60)
    print(f"   🖥️  电脑预览: http://localhost:3000")
    print(f"   📱 手机访问: {app_url} (同一 WiFi 下)")
    print("-" * 60 + "\n")
    print(">>> 提示：按 Ctrl+C 停止运行 <<<\n")
    
    try:
        # We use shell=True for 'npm' on Windows compatibility
        subprocess.run("npm run dev -- -H 0.0.0.0", shell=True, env=full_env)
    except KeyboardInterrupt:
        print("\n[✅] 服务已安全停止。")
    except Exception as e:
        print(f"\n[❌] 运行异常：{e}")

if __name__ == "__main__":
    run()
