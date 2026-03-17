import psycopg2
import sys
import io

# utf-8 fix for windows terminal
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Database URL from .env.prod
db_url = "postgresql://neondb_owner:npg_lP2OYEAu1mvW@ep-wispy-base-anb8iqnh-pooler.c-6.us-east-1.aws.neon.tech/neondb?sslmode=require"

def check_config():
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        print(f"--- 📡 正在连接生产数据库 ---")
        
        # 1. 探究所有列名
        cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name = 'MarketingConfig';")
        cols = cur.fetchall()
        print(f"📊 Table 'MarketingConfig' columns: {[c[0] for c in cols]}")

        # 2. 修改查询，确保启用
        cur.execute("SELECT id, \"fakeViewsEnabled\" FROM \"MarketingConfig\" LIMIT 1;")
        row = cur.fetchone()
        
        if row:
            print(f"Current Enabled Status: {row[1]}")
            if not row[1]:
                print(f"🔧 Updating to TRUE...")
                cur.execute("UPDATE \"MarketingConfig\" SET \"fakeViewsEnabled\" = TRUE WHERE id = %s;", (row[0],))
                conn.commit()
                print(f"✅ Updated.")
        else:
            print(f"❌ No record in MarketingConfig.")
            
        cur.close()
        conn.close()
        print(f"\n--- ✨ 检查已完成 ---")
        
    except Exception as e:
        print(f"🔥 Error: {e}")

if __name__ == "__main__":
    check_config()
