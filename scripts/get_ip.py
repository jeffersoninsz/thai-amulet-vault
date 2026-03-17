import socket
import sys
import io

# 强制 UTF-8 输出
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def get_real_local_ip():
    """
    通过模拟连接外部地址，让操作系统根据路由表自动选出最合适的物理网卡 IP。
    这能有效穿透 Clash、VMware 等虚拟网卡。
    """
    try:
        # 使用 UDP 协议，不需要实际联网，只需 OS 路由表生效即可
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.settimeout(0.5)
        # 这里使用一个公网地址（无需真正连接成功）
        s.connect(('8.8.8.8', 80))
        ip = s.getsockname()[0]
        s.close()
        
        # 最后的防守：如果返回的是 Clash 常见的 198.18 网段，尝试回退到 hostname 查找
        if ip.startswith('198.18.'):
            raise Exception("Clash tunnel detected")
            
        return ip
    except Exception:
        try:
            # 回退方案：获取主机名对应的所有 IP
            hostname = socket.gethostname()
            _, _, ips = socket.gethostbyname_ex(hostname)
            
            # 过滤排除名单
            excludes = ('127.', '198.18.', '169.254.')
            # 优先选择常用局域网段
            lan_prefixes = ('192.168.', '10.', '172.16.')
            
            suitable = [ip for ip in ips if not any(ip.startswith(ex) for ex in excludes)]
            
            # 筛选私有网段
            lan_only = [ip for ip in suitable if any(ip.startswith(lan) for lan in lan_prefixes)]
            
            if lan_only: return lan_only[0]
            if suitable: return suitable[0]
            return "127.0.0.1"
        except:
            return "127.0.0.1"

if __name__ == "__main__":
    print(get_real_local_ip())
