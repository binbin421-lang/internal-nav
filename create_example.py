import csv

# 示例数据
data = [
    ['软件名称', '版本', '分类', '适用系统', '软件大小', '更新日期', '下载链接', '简介', '备注'],
    ['企业微信', '4.0.0', '办公协作', 'Windows/macOS', '200MB', '2023-12-15', '#', '企业级即时通讯工具', '公司统一使用'],
    ['飞书', '5.2.1', '办公协作', 'Windows/macOS', '180MB', '2023-12-10', '#', '企业协作与办公平台', '团队协作首选'],
    ['钉钉', '6.5.3', '办公协作', 'Windows/macOS', '150MB', '2023-12-05', '#', '智能移动办公平台', '项目管理工具'],
    ['Office 365', '2023', '办公软件', 'Windows/macOS', '3.5GB', '2023-11-20', '#', '微软办公软件套装', '包含Word/Excel/PowerPoint'],
    ['Adobe Acrobat', 'DC 2023', '办公软件', 'Windows/macOS', '1GB', '2023-11-15', '#', 'PDF编辑与阅读工具', 'PDF编辑必备'],
    ['VS Code', '1.85.0', '开发工具', 'Windows/macOS', '100MB', '2023-12-08', '#', '轻量级代码编辑器', '开发人员推荐'],
    ['Chrome', '120.0', '浏览器', 'Windows/macOS', '80MB', '2023-12-12', '#', 'Google浏览器', '高速稳定'],
    ['Firefox', '119.0', '浏览器', 'Windows/macOS', '90MB', '2023-12-07', '#', 'Mozilla浏览器', '开源免费'],
    ['WinRAR', '6.24', '压缩工具', 'Windows', '5MB', '2023-10-10', '#', '文件压缩与解压缩工具', '支持多种压缩格式'],
    ['TeamViewer', '15.45', '远程工具', 'Windows/macOS', '30MB', '2023-11-30', '#', '远程控制与协作工具', '远程协助神器']
]

# 保存为CSV文件（可以用Excel打开）
with open('example_tools.csv', 'w', newline='', encoding='utf-8-sig') as f:
    writer = csv.writer(f)
    writer.writerows(data)

print("示例CSV文件已创建成功！")
print("可以用Excel打开example_tools.csv，然后另存为example_tools.xlsx")
