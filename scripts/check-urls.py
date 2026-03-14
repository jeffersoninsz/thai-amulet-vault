import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import sqlite3, os
db_path = os.path.join(os.getcwd(), 'prisma', 'dev.db')
conn = sqlite3.connect(db_path)
cur = conn.cursor()

# Update the remaining local path to cloudinary
cur.execute("""
    UPDATE Amulet 
    SET imageUrl = 'https://res.cloudinary.com/dsvgbvi4y/image/upload/v1741862729/amulets/placeholder-amulet.png' 
    WHERE imageUrl LIKE '/images/%'
""")
conn.commit()
print(f"Updated {cur.rowcount} remaining record(s)")

# Verify
cur.execute("SELECT COUNT(*) FROM Amulet WHERE imageUrl LIKE '/images/%'")
remaining = cur.fetchone()[0]
print(f"Remaining local paths: {remaining}")

conn.close()
