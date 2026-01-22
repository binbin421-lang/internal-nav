# 内网常用工具下载中心

一个基于Flask开发的内网常用工具下载中心，提供软件分类展示、搜索、下载和管理功能。

## 📸 网站截图

![网站首页](https://example.com/screenshot-home.png)
![下载页面](https://example.com/screenshot-download.png)

## 🚀 功能特性

- **软件管理**：支持软件上传、下载、分类管理
- **分类展示**：软件按类别分组，支持水平滚动分类标签
- **搜索功能**：支持按软件名称、简介进行搜索
- **响应式设计**：适配不同屏幕尺寸，支持移动端访问
- **蓝色主题**：采用蓝色+白色主题，简洁美观
- **CSV数据库**：使用CSV文件作为数据库，易于维护
- **离线部署**：支持离线依赖安装，适合内网环境
- **Windows打包**：支持打包成Windows独立可执行文件

## 🛠️ 技术栈

- **后端**：Python 3.6+, Flask 2.0+
- **前端**：HTML5, CSS3, JavaScript
- **数据库**：CSV文件
- **打包工具**：PyInstaller

## 📦 快速开始

### 在线部署（有互联网连接）

```bash
# 克隆仓库
git clone https://github.com/binbin421-lang/internal-nav.git
cd internal-nav

# 安装依赖
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# 启动应用
python app.py
```

访问地址：http://localhost:80

### 离线部署（无互联网连接）

1. 先在有互联网的环境中下载依赖包：
   ```bash
   pip download -d deps -r requirements.txt
   ```

2. 将项目文件和deps目录一起上传到目标服务器

3. 执行离线安装：
   ```bash
   bash install_deps.sh
   ```

4. 启动应用：
   ```bash
   python app.py
   ```

## 📖 详细部署

### Linux部署

#### 1. 安装Python和依赖

```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv -y

python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### 2. 使用Gunicorn启动（生产环境推荐）

```bash
# 安装Gunicorn
pip install gunicorn

# 前台运行
gunicorn -w 4 -b 0.0.0.0:80 app:app

# 后台运行
gunicorn -w 4 -b 0.0.0.0:80 app:app --daemon
```

#### 3. 使用systemd管理服务

创建服务文件 `/etc/systemd/system/internal-nav.service`：

```ini
[Unit]
Description=Internal Network Tools Download Center
After=network.target

[Service]
User=www-data
WorkingDirectory=/path/to/internal-nav
Environment="PATH=/path/to/internal-nav/venv/bin"
ExecStart=/path/to/internal-nav/venv/bin/gunicorn -w 4 -b 0.0.0.0:80 app:app
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

启动并启用服务：

```bash
sudo systemctl daemon-reload
sudo systemctl start internal-nav
sudo systemctl enable internal-nav
```

### Windows部署

#### 1. 直接运行

```bash
# 安装依赖
pip install -r requirements.txt

# 启动应用
python app.py
```

#### 2. 打包成独立可执行文件

双击运行 `package_windows_fixed.bat` 脚本，脚本会自动安装依赖并打包应用。打包完成后，可执行文件位于 `package/dist/tools_download/` 目录中。

详细的Windows使用说明请查看 `README_WINDOWS.md` 文件。

## 📖 使用说明

### 访问应用

在浏览器中访问：http://localhost:80

### 添加软件

1. 访问上传页面：http://localhost:80/upload
2. 填写软件信息：名称、分类、简介、适用系统等
3. 上传软件文件和Logo图片
4. 点击「上传」按钮

### 修改软件信息

直接编辑 `data/example_tools.csv` 文件，修改相应的软件信息。

### 分类管理

软件分类信息直接从CSV文件中提取，无需额外配置。

## 📁 目录结构

```
internal-nav/
├── app.py                    # 主应用文件
├── requirements.txt         # 依赖列表
├── create_example.py        # 示例数据生成脚本
├── create_valid_excel.py    # Excel创建脚本
├── install_deps.sh          # 离线依赖安装脚本
├── package_windows_fixed.bat # Windows打包脚本
├── README.md               # 项目说明文档
├── README_WINDOWS.md        # Windows使用文档
├── DEPLOY.md                # 部署说明
├── GITHUB_UPLOAD_GUIDE.md   # GitHub上传指南
├── .gitignore               # Git忽略文件配置
├── data/                    # 数据目录
│   └── example_tools.csv    # 软件数据库
├── static/                  # 静态资源目录
│   ├── css/                 # CSS样式文件
│   ├── js/                  # JavaScript文件
│   └── img/                 # 图片资源
├── templates/               # 模板文件目录
│   ├── index.html           # 导航首页
│   ├── download.html        # 下载页面
│   └── upload.html          # 上传页面
└── uploads/                 # 软件文件存储目录
```

## 🔧 开发说明

### 环境搭建

```bash
# 克隆仓库
git clone https://github.com/binbin421-lang/internal-nav.git
cd internal-nav

# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 启动开发服务器
python app.py
```

### 生成示例数据

```bash
python create_example.py
```

### 运行测试

```bash
# 目前暂无测试用例，可直接运行应用进行手动测试
python app.py
```

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork本仓库
2. 创建功能分支：`git checkout -b feature/your-feature`
3. 提交更改：`git commit -m 'Add some feature'`
4. 推送到分支：`git push origin feature/your-feature`
5. 提交Pull Request

## 📄 许可证

MIT License

## 📞 联系方式

如有问题或建议，欢迎联系：

- GitHub Issues：https://github.com/binbin421-lang/internal-nav/issues
- 邮箱：binbin421@gmail.com

## 📊 更新日志

### v2.0.0 (2026-01-22)

- 重构项目结构，优化代码组织
- 支持Windows打包成独立可执行文件
- 完善离线依赖安装功能
- 更新响应式设计，适配移动端
- 优化蓝色主题，提升视觉效果
- 修复已知bug

### v1.0.0 (2025-12-30)

- 初始版本发布
- 实现软件上传、下载、分类管理功能
- 支持搜索和分类展示
- 响应式设计

---

**Star ⭐ 支持一下，感谢！**
