# 内网常用工具下载中心 - Windows独立运行版

## 项目概述

这是一个基于Flask框架开发的内网常用工具下载中心，可以通过PyInstaller打包成Windows独立可执行文件，无需额外部署操作，双击即可运行。

## 功能特性

- ✅ 无需Python环境，双击即可运行
- ✅ 支持软件上传、下载和管理
- ✅ 使用CSV文件作为数据库，无需配置数据库
- ✅ 支持自定义软件分类和搜索
- ✅ 响应式设计，适配不同屏幕尺寸
- ✅ 蓝色+白色主题，简洁美观

## 打包说明

### 环境要求

- Windows 7+ 操作系统
- Python 3.6+（仅用于打包，运行时不需要）

### 打包步骤

1. **下载项目文件**
   - 将项目文件下载到本地，确保包含所有必要文件

2. **运行打包脚本**
   - 找到并双击运行 `package_windows.bat` 脚本
   - 脚本会自动完成以下操作：
     - 检查Python和pip环境
     - 安装必要依赖（pyinstaller和flask）
     - 复制必要文件到打包目录
     - 运行PyInstaller进行打包

3. **获取可执行文件**
   - 打包完成后，可执行文件位于 `package/dist/tools_download/` 目录
   - 主要文件：`tools_download.exe`（主程序）

## 运行说明

### 启动程序

1. **双击运行**
   - 找到 `tools_download.exe` 文件
   - 双击运行，会弹出命令行窗口
   - 等待程序启动，看到以下信息表示启动成功：
     ```
     * Serving Flask app 'app' (lazy loading)
     * Environment: production
       WARNING: This is a development server. Do not use it in a production deployment.
       Use a production WSGI server instead.
     * Debug mode: off
     * Running on http://0.0.0.0:80/ (Press CTRL+C to quit)
     ```

2. **访问应用**
   - 在浏览器中输入 `http://localhost:80`
   - 即可访问内网常用工具下载中心

### 停止程序

1. **关闭命令行窗口**
   - 直接关闭弹出的命令行窗口即可停止程序

2. **使用快捷键**
   - 在命令行窗口中按 `Ctrl+C` 组合键停止程序

## 项目结构

```
tools_download/（打包后的目录）
├── tools_download.exe      # 主程序可执行文件
├── static/                 # 静态资源目录（CSS、JS、图片）
├── templates/              # 模板文件目录
├── data/                   # CSV数据库目录
└── uploads/                # 软件文件存储目录
```

## 数据管理

### 软件数据库

- 软件数据存储在 `data/example_tools.csv` 文件中
- 可以直接用Excel打开编辑
- 字段说明：
  - 软件名称：软件的名称
  - 版本：软件版本号
  - 分类：软件分类
  - 适用系统：适用的操作系统
  - 软件大小：软件文件大小
  - 更新日期：最后更新日期
  - 下载链接：软件下载地址
  - 简介：软件简介
  - 备注：备注信息
  - img：软件Logo路径

### 网站数据库

- 网站数据存储在 `data/example_sites.csv` 文件中
- 可以直接用Excel打开编辑

## 常见问题

### 1. 运行时提示缺少DLL文件

**解决方案**：
- 确保Windows系统已安装所有必要的运行时库
- 推荐安装 `Microsoft Visual C++ Redistributable for Visual Studio` 最新版本

### 2. 端口80被占用

**解决方案**：
- 修改 `app.py` 文件中的端口配置
- 找到以下代码并修改端口号：
  ```python
  if __name__ == '__main__':
      app.run(debug=False, host='0.0.0.0', port=80)  # 修改这里的端口号
  ```
- 修改后重新运行打包脚本

### 3. 软件上传失败

**解决方案**：
- 检查 `uploads` 目录是否存在且有写入权限
- 检查 `app.py` 中的 `MAX_CONTENT_LENGTH` 配置是否合适

### 4. 软件列表不显示

**解决方案**：
- 检查 `data/example_tools.csv` 文件格式是否正确
- 确保文件编码为UTF-8
- 检查文件路径是否正确

## 技术支持

- 项目基于Flask框架开发
- 使用CSV文件作为数据库
- 打包工具：PyInstaller 6.18.0

## 版本信息

- **版本**：1.0.0
- **更新日期**：2026-01-21
- **开发者**：内网管理团队

## 注意事项

1. 本程序使用Flask内置开发服务器，不建议在生产环境中直接使用
2. 建议仅在内网环境中使用，避免安全风险
3. 定期备份 `data` 和 `uploads` 目录，防止数据丢失
4. 如果需要修改代码，修改后需重新运行打包脚本生成新的可执行文件

---

**免责声明**：本程序仅用于内网环境，开发者不对使用本程序造成的任何损失负责。