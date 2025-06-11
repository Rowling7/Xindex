
// 搜索功能 Search-----开始
// 下拉菜单交互逻辑
const trigger = document.querySelector('.triggerName');
const options = document.querySelector('.custom-options');
const nativeSelect = document.getElementById('engineSelect');

// 点击触发按钮
trigger.addEventListener('click', function (e) {
    e.stopPropagation();
    const isOpen = options.classList.contains('flex');

    if (isOpen) {
        // 关闭菜单逻辑
        options.classList.add('none');
        options.classList.remove('flex');
        setTimeout(() => {
            options.style.display = 'none';
        }, 300);
    } else {
        // 打开菜单逻辑
        options.style.display = 'flex';
        requestAnimationFrame(() => {
            options.classList.add('flex');
            options.classList.remove('none');
        });
    }
});

document.addEventListener('click', function (e) {
    if (!options.contains(e.target) && !trigger.contains(e.target)) {
        options.classList.add('none'); // 添加隐藏动画类
        options.classList.remove('flex');
        setTimeout(() => {
            options.style.display = 'none';
        }, 300); // 确保动画完成后再设置display: none
    }
});

// 选择选项
document.querySelectorAll('.option').forEach(option => {
    option.addEventListener('click', function () {
        const value = this.textContent;
        trigger.textContent = value;
        nativeSelect.value = this.dataset.value;
        document.getElementById('engineselect').value = this.dataset.value;
        options.style.display = 'none';
        options.classList.remove('flex');
        options.classList.add('none');
    });
});

// 关闭菜单
document.addEventListener('click', function (e) {
    if (!options.contains(e.target) && !trigger.contains(e.target)) {
        options.classList.add('none');
        options.classList.remove('flex');
        setTimeout(() => {
            options.style.display = 'none';
        }, 300);
    }
});

// 阻止表单冒泡
options.addEventListener('click', function (e) {
    e.stopPropagation();
});
// 监听窗口变化并同步宽度
function updateOptionsWidth() {
    const formWidth = document.querySelector('.searchForm').offsetWidth;
    const optionsWidth = formWidth - 22;
    document.querySelector('.custom-options').style.width = `${optionsWidth}px`;
}

// 初始化及事件绑定
window.addEventListener('resize', updateOptionsWidth);
updateOptionsWidth();
document.getElementById('searchForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const engineUrl = nativeSelect.value;
    const query = document.querySelector('input[name="query"]').value.trim();
    if (query) {
        window.location.href = engineUrl + encodeURIComponent(query);
    }
});
// 搜索功能-----结束


//动态调整Dynamic Adjustment-----开始
/* 宽度检测函数 */
function isMobile() {
    return window.innerWidth <= 1100;
}

// 列表展示
const columnControl = document.getElementById("columnCount");
const gridContainer = document.getElementById("content-container");
const columnBaseWidth = 200; // 单列基准宽度
const tabsContainer = document.getElementById("bottomContainer");
const searchContainer = document.getElementById("search-container");

/* 初始列数设置 */
const calculateColumns = () => {
    return Math.min(8, Math.max(1, Math.floor(window.innerWidth / columnBaseWidth))
    );
};
columnControl.value = calculateColumns(); // 统一调用

// 事件监听（新增resize时的列数调整）
columnControl.addEventListener("input", updateColumns);
columnControl.addEventListener("change", updateColumns);

// 优化后的防抖resize处理
let resizeTimer;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        /* 根据当前设备宽度调整列数 */
        if (isMobile()) {
            columnControl.value = Math.min(10, Math.max(1, Math.floor(window.innerWidth / columnBaseWidth)));
        } else {
            columnControl.value = Math.min(10, Math.max(1, Math.floor(window.innerWidth / columnBaseWidth)));
        }
        updateColumns();
        //initWeightLayout();
    }, 200);
});

function updateColumns() {
    const count = parseInt(columnControl.value);
    const containerWidth = gridContainer.offsetWidth;
    // 动态计算卡片宽度
    const gapTotal = 20 * (count - 1);
    const cardWidth = Math.max(20, (containerWidth - gapTotal - 40) / count);
    document.querySelectorAll(".tab-content").forEach((content) => {
        content.style.gridTemplateColumns = `repeat(${count}, minmax(${cardWidth}px, 1fr))`;
    });
}
//动态调整-----结束

