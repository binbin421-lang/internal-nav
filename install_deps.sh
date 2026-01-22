#!/bin/bash

# 内网环境离线安装依赖脚本
echo "开始安装依赖..."

# 检查Python是否安装
if ! command -v python3 &> /dev/null; then
    echo "错误：未安装Python 3"
    exit 1
fi

# 检查pip是否安装
if ! command -v pip3 &> /dev/null; then
    echo "错误：未安装pip 3"
    exit 1
fi

# 安装项目依赖
echo "安装项目依赖..."
pip3 install --no-index --find-links=./deps -r requirements.txt

echo "依赖安装完成！"
