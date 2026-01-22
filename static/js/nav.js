// 全局变量
let sites = [];
let filteredSites = [];
let categories = new Set();

// DOM 元素
const searchInput = document.getElementById('searchInput');
const sitesGrid = document.getElementById('sitesGrid');
const siteModal = document.getElementById('siteModal');
const closeModal = document.querySelector('.close');
const modalBody = document.getElementById('modalBody');
const categoryTabs = document.getElementById('categoryTabs');
const categoryArrowLeft = document.getElementById('categoryArrowLeft');
const categoryArrowRight = document.getElementById('categoryArrowRight');

// 当前选中的分类
let selectedCategory = '';

// 初始化
async function init() {
    try {
        // 加载网站数据
        await loadSites();
        
        // 初始化分类标签卡
        initCategoryTabs();
        
        // 渲染网站列表
        renderSites(sites);
        
        // 添加事件监听器
        addEventListeners();
    } catch (error) {
        console.error('初始化失败:', error);
        showEmptyState('加载网站数据失败，请检查网络连接或文件格式');
    }
}

// 加载网站数据
async function loadSites() {
    try {
        // 从 CSV 文件加载数据
        const response = await fetch('/data/example_sites.csv');
        const csvText = await response.text();
        
        // 解析 CSV 数据
        sites = parseCSV(csvText);
        filteredSites = [...sites];
        
        // 提取分类
        sites.forEach(site => {
            if (site.category) {
                categories.add(site.category);
            }
        });
    } catch (error) {
        console.error('加载网站数据失败:', error);
        throw error;
    }
}

// 解析 CSV 数据
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    if (lines.length === 0) return [];
    
    // 获取表头
    const headers = lines[0].split(',').map(header => header.trim());
    
    // 解析数据行
    const data = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length === headers.length) {
            const site = {};
            headers.forEach((header, index) => {
                site[header.toLowerCase()] = values[index].trim();
            });
            data.push(site);
        }
    }
    
    return data;
}

// 解析 CSV 行（处理包含逗号的字段）
function parseCSVLine(line) {
    const values = [];
    let currentValue = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            values.push(currentValue);
            currentValue = '';
        } else {
            currentValue += char;
        }
    }
    
    values.push(currentValue);
    return values;
}

// 初始化分类标签卡
function initCategoryTabs() {
    // 清空现有标签卡
    categoryTabs.innerHTML = '';
    
    // 添加全部分类标签
    const allTab = document.createElement('div');
    allTab.className = 'category-tab active';
    allTab.dataset.category = '';
    allTab.textContent = '全部分类';
    allTab.addEventListener('click', () => handleCategoryTabClick(''));
    categoryTabs.appendChild(allTab);
    
    // 添加分类标签卡
    categories.forEach(category => {
        const tab = document.createElement('div');
        tab.className = 'category-tab';
        tab.dataset.category = category;
        tab.textContent = category;
        tab.addEventListener('click', () => handleCategoryTabClick(category));
        categoryTabs.appendChild(tab);
    });
    
    // 检查是否需要显示箭头
    checkArrowsVisibility();
}

// 添加事件监听器
function addEventListeners() {
    // 搜索输入事件
    searchInput.addEventListener('input', handleSearch);
    
    // 分类标签卡箭头事件
    categoryArrowLeft.addEventListener('click', scrollCategoriesLeft);
    categoryArrowRight.addEventListener('click', scrollCategoriesRight);
    
    // 滚动事件，检查箭头显示
    categoryTabs.addEventListener('scroll', checkArrowsVisibility);
    
    // 窗口大小变化时检查箭头显示
    window.addEventListener('resize', checkArrowsVisibility);
    
    // 关闭模态框事件
    closeModal.addEventListener('click', closeSiteModal);
    
    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (e.target === siteModal) {
            closeSiteModal();
        }
    });
    
    // ESC 键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeSiteModal();
        }
    });
}

// 处理搜索
function handleSearch() {
    applyFilters();
}

// 处理分类标签卡点击
function handleCategoryTabClick(category) {
    // 更新选中状态
    document.querySelectorAll('.category-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // 更新选中的分类
    selectedCategory = category;
    
    // 应用筛选
    applyFilters();
}

// 滚动分类标签卡向左
function scrollCategoriesLeft() {
    categoryTabs.scrollBy({ left: -200, behavior: 'smooth' });
}

// 滚动分类标签卡向右
function scrollCategoriesRight() {
    categoryTabs.scrollBy({ left: 200, behavior: 'smooth' });
}

// 检查箭头显示状态
function checkArrowsVisibility() {
    // 显示或隐藏左箭头
    categoryArrowLeft.style.display = categoryTabs.scrollLeft > 0 ? 'flex' : 'none';
    
    // 显示或隐藏右箭头
    const isAtEnd = categoryTabs.scrollLeft + categoryTabs.clientWidth >= categoryTabs.scrollWidth - 10;
    categoryArrowRight.style.display = isAtEnd ? 'none' : 'flex';
}

// 应用筛选条件
function applyFilters() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    filteredSites = sites.filter(site => {
        // 搜索条件
        const matchesSearch = searchTerm === '' || 
            site.name.toLowerCase().includes(searchTerm) ||
            site.category.toLowerCase().includes(searchTerm) ||
            (site.description && site.description.toLowerCase().includes(searchTerm)) ||
            (site.url && site.url.toLowerCase().includes(searchTerm));
        
        // 分类条件
        const matchesCategory = selectedCategory === '' || site.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });
    
    // 渲染筛选后的网站列表
    renderSites(filteredSites);
}

// 渲染网站列表
function renderSites(sites) {
    if (sites.length === 0) {
        showEmptyState('没有找到匹配的网站');
        return;
    }
    
    sitesGrid.innerHTML = sites.map(site => createSiteCard(site)).join('');
    
    // 为网站卡片添加点击事件（直接跳转）
    document.querySelectorAll('.site-card').forEach(card => {
        card.addEventListener('click', () => {
            const siteId = card.querySelector('.detail-btn').getAttribute('onclick').match(/'([^']+)'/)[1];
            const site = sites.find(s => s.id === siteId);
            if (site && site.url) {
                // 更新访问量（前端模拟）
                updateVisitCount(siteId);
                // 跳转至网站
                window.open(site.url, '_blank');
            }
        });
    });
    
    // 为访问按钮添加访问量更新事件
    document.querySelectorAll('.visit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const siteId = btn.closest('.site-card').querySelector('.detail-btn').getAttribute('onclick').match(/'([^']+)'/)[1];
            updateVisitCount(siteId);
        });
    });
}

// 创建网站卡片
function createSiteCard(site) {
    return `
        <div class="software-card site-card">
            <div class="card-header">
                <div class="software-logo">
                    <img src="${site.logo || '/static/img/default-logo.svg'}" alt="${site.name}" onerror="this.src='/static/img/default-logo.svg'">
                </div>
                <div class="card-title-container">
                    <h3>${site.name}</h3>
                </div>
            </div>
            <div class="software-description">
                ${site.description || '暂无描述'}
            </div>
            <div class="card-actions">
                <button class="detail-btn" onclick="event.stopPropagation(); showSiteDetails('${site.id}')">查看详情</button>
                <a href="${site.url}" class="visit-btn" target="_blank">访问网站</a>
            </div>
        </div>
    `;
}

// 显示网站详情
function showSiteDetails(siteId) {
    const site = sites.find(s => s.id === siteId);
    if (!site) return;
    
    // 构建模态框内容
    modalBody.innerHTML = `
        <div class="modal-header-with-logo">
            <div class="modal-logo">
                <img src="${site.logo || '/static/img/default-logo.svg'}" alt="${site.name}" onerror="this.src='/static/img/default-logo.svg'">
            </div>
            <div>
                <h2>${site.name}</h2>
                <div style="color: #7f8c8d; font-size: 0.9em;">${site.category}</div>
            </div>
        </div>
        <div class="modal-meta">
            <div class="meta-row">
                <span class="meta-label">状态:</span>
                <span class="meta-value">${site.status || '未知'}</span>
            </div>
            <div class="meta-row">
                <span class="meta-label">URL:</span>
                <span class="meta-value"><a href="${site.url}" target="_blank" style="color: #3498db; text-decoration: none;">${site.url}</a></span>
            </div>
            <div class="meta-row">
                <span class="meta-label">更新日期:</span>
                <span class="meta-value">${site.update_date || '未知'}</span>
            </div>
            <div class="meta-row">
                <span class="meta-label">访问量:</span>
                <span class="meta-value">${site.visit_count || 0}</span>
            </div>
            ${site.contact ? `<div class="meta-row"><span class="meta-label">联系人:</span><span class="meta-value">${site.contact}</span></div>` : ''}
        </div>
        <div class="modal-section">
            <h3>网站描述</h3>
            <div class="modal-content-text">${site.description || '暂无描述'}</div>
        </div>
        ${site.remark ? `
        <div class="modal-section">
            <h3>备注信息</h3>
            <div class="modal-content-text">${site.remark}</div>
        </div>
        ` : ''}
        <div class="modal-actions">
            <a href="${site.url}" target="_blank" class="modal-download-btn" onclick="updateVisitCount('${site.id}')">
                访问网站
            </a>
        </div>
    `;
    
    // 显示模态框
    siteModal.style.display = 'block';
}

// 关闭网站详情模态框
function closeSiteModal() {
    siteModal.style.display = 'none';
}

// 更新访问量（前端模拟）
function updateVisitCount(siteId) {
    const siteIndex = sites.findIndex(s => s.id === siteId);
    if (siteIndex !== -1) {
        sites[siteIndex].visit_count = (sites[siteIndex].visit_count || 0) + 1;
        // 更新筛选后的数据
        const filteredIndex = filteredSites.findIndex(s => s.id === siteId);
        if (filteredIndex !== -1) {
            filteredSites[filteredIndex].visit_count = sites[siteIndex].visit_count;
        }
        // 重新渲染当前显示的网站列表
        renderSites(filteredSites);
    }
}

// 显示空状态
function showEmptyState(message) {
    sitesGrid.innerHTML = `
        <div class="empty-state">
            <p>${message}</p>
        </div>
    `;
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', init);
