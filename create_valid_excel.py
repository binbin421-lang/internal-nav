import csv
from openpyxl import Workbook

# 读取CSV数据
with open('example_tools.csv', 'r', encoding='utf-8-sig') as f:
    reader = csv.reader(f)
    data = list(reader)

# 创建Excel工作簿
wb = Workbook()
ws = wb.active

# 写入数据
for row in data:
    ws.append(row)

# 保存为Excel文件
wb.save('example_tools.xlsx')
print("有效的Excel文件已创建成功！")
