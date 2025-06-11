let cardData = [
    {
        imgSrc: "static/background/bg001.png",
        title: "",
        description: "",
        alt: "",
    },
    {
        imgSrc: "static/background/bg002.png",
        title: "",
        description: "",
        alt: "",
    },
    {
        imgSrc: "static/background/bg003.png",
        title: "",
        description: "",
        alt: "",
    },
    {
        imgSrc: "static/background/bg004.png",
        title: "",
        description: "",
        alt: "",
    },
    {
        imgSrc: "static/background/bg005.png",
        title: "",
        description: "",
        alt: "",
    },
    {
        imgSrc: "static/background/bg006.png",
        title: "",
        description: "",
        alt: "",
    },
    {
        imgSrc: "static/background/bg007.jpg",
        title: "",
        description: "",
        alt: "",
    },
    {
        imgSrc: "static/background/bg008.jpg",
        title: "",
        description: "",
        alt: "",
    }
];
// 暗黑模式管理
const themeManager = {
    init: function () {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) document.body.classList.add(savedTheme);
        this.updateButtonIcon();
    },
    toggle: function () {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark-mode' : '');
        this.updateButtonIcon();
    },
    updateButtonIcon: function () {
        const icon = document.querySelector('#themeToggle i');
        icon.className = document.body.classList.contains('dark-mode')
            ? 'bi bi-sun'
            : 'bi bi-moon-stars';
    }
};

// 卡片生成函数
function renderCards() {
    const container = document.querySelector("[data-card-container]");
    container.innerHTML = "";

    cardData.forEach(item => {
        const col = documentTemplate();
        const card = createCardElement(item);
        col.appendChild(card);
        container.appendChild(col);
    });
}

// 创建卡片模板
function createCardElement(item) {
    const card = document.createElement("div");
    card.className = "card h-100 shadow-sm";
    card.style.borderRadius = "20px";

    // 创建图片元素并绑定点击事件
    const img = document.createElement("img");
    img.src = item.imgSrc;
    img.className = "card-img-top";
    img.alt = item.alt || "卡片图片";
    img.style.cssText = "height: 200px; object-fit: cover; border-radius: 18px; cursor: pointer;";
    img.addEventListener("click", () => {
        localStorage.setItem("selectedBackground", item.imgSrc);
        window.location.href = "index.html";
    });

    // 创建卡片内容
    const cardBody = document.createElement("div");
    cardBody.className = "card-body";
    cardBody.innerHTML = `
        <h5 class="card-title">${item.title || "默认标题"}</h5>
        <p class="card-text">${item.description || "暂无描述"}</p>
    `;

    // 组装卡片
    card.appendChild(img);
    card.appendChild(cardBody);
    return card;
}

// 创建列容器
function documentTemplate() {
    const col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4 mb-4";
    return col;
}


// 初始化
document.addEventListener("DOMContentLoaded", () => {
    themeManager.init();
    renderCards();

    // 绑定事件
    document.getElementById("themeToggle").addEventListener("click", () => {
        themeManager.toggle();
    });
});