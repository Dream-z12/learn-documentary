const actions = (() => {
    // --- 核心数据结构：精简多科目沙盒 ---
    let subjects = JSON.parse(localStorage.getItem('ns_multi_subjects')) || [
        {
            id: 1,
            name: '高等数学极速破局',
            date: '2026-12-25',
            todos: [
                { id: 101, text: '第一章：函数与极限', completed: true },
                { id: 102, text: '第二章：导数与微分', completed: false },
                { id: 103, text: '第三章：中值定理与导数应用', completed: false }
            ],
            files: [],
            notes: '重点攻克第二章的复合函数求导。'
        },
        {
            id: 2,
            name: '大学英语四六级',
            date: '2026-06-20',
            todos: [
                { id: 104, text: '核心词汇高频词背诵', completed: true }
            ],
            files: [],
            notes: ''
        }
    ];

    let currentSubjectId = null;

    // --- 初始化应用 ---
    function init() {
        renderDashboard();
        setInterval(updateAllCountdowns, 1000); // 每一秒原子化刷新所有倒计时
        
        // 绑定详情页物料拖拽区事件
        const dropZone = document.getElementById('dropZone');
        if(dropZone){
            dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.borderColor = 'var(--accent-dark)'; });
            dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = 'var(--glass-border)'; });
            dropZone.addEventListener('drop', (e) => { e.preventDefault(); actions.handleFileUpload(e.dataTransfer.files); });
        }
    }

    // --- 视图一：渲染主看板（计算多科目进度条） ---
    function renderDashboard() {
        const container = document.getElementById('subjectsContainer');
        if (subjects.length === 0) {
            container.innerHTML = `<p style="color:var(--text-muted); font-size:13px; margin:40px auto; letter-spacing:1px;">CREATE YOUR FIRST SUBJECT TRACK</p>`;
            return;
        }

        container.innerHTML = subjects.map(sub => {
            // 根据当前学科下的章节/任务总数及勾选情况，动态计算完成率
            const total = sub.todos.length;
            const done = sub.todos.filter(t => t.completed).length;
            const pct = total === 0 ? 0 : Math.round((done / total) * 100);

            return `
                <div class="subject-card" onclick="actions.enterWorkspace(${sub.id}, event)">
                    <button class="btn-delete-sub" onclick="actions.deleteSubject(${sub.id}, event)">REMOVE</button>
                    <h3 class="sub-title">${sub.name}</h3>
                    <div class="sub-countdown" data-date="${sub.date}">CALCULATING...</div>
                    
                    <div class="linear-progress-wrapper">
                        <div class="linear-progress-info">
                            <span>完成度</span>
                            <span>${pct}% (${done}/${total} 章节)</span>
                        </div>
                        <div class="linear-progress-bar">
                            <div class="linear-progress-fill" style="width: ${pct}%"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        updateAllCountdowns();
    }

    // 精确倒计时引擎
    function updateAllCountdowns() {
        document.querySelectorAll('.sub-countdown').forEach(el => {
            const dateStr = el.getAttribute('data-date');
            const distance = new Date(dateStr + "T00:00:00").getTime() - new Date().getTime();
            if (distance < 0 || isNaN(distance)) {
                el.innerText = "TARGET DATE ARRIVED";
                return;
            }
            const d = Math.floor(distance / 86400000);
            const h = Math.floor((distance % 86400000) /
        
