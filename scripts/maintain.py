import os
import sys
import subprocess
import time
import io

# 强制 UTF-8 输出补丁
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def run_cmd(cmd, shell=True):
    print(f"🚀 运行命令: {cmd}")
    result = subprocess.run(cmd, shell=shell, capture_output=True, text=True, encoding='utf-8')
    if result.returncode != 0:
        print(f"❌ 失败: {result.stderr}")
    return result.stdout

def print_banner(text):
    print("\n" + "="*50)
    print(f"  {text}")
    print("="*50)

def main():
    print_banner("Thai Amulet Vault - 自动化维护系统")
    
    # 1. 环境检查
    print_banner("Step 1: 环境与变量检查")
    if not os.path.exists(".env"):
        print("❌ 未发现 .env 文件！")
    else:
        print("✅ .env 文件已就绪")

    # 2. 数据库性能诊断 (快捷版)
    print_banner("Step 2: 数据库连接测试 (Prisma)")
    # 使用 npx tsx 直接运行内联测试
    db_test_code = """
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const start = Date.now();
  await prisma.$queryRaw`SELECT 1`;
  console.log('DB_PING_OK: ' + (Date.now() - start) + 'ms');
}
main().finally(() => process.exit(0));
"""
    with open("tmp_db_test.ts", "w", encoding='utf-8') as f:
        f.write(db_test_code)
    
    out = run_cmd("npx tsx tmp_db_test.ts")
    print(out)
    if os.path.exists("tmp_db_test.ts"):
        os.remove("tmp_db_test.ts")

    # 3. 生产构建预演
    print_banner("Step 3: 项目构建预演")
    # run_cmd("npm run build") # 如果需要可以开启，比较耗时

    # 4. GitHub 自动备份
    print_banner("Step 4: GitHub 自动同步与备份")
    commit_msg = f"Auto-maintenance: {time.strftime('%Y-%m-%d %H:%M:%S')}"
    run_cmd("git add .")
    run_cmd(f'git commit -m "{commit_msg}"')
    # run_cmd("git push origin main --force") # 谨慎自动强推

    print_banner("维护任务完成！✨")

if __name__ == "__main__":
    main()
