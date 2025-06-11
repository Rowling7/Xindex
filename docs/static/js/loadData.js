fetch('static/data/data.json')
    .then(response => response.json())
    .then(data => {
        const navContainer = document.getElementById('category-nav');
        const contentContainer = document.getElementById('content-container');

        data.forEach((category, index) => {
            // 生成导航项
            const navItem = document.createElement('li');
            navItem.className = 'nav-item';
            const navLink = document.createElement('a');
            navLink.className = `nav-link${index === 0 ? ' active' : ''}`;
            navLink.dataset.bsToggle = "tab";
            navLink.href = `#tab-${category.name}`;
            navLink.textContent = category.name;
            navItem.appendChild(navLink);
            navContainer.appendChild(navItem);

            // 生成内容tab-pane
            const tabPane = document.createElement('div');
            tabPane.className = `tab-pane fade${index === 0 ? ' show active' : ''}`;
            tabPane.id = `tab-${category.name}`;
            const gridLayout = document.createElement('div');
            gridLayout.className = 'grid-layout'; // 修改关键点

            category.children.forEach(child => {
                const card = document.createElement('a');
                card.className = 'text-decoration-none'; // 移除col类
                card.href = child.target;
                card.target = '_blank';
                card.innerHTML = `
                    <div class="card h-100 shadow-sm border-0 bg-light">
                    <div class="card-img-container" style="background-image: url('${child.bgImage}')"></div>
                    <div class="card-text-container">
                        <h6 class="card-title">${child.name}</h6>
                    </div>
                    </div>`;
                gridLayout.appendChild(card); // 直接附加到grid容器
            });

            tabPane.appendChild(gridLayout);
            contentContainer.appendChild(tabPane);
        });
    })
    .catch(error => console.error('Error:', error));
