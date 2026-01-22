// 全局变量，存储软件数据
let softwareList = [];
let categories = new Set();
let systems = new Set();

// DOM元素
const searchInput = document.getElementById('searchInput');
const categoryFilter = document.getElementById('categoryFilter');
const systemFilter = document.getElementById('systemFilter');
const softwareGrid = document.getElementById('softwareGrid');
const totalSoftware = document.getElementById('totalSoftware');
const totalCategories = document.getElementById('totalCategories');
const totalDownloads = document.getElementById('totalDownloads');
const softwareModal = document.getElementById('softwareModal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementsByClassName('close')[0];

// 初始化事件监听
function initEventListeners() {
    // 监听搜索输入
    searchInput.addEventListener('input', handleSearch);
    
    // 监听分类筛选
    categoryFilter.addEventListener('change', handleSearch);
    
    // 监听系统筛选
    systemFilter.addEventListener('change', handleSearch);
    
    // 监听模态框关闭
    closeModal.addEventListener('click', () => {
        softwareModal.style.display = 'none';
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === softwareModal) {
            softwareModal.style.display = 'none';
        }
    });
}

// 自动加载CSV文件
function autoLoadCSV() {
    fetch('/data/example_tools.csv')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load CSV file');
            }
            return response.text();
        })
        .then(text => {
            // 解析CSV数据
            const lines = text.split('\n').filter(line => line.trim());
            if (lines.length === 0) {
                throw new Error('CSV file is empty');
            }
            
            // 获取表头
            const headers = lines[0].split(',').map(header => header.trim());
            
            // 解析数据行
            const jsonData = [];
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',').map(value => value.trim());
                const item = {};
                
                // 确保所有标准字段都存在，包括img字段
                const standardHeaders = ['软件名称', '版本', '分类', '适用系统', '软件大小', '更新日期', '下载链接', '简介', '备注', 'img'];
                
                // 先初始化所有标准字段
                standardHeaders.forEach(header => {
                    item[header] = '';
                });
                
                // 然后填充CSV中的数据
                headers.forEach((header, index) => {
                    item[header] = values[index] || '';
                });
                
                jsonData.push(item);
            }
            
            processSoftwareData(jsonData);
        })
        .catch(error => {
            console.error('Error loading CSV file:', error);
            softwareGrid.innerHTML = `
                <div class="empty-state">
                    <p>无法加载软件列表</p>
                    <p class="empty-hint">请检查example_tools.csv文件是否存在</p>
                </div>
            `;
        });
}

// 处理软件数据
function processSoftwareData(data) {
    // 验证数据格式
    if (!data || data.length === 0) {
        softwareGrid.innerHTML = `
            <div class="empty-state">
                <p>CSV文件中没有数据</p>
            </div>
        `;
        return;
    }
    
    // 验证必填字段
    const requiredFields = ['软件名称', '版本', '分类', '下载链接'];
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        for (const field of requiredFields) {
            if (!item[field]) {
                console.warn(`第${i + 2}行缺少必填字段：${field}`);
                // 继续处理，不中断
            }
        }
        // 为每个软件添加下载次数记录
        if (!item.downloadCount) {
            item.downloadCount = 0;
        }
    }
    
    // 存储软件数据
    softwareList = data;
    
    // 提取分类和系统
    categories.clear();
    systems.clear();
    softwareList.forEach(item => {
        categories.add(item['分类']);
        if (item['适用系统']) {
            systems.add(item['适用系统']);
        }
    });
    
    // 更新筛选器
    updateCategoryFilter();
    updateSystemFilter();
    
    // 更新统计信息
    updateStats();
    
    // 渲染软件列表
    renderSoftwareList(softwareList);
}

// 更新分类筛选下拉框
function updateCategoryFilter() {
    // 清空现有选项（保留"全部分类"）
    categoryFilter.innerHTML = '<option value="">全部分类</option>';
    
    // 添加新分类选项
    const sortedCategories = Array.from(categories).sort();
    sortedCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// 更新系统筛选下拉框
function updateSystemFilter() {
    // 清空现有选项（保留"全部系统"）
    systemFilter.innerHTML = '<option value="">全部系统</option>';
    
    // 添加新系统选项
    const sortedSystems = Array.from(systems).sort();
    sortedSystems.forEach(system => {
        const option = document.createElement('option');
        option.value = system;
        option.textContent = system;
        systemFilter.appendChild(option);
    });
}

// 更新统计信息
function updateStats() {
    if (totalSoftware) {
        totalSoftware.textContent = softwareList.length;
    }
    if (totalCategories) {
        totalCategories.textContent = categories.size;
    }
    if (totalDownloads) {
        totalDownloads.textContent = softwareList.reduce((sum, item) => sum + (item.downloadCount || 0), 0);
    }
}

// 渲染软件列表
function renderSoftwareList(list) {
    if (list.length === 0) {
        softwareGrid.innerHTML = `
            <div class="empty-state">
                <p>没有找到匹配的软件</p>
            </div>
        `;
        return;
    }
    
    const html = list.map((item, index) => {
        return `
            <div class="software-card download-card">
                <div class="card-header">
                    ${item['img'] ? `<div class="software-logo"><img src="${item['img']}" alt="${item['软件名称']} Logo" onerror="this.src='/static/img/default-logo.svg'"></div>` : `<div class="software-logo default-logo">软件</div>`}
                    <div class="card-title-container">
                        <h3>${item['软件名称']}</h3>
                        <div class="software-meta">
                            ${item['适用系统'] ? `<span class="meta-item">平台：${item['适用系统']}</span>` : ''}
                        </div>
                    </div>
                </div>
                ${item['简介'] ? `<div class="software-description">${item['简介']}</div>` : ''}
                <div class="card-actions">
                    <button class="detail-btn" onclick="openSoftwareModal(${index})">详细信息</button>
                    <a href="${item['下载链接']}" class="download-btn" target="_blank" onclick="incrementDownload(${index})">直接下载</a>
                </div>
            </div>
        `;
    }).join('');
    
    softwareGrid.innerHTML = html;
    
    // 为软件卡片添加点击事件（直接下载）
    document.querySelectorAll('.download-card').forEach((card, index) => {
        card.addEventListener('click', () => {
            const item = list[index];
            if (item && item['下载链接']) {
                incrementDownload(index);
                window.open(item['下载链接'], '_blank');
            }
        });
    });
    
    // 为详情按钮添加阻止冒泡事件
    document.querySelectorAll('.download-card .detail-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
}

// 打开软件详情弹窗
function openSoftwareModal(index) {
    const item = softwareList[index];
    modalBody.innerHTML = `
        <div class="modal-header-with-logo">
            ${item['img'] ? `<div class="modal-logo"><img src="${item['img']}" alt="${item['软件名称']} Logo"></div>` : ''}
            <h2>${item['软件名称']}</h2>
        </div>
        <div class="modal-meta">
            <div class="meta-row">
                <span class="meta-label">版本：</span>
                <span class="meta-value">${item['版本']}</span>
            </div>
            <div class="meta-row">
                <span class="meta-label">分类：</span>
                <span class="meta-value">${item['分类']}</span>
            </div>
            ${item['适用系统'] ? `
                <div class="meta-row">
                    <span class="meta-label">适用系统：</span>
                    <span class="meta-value">${item['适用系统']}</span>
                </div>
            ` : ''}
            ${item['软件大小'] ? `
                <div class="meta-row">
                    <span class="meta-label">软件大小：</span>
                    <span class="meta-value">${item['软件大小']}</span>
                </div>
            ` : ''}
            ${item['更新日期'] ? `
                <div class="meta-row">
                    <span class="meta-label">更新日期：</span>
                    <span class="meta-value">${item['更新日期']}</span>
                </div>
            ` : ''}
            <div class="meta-row">
                <span class="meta-label">下载次数：</span>
                <span class="meta-value">${item.downloadCount || 0} 次</span>
            </div>
        </div>
        ${item['简介'] ? `
            <div class="modal-section">
                <h3>软件简介</h3>
                <div class="modal-content-text">${item['简介']}</div>
            </div>
        ` : ''}
        ${item['备注'] ? `
            <div class="modal-section">
                <h3>备注信息</h3>
                <div class="modal-content-text">${item['备注']}</div>
            </div>
        ` : ''}
        <div class="modal-actions">
            <a href="${item['下载链接']}" class="modal-download-btn" target="_blank" onclick="incrementDownload(${index})">
                立即下载
            </a>
        </div>
    `;
    softwareModal.style.display = 'block';
}

// 增加下载次数
function incrementDownload(index) {
    softwareList[index].downloadCount = (softwareList[index].downloadCount || 0) + 1;
    updateStats();
    renderSoftwareList(filterSoftwareList());
}

// 过滤软件列表
function filterSoftwareList() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = categoryFilter.value;
    const selectedSystem = systemFilter.value;
    
    let filteredList = softwareList;
    
    // 按分类筛选
    if (selectedCategory) {
        filteredList = filteredList.filter(item => item['分类'] === selectedCategory);
    }
    
    // 按系统筛选
    if (selectedSystem) {
        filteredList = filteredList.filter(item => item['适用系统'] === selectedSystem);
    }
    
    // 按关键词搜索
    if (searchTerm) {
        filteredList = filteredList.filter(item => {
            return item['软件名称'].toLowerCase().includes(searchTerm) ||
                   item['分类'].toLowerCase().includes(searchTerm) ||
                   (item['适用系统'] && item['适用系统'].toLowerCase().includes(searchTerm)) ||
                   (item['简介'] && item['简介'].toLowerCase().includes(searchTerm)) ||
                   (item['备注'] && item['备注'].toLowerCase().includes(searchTerm));
        });
    }
    
    return filteredList;
}

// 处理搜索和筛选
function handleSearch() {
    const filteredList = filterSoftwareList();
    renderSoftwareList(filteredList);
}

// 初始化应用
function init() {
    initEventListeners();
    // 页面加载时自动读取CSV文件
    autoLoadCSV();
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);