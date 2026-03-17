import socket
import sys
import io

# 强制 UTF-8 输出
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def get_local_ip():
    try:
        # 获取所有可能的 IPv4 地址
        hostname = socket.gethostname()
        _, _, ip_list = socket.gethostbyname_ex(hostname)
        
        # 定义局域网常见私有网段
        lan_prefixes = ('192.168.', '10.', '172.16.', '172.17.', '172.18.', '172.19.', '172.20.', '172.21.', '172.22.', '172.23.', '172.24.', '172.25.', '172.26.', '172.27.', '172.28.', '172.29.', '172.30.', '172.31.')
        # 需要排除的网段（Clash 常用 198.18, 还有环回地址 127）
        exclude_prefixes = ('127.', '198.18.', '169.254.')
        
        suitable_ips = []
        for ip in ip_list:
            if any(ip.startswith(pre) for pre in lan_prefixes):
                suitable_ips.append(ip)
        
        # 如果找到了私有网段 IP，返回第一个（通常是真正的物理网卡）
        if suitable_ips:
            return suitable_ips[0]
            
        # 如果没找到标准私有网段，但有非排除网段的 IP，也作为备选
        other_ips = [ip for ip in ip_list if not any(ip.startswith(pre) for pre in exclude_prefixes)]
        if other_ips:
            return other_ips[0]
            
        return "127.0.0.1"
    except Exception:
        return "127.0.0.1"

if __name__ == "__main__":
    print(get_local_ip())
