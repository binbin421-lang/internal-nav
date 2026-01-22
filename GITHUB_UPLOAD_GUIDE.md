# 将项目上传到GitHub的详细指南

## 1. 准备工作

### 1.1 确保项目已清理完成
- 确保`.gitignore`文件已正确配置（我们已创建）
- 确保项目中没有不必要的文件（如离线依赖、临时文件等）
- 确保项目结构清晰，文档完整

### 1.2 安装Git（如果未安装）

#### Linux
```bash
sudo apt update
sudo apt install git -y
```

#### Mac
```bash
# 使用Homebrew安装


# 或使用Xcode命令行工具
xcode-select --install
```

#### Windows
1. 下载Git安装包：https://git-scm.com/download/win
2. 运行安装程序，按照默认选项安装
3. 安装完成后，在命令行中验证：`git --version`

## 2. 在GitHub上创建新仓库

1. 登录GitHub账号：https://github.com
2. 点击右上角的「+」号，选择「New repository」
3. 填写仓库信息：
   - **Repository name**：输入仓库名称，如 `internal-tools-download-center`
   - **Description**：输入项目描述，如「基于Flask的内网常用工具下载中心」
   - **Visibility**：选择仓库可见性（Public或Private）
   - **Initialize this repository with**：不要勾选任何选项（因为我们要上传已有的本地项目）
4. 点击「Create repository」按钮
5. 复制仓库的HTTPS或SSH URL，用于后续本地仓库配置

## 3. 配置本地Git环境

### 3.1 初始化Git仓库

在项目根目录中执行以下命令：

```bash
cd /Users/icepot/Documents/trae_projects
# 初始化Git仓库
git init
```

### 3.2 配置Git用户信息

```bash
# 设置用户名（替换为你的GitHub用户名）
git config user.name "YourGitHubUsername"
# 设置邮箱（替换为你的GitHub注册邮箱）
git config user.email "your.email@example.com"
```

### 3.3 验证Git配置

```bash
git config --list
```

## 4. 添加和提交文件

### 4.1 查看当前状态

```bash
git status
```

### 4.2 添加所有文件到暂存区

```bash
# 添加所有文件（除了.gitignore中指定的文件）
git add .
# 或逐个添加文件
git add app.py requirements.txt data/ static/ templates/ DEPLOY.md ...
```

### 4.3 提交文件

```bash
# 提交文件，附带提交信息
git commit -m "Initial commit: 内网常用工具下载中心"
```

## 5. 关联远程仓库并推送

### 5.1 关联GitHub仓库

```bash
# 添加远程仓库（替换为你的仓库URL）
git remote add origin https://github.com/YourGitHubUsername/internal-tools-download-center.git
```

### 5.2 验证远程仓库关联

```bash
git remote -v
```

### 5.3 推送代码到GitHub

```bash
# 推送master分支到GitHub
git push -u origin master
```

如果需要输入GitHub凭证：
- **用户名**：输入你的GitHub用户名
- **密码**：输入你的GitHub个人访问令牌（PAT）

## 6. 使用SSH密钥（推荐）

使用SSH密钥可以避免每次推送时输入密码，更加安全和便捷。

### 6.1 生成SSH密钥

```bash
git config --global user.name "YourGitHubUsername"
git config --global user.email "your.email@example.com"
```

生成SSH密钥：

```bash
ssh-keygen -t ed25519 -C "your.email@example.com"
```

按Enter键使用默认路径，然后设置一个安全的密码（可选）。

### 6.2 添加SSH密钥到GitHub

1. 查看生成的SSH公钥：
   ```bash
   cat ~/.ssh/id_ed25519.pub
   ```

2. 复制输出的公钥内容

3. 登录GitHub，进入「Settings」→「SSH and GPG keys」→「New SSH key」
4. 粘贴公钥，设置一个标题（如「My Laptop」），点击「Add SSH key」

### 6.3 使用SSH URL关联远程仓库

```bash
# 先删除之前的HTTPS远程仓库（如果已添加）
git remote remove origin
# 使用SSH URL添加远程仓库
git remote add origin git@github.com:YourGitHubUsername/internal-tools-download-center.git
```

### 6.4 验证SSH连接

```bash
ssh -T git@github.com
```

如果出现「Hi YourGitHubUsername! You've successfully authenticated...」，表示SSH连接成功。

## 7. 推送后续更新

当你对项目进行了修改并想要推送到GitHub时，可以使用以下命令：

```bash
# 添加修改的文件
git add .
# 提交修改
git commit -m "描述你的修改内容"
# 推送更新
git push
```

## 8. 常见问题与解决方案

### 8.1 推送失败：权限问题

- 确保你拥有仓库的写入权限
- 检查SSH密钥是否正确配置
- 检查GitHub个人访问令牌是否有正确的权限

### 8.2 推送失败：分支保护

如果仓库启用了分支保护规则，你可能需要：
- 创建并推送新分支，然后创建Pull Request
- 或者联系仓库管理员修改保护规则

### 8.3 推送失败：本地分支与远程分支不一致

```bash
# 拉取远程更新并合并
git pull origin master
# 然后再次推送
git push origin master
```

### 8.4 忘记GitHub密码

- 如果使用HTTPS连接，可以使用GitHub个人访问令牌（PAT）作为密码
- 生成PAT：GitHub → Settings → Developer settings → Personal access tokens → Generate new token
- 确保勾选「repo」权限

## 9. 最佳实践

1. **定期提交**：每次完成一个功能或修复一个bug时，进行一次提交
2. **编写有意义的提交信息**：清晰描述本次提交的内容，便于后续查阅
3. **使用分支管理**：
   ```bash
   # 创建新分支
git checkout -b feature/new-feature
   # 切换回master分支
git checkout master
   ```
4. **定期拉取更新**：避免本地分支与远程分支差距过大
5. **保护主分支**：在GitHub上启用分支保护规则，确保主分支的稳定性

## 10. 后续操作

项目上传到GitHub后，你可以：
- 设置仓库的「Description」和「Topics」
- 创建「Release」版本
- 设置「Issues」模板
- 配置「GitHub Actions」自动测试和部署
- 邀请团队成员协作

## 11. 相关资源

- GitHub官方文档：https://docs.github.com/
- Git官方文档：https://git-scm.com/doc
- Git教程：https://git-scm.com/book/zh/v2

按照上述步骤，你应该能够顺利将项目上传到GitHub。如果遇到任何问题，可以查阅GitHub官方文档或在GitHub社区寻求帮助。
