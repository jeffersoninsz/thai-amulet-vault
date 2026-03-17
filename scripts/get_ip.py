import socket
import psutil
import sys
import io

# 强制 UTF-8 输出
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def get_local_ip():
    try:
        # 获取所有网络接口
        interfaces = psutil.net_if_addrs()
        suitable_ips = []
        
        # 排除这些关键字的网卡名
        exclude_keywords = ['clash', 'virtual', 'vbox', 'vmware', 'loopback', 'wsl', 'hyper-v', 'pseudo', 'teredo']
        
        for iface_name, iface_addrs in interfaces.items():
            # 转换为小写进行匹配
            name_lower = iface_name.lower()
            if any(key in name_lower for key in exclude_keywords):
                continue
            
            for addr in iface_addrs:
                # 寻找 IPv4 地址，且不是 127.0.0.1
                if addr.family == socket.AF_INET and not addr.address.startswith('127.'):
                    # 记录该 IP 及其接口名称
                    suitable_ips.append((iface_name, addr.address))
        
        if not suitable_ips:
            # 如果没找到过滤后的，退而求其次尝试最标准的方法
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.settimeout(0)
            try:
                # 这不需要实际连接
                s.connect(('8.8.8.8', 1))
                return s.getsockname()[0]
            except Exception:
                return "127.0.0.1"
            finally:
                s.close()
        
        # 返回找到的第一个（通常是物理网卡或 Wi-Fi）
        return suitable_ips[0][1]
        
    except Exception as e:
        return f"Error: {str(e)}"

if __name__ == "__main__":
    print(get_local_ip())
