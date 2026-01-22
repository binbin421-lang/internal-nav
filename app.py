from flask import Flask, request, render_template, redirect, url_for, send_from_directory
import os
import csv
from datetime import datetime

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024  # 500MB max file size

# 确保上传文件夹存在
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# 允许的文件扩展名
ALLOWED_EXTENSIONS = {'exe', 'msi', 'zip', 'rar', '7z', 'pdf', 'dmg', 'pkg'}
ALLOWED_IMAGE_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def allowed_image(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_IMAGE_EXTENSIONS

# 静态文件路由已由Flask自动处理，无需手动定义

# 数据文件路由
@app.route('/data/<path:filename>')
def data_files(filename):
    return send_from_directory('data', filename)

# 主页路由（导航页）
@app.route('/')
def index():
    return render_template('index.html')

# 下载页路由
@app.route('/download')
def download_page():
    return render_template('download.html')

# 上传页面
@app.route('/upload')
def upload_page():
    return render_template('upload.html')

# 处理文件上传
@app.route('/upload_software', methods=['POST'])
def upload_software():
    if 'file' not in request.files:
        return redirect(request.url)
    
    file = request.files['file']
    if file.filename == '':
        return redirect(request.url)
    
    if file and allowed_file(file.filename):
        # 获取表单数据
        software_name = request.form.get('software_name')
        version = request.form.get('version')
        category = request.form.get('category')
        system = request.form.get('system')
        description = request.form.get('description')
        remark = request.form.get('remark')
        
        # 保存软件文件
        filename = file.filename
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # 生成下载链接
        download_url = f'/upload/{filename}'
        
        # 获取文件大小
        file_size = os.path.getsize(filepath)
        # 格式化文件大小
        def format_size(size):
            for unit in ['B', 'KB', 'MB', 'GB']:
                if size < 1024:
                    return f"{size:.1f}{unit}"
                size /= 1024
            return f"{size:.1f}TB"
        
        file_size_str = format_size(file_size)
        
        # 处理logo图片
        logo_url = ''
        if 'logo' in request.files:
            logo = request.files['logo']
            if logo.filename != '' and allowed_image(logo.filename):
                # 保存logo图片
                logo_filename = f"logo_{software_name.replace(' ', '_')}_{datetime.now().strftime('%Y%m%d%H%M%S')}.{logo.filename.rsplit('.', 1)[1].lower()}"
                logo_path = os.path.join('static', 'img', logo_filename)
                logo.save(logo_path)
                # 生成logo链接
                logo_url = f'/static/img/{logo_filename}'
        
        # 获取当前日期
        update_date = datetime.now().strftime('%Y-%m-%d')
        
        # 读取或创建CSV文件
        csv_file = 'data/example_tools.csv'
        
        # 定义标准表头
        standard_headers = ['软件名称', '版本', '分类', '适用系统', '软件大小', '更新日期', '下载链接', '简介', '备注', 'img']
        
        # 读取现有数据
        existing_data = []
        headers = []
        
        if os.path.exists(csv_file):
            with open(csv_file, 'r', encoding='utf-8-sig') as f:
                reader = csv.reader(f)
                headers = next(reader, [])
                existing_data = list(reader)
        
        # 确保headers是标准表头顺序，包含img字段
        headers = standard_headers
        
        # 准备要添加的数据
        row_data = {
            '软件名称': software_name,
            '版本': version,
            '分类': category,
            '适用系统': system,
            '软件大小': file_size_str,
            '更新日期': update_date,
            '下载链接': download_url,
            '简介': description,
            '备注': remark,
            'img': logo_url
        }
        
        # 将数据转换为列表，按headers顺序排列
        new_row = []
        for header in headers:
            new_row.append(row_data.get(header, ''))
        
        # 写入CSV文件
        with open(csv_file, 'w', newline='', encoding='utf-8-sig') as f:
            writer = csv.writer(f)
            writer.writerow(headers)
            writer.writerows(existing_data)
            writer.writerow(new_row)
        
        return redirect('/')
    
    return redirect(request.url)

# 下载文件路由
@app.route('/upload/<filename>')
def download_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename, as_attachment=True)

if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=80)
