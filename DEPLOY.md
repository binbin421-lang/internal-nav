# 内网常用工具下载中心 - 部署说明

## 1. 项目概述

### 1.1 功能介绍
这是一个基于Flask框架开发的内网常用工具下载中心，主要功能包括：
- 软件分类展示和搜索
- 软件下载功能
- 软件详情查看
- 软件上传管理
- 支持CSV格式数据库
- 响应式设计，支持移动端访问
- 支持离线依赖安装
- 支持Windows打包成独立可执行文件

### 1.2 技术栈
- **后端**：Python 3.6+、Flask 2.0+
- **前端**：HTML5、CSS3、JavaScript
- **数据库**：CSV文件
- **存储**：本地文件系统

## 2. 部署环境

### 2.1 支持的操作系统
- Linux（推荐）
- Windows

### 2.2 技术要求
- Python 3.6+（必须）
- 端口：80（默认）
- 磁盘空间：至少100MB（根据软件数量调整）
- 内存：至少512MB

## 3. 项目结构

```
内网常用工具下载中心/
├── app.py                    # 主应用文件
├── requirements.txt         # 依赖列表
├── create_example.py        # 示例数据生成脚本
├── create_valid_excel.py    # Excel创建脚本
├── install_deps.sh          # 离线依赖安装脚本
├── package_windows_fixed.bat # Windows打包脚本
├── README_WINDOWS.md        # Windows使用文档
├── DEPLOY.md                # 部署说明
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

## 4. 快速开始

### 4.1 在线部署（有互联网连接）

```bash
# 克隆或上传项目到服务器
git clone https://github.com/binbin421-lang/internal-nav.git
cd internal-nav

# 安装Python和pip（如果未安装）
sudo apt update
sudo apt install python3 python3-pip python3-venv -y

# 创建并激活虚拟环境
python3 -m venv venv
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 启动应用
python app.py
```

### 4.2 访问应用
在浏览器中访问：
- 本地访问：http://localhost:80
- 内网访问：http://服务器IP:80

## 5. 详细部署步骤

### 5.1 安装依赖

#### 5.1.1 在线安装

```bash
# 创建虚拟环境
python3 -m venv venv

# 激活虚拟环境
# Linux/Mac
. venv/bin/activate
# Windows
venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt
```

#### 5.1.2 离线安装

1. 首先在有互联网的环境中下载依赖包：
   ```bash
   pip download -d deps -r requirements.txt
   ```

2. 将`deps`目录和`install_deps.sh`脚本一起上传到目标服务器

3. 在目标服务器上执行离线安装：
   ```bash
   bash install_deps.sh
   ```

### 5.2 配置应用

#### 5.2.1 修改端口（可选）

如果需要修改默认端口（80），可以编辑`app.py`文件：

```python
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)  # 修改port参数
```

#### 5.2.2 修改文件上传大小限制（可选）

在`app.py`文件中修改：

```python
# 设置最大上传文件大小为500MB
app.config['MAX_CONTENT_LENGTH'] = 500 * 1024 * 1024
```

### 5.3 启动应用

#### 5.3.1 使用Flask内置服务器（开发/测试环境）

```bash
# 激活虚拟环境
source venv/bin/activate

# 启动应用
python app.py
```

#### 5.3.2 使用Gunicorn（生产环境推荐）

```bash
# 安装Gunicorn
pip install gunicorn

# 启动应用
# 方式1：前台运行
gunicorn -w 4 -b 0.0.0.0:80 app:app

# 方式2：后台运行
gunicorn -w 4 -b 0.0.0.0:80 app:app --daemon
```

#### 5.3.3 使用systemd管理服务（Linux生产环境推荐）

1. 创建服务文件 `/etc/systemd/system/tools-download.service`：

```ini
[Unit]
Description=Internal Network Tools Download Center
After=network.target

[Service]
User=www-data  # 根据实际情况修改用户
WorkingDirectory=/path/to/project  # 修改为项目实际路径
Environment="PATH=/path/to/project/venv/bin"  # 修改为虚拟环境路径
ExecStart=/path/to/project/venv/bin/gunicorn -w 4 -b 0.0.0.0:80 app:app
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

2. 启动并启用服务：

```bash
sudo systemctl daemon-reload
sudo systemctl start tools-download
sudo systemctl enable tools-download
```

3. 查看服务状态：

```bash
sudo systemctl status tools-download
```

## 6. 宝塔面板部署

### 6.1 添加网站

1. 登录宝塔面板
2. 点击左侧菜单的「网站」
3. 点击「添加站点」
4. **域名**：填写一个未使用的域名或直接使用服务器IP地址
5. **根目录**：设置为项目目录（如 `/www/wwwroot/tools`）
6. **项目类型**：选择「其他」
7. 点击「提交」

### 6.2 配置防火墙

1. 点击左侧菜单的「安全」
2. 点击「防火墙」
3. 点击「添加规则」
4. 端口：80（或您设置的其他端口）
5. 备注：内网工具下载中心
6. 点击「提交」

### 6.3 启动应用

1. 在宝塔面板中点击「终端」
2. 进入项目目录：`cd /www/wwwroot/tools`
3. 创建并激活虚拟环境：
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
4. 安装依赖：`pip install -r requirements.txt`
5. 启动应用：`gunicorn -w 4 -b 0.0.0.0:80 app:app --daemon`

### 6.4 访问应用

- 通过域名访问：http://您的域名
- 通过IP访问：http://服务器IP

## 7. Windows部署

### 7.1 直接运行Python脚本

1. 安装Python 3.6+（推荐3.9）
2. 安装依赖：`pip install -r requirements.txt`
3. 运行应用：`python app.py`
4. 访问：http://localhost:80

### 7.2 打包成独立可执行文件

1. 确保已安装Python 3.6+
2. 双击运行 `package_windows_fixed.bat` 脚本
3. 脚本会自动安装依赖并打包应用
4. 打包完成后，可执行文件位于 `package/dist/tools_download/` 目录中
5. 双击 `tools_download.exe` 即可运行应用

详细的Windows使用说明请查看 `README_WINDOWS.md` 文件。

## 8. 管理操作

### 8.1 添加软件

1. 访问上传页面：http://服务器IP:80/upload
2. 填写软件信息：名称、分类、简介、适用系统等
3. 上传软件文件和Logo图片
4. 点击「上传」按钮

### 8.2 修改软件信息

直接编辑 `data/example_tools.csv` 文件，修改相应的软件信息。

### 8.3 查看日志

- **Flask内置服务器日志**：直接在控制台查看
- **Gunicorn日志**：默认输出到控制台，可通过配置文件指定日志文件
- **systemd服务日志**：
  ```bash
  journalctl -u tools-download -f
  ```

## 9. 常见问题

### 9.1 页面无法访问

- 检查防火墙是否开放了相应端口
- 检查应用是否正在运行
- 检查端口是否被其他服务占用
  ```bash
  netstat -tuln | grep 80
  # 或
  lsof -i :80
  ```

### 9.2 软件列表无法显示

- 检查 `data/example_tools.csv` 文件是否存在
- 检查文件格式是否正确（CSV格式，UTF-8编码）
- 检查文件路径是否正确

### 9.3 上传文件失败

- 检查 `uploads/` 目录权限是否为755或775
- 检查文件大小是否超过了配置的最大限制
- 检查磁盘空间是否充足

### 9.4 图片无法显示

- 检查图片文件是否已正确上传
- 检查图片路径是否正确
- 检查 `static/img/` 目录权限

## 10. 维护建议

1. **定期备份数据**：定期备份 `data/example_tools.csv` 文件，防止数据丢失
2. **定期清理文件**：定期清理 `uploads/` 目录中不再使用的软件文件
3. **使用稳定版本**：在生产环境中使用稳定版本的依赖包
4. **配置访问控制**：考虑添加访问控制，限制上传功能的访问
5. **监控应用状态**：定期检查应用运行状态和日志
6. **更新依赖**：定期更新依赖包，修复安全漏洞

## 11. 版本信息

- **版本**：2.0.0
- **更新日期**：2026-01-22
- **开发者**：内网管理团队
- **GitHub仓库**：https://github.com/binbin421-lang/internal-nav.git

## 12. 联系方式

如有问题或建议，欢迎联系：
- 邮箱：admin@example.com
- 内网论坛：http://forum.example.com

---

**最后更新时间**：2026-01-22
