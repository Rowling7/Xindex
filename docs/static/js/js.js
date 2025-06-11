// 检测系统颜色偏好
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// 从本地存储读取用户偏好
const storedTheme = localStorage.getItem('theme') ||
    (prefersDark ? 'dark' : 'light');

// 初始应用主题
document.documentElement.setAttribute('data-theme', storedTheme);

// 暗黑模式切换函数
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// 暴露给设置按钮
window.toggleTheme = toggleTheme;


//搜索功能
document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const engine = document.getElementById('engineSelect').value;
    const query = this.q.value.trim();
    if (query) {
        window.location.href = engine + encodeURIComponent(query);
    }
});



// 监听 Tab 切换事件
    /*
    *设置切换至widgetContainer时 隐藏footer,切换至linkContainer时显示footer
    */
document.addEventListener('DOMContentLoaded', function () {
    const viewTab = document.getElementById('viewTab');
    const footerContainer = document.getElementById('footerContainer');

    viewTab.addEventListener('shown.bs.tab', function (event) {
        // 判断当前激活的是哪个 Tab
        if (event.target.id === 'widget-tab') {
            footerContainer.classList.add('d-none'); // 隐藏 footer
        } else if (event.target.id === 'link-tab') {
            footerContainer.classList.remove('d-none'); // 显示 footer
        }
    });

    // 初始化状态检查
    const activeTab = document.querySelector('#viewTab .nav-link.active');
    if (activeTab && activeTab.id === 'widget-tab') {
        footerContainer.classList.add('d-none');
    }
});