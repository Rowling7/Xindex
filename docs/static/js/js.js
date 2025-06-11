//搜索功能
document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const engine = document.getElementById('engineSelect').value;
    const query = this.q.value.trim();
    if (query) {
        window.location.href = engine + encodeURIComponent(query);
    }
});

// 检测系统主题-适配暗黑模式
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
function setTheme() {
    document.documentElement.setAttribute('data-bs-theme',
        prefersDark.matches ? 'dark' : 'light');
}
prefersDark.addEventListener('change', setTheme);
setTheme(); // 初始化
