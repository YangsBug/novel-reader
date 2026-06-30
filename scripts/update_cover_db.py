import pymysql

conn = pymysql.connect(
    host='localhost',
    port=3306,
    user='root',
    password='123456',
    database='novel_reader',
    charset='utf8mb4'
)

cursor = conn.cursor()

# 先查看当前 cover 字段内容
cursor.execute("SELECT id, title, cover FROM novels LIMIT 5")
print("=== 当前 cover 字段内容 ===")
for row in cursor.fetchall():
    print(f"  ID {row[0]}: {row[1]} -> cover={row[2]}")

# 更新所有小说的 cover 为 PNG 路径
cursor.execute("UPDATE novels SET cover = CONCAT('/covers/', id, '.png')")
conn.commit()
affected = cursor.rowcount
print(f"\n已更新 {affected} 行")

# 验证
cursor.execute("SELECT id, title, cover FROM novels LIMIT 5")
print("\n=== 更新后 cover 字段 ===")
for row in cursor.fetchall():
    print(f"  ID {row[0]}: {row[1]} -> cover={row[2]}")

cursor.close()
conn.close()
print("\n数据库更新完成！")
