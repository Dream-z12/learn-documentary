const actions = (() => {
    // --- 核心数据存储（带默认安全数据） ---
    let subjects = [];
    try {
        subjects = JSON.parse(localStorage.getItem('ns_multi_subjects')) || [];
    } catch (e) {
        subjects = [];
    }

    // 如果首次打开没有数据，默认注入两条高颜值测试轨道，防止页面空白
    if (subjects.length === 0) {
        subjects = [
            {
                id: 1,
                name: '高等数学极速破局',
                date: '2026-12-25',
                todos: [
                    { id: 101, text: '第一章：函数与极限', completed: true },
                    { id: 102, text: '第二章：导数与微分', completed: false }
                ],
                files: [],
                notes: '重点复习复合函数求导。'
            }
        ];
        localStorage.setItem('ns_multi_subjects', JSON.stringify(subjects));
    }

    let currentSubjectId = null;

    // --- 安全获取 DOM 元素的函数，防止因元素缺失导致报错挂起 ---
    function getEl(id) {
        return document.getElementById(id);
    }

    // --- 初始化入口 ---
    function init() {
        renderDashboard();
        setInterval(updateAllCountdowns, 1000); // 启动时间轨道同步
        
        // 安全绑定拖拽资料库
        const dropZone = getEl('dropZone');
        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.borderColor = 'var(--accent-dark)'; });
            dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = 'var(--glass-border)'; });
            dropZone.addEventListener('drop', (e) => { e.preventDefault(); actions.handleFileUpload(e.dataTransfer.files); });
        }
    }

    // --- 渲染主看板 ---
    function renderDashboard() {
        const container = getEl('subjectsContainer');
        if (!container) return; // 防御性保护

        if (subjects.length === 0) {
            container.innerHTML = `<p style="color:var(--text-muted); font-size:13px; margin:40px auto; letter-spacing:1px; text-align:center; width:100%;">💡 请在右上方注入新学科轨道</p>`;
            return;
        }

        container.innerHTML = subjects.map(sub => {
            const total = sub.todos ? sub.todos.length : 0;
            const done = sub.todos ? sub.todos.filter(t => t.completed).length : 0;
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

    function updateAllCountdowns() {
        document.querySelectorAll('.sub-countdown').forEach(el => {
            const dateStr = el.getAttribute('data-date');
            const distance = new Date(dateStr + "T00:00:00").getTime() - new Date().getTime();
            if (distance < 0 || isNaN(distance)) {
                el.innerText = "TARGET DATE ARRIVED";
                return;
            }
            const d = Math.floor(distance / 86400000);
            const h = Math.floor((distance % 86400000) / 3600000);
            el.innerText = `${d}D ${h}H REMAINING`;
        });
    }

    // --- 【添加轨道功能全修复】 ---
    function addSubject() {
        const nameInput = getEl('newSubjectName');
        const dateInput = getEl('newSubjectDate');
        
        if (!nameInput || !dateInput) return;
        
        const name = nameInput.value.trim();
        const date = dateInput.value;

        if (!name || !date) {
            alert('请填写学科名称并选择目标日期！');
            return;
        }

        // 写入新数据结构
        subjects.push({
            id: Date.now(),
            name: name,
            date: date,
            todos: [], 
            files: [], 
            notes: ''
        });
        
        // 清空输入框
        nameInput.value = ''; 
        dateInput.value = '';
        
        saveData();
        renderDashboard(); // 重新渲染主界面
    }

    function deleteSubject(id, event) {
        if (event) event.stopPropagation(); // 阻止事件穿透
        if (confirm('确认移除该学科轨道吗？')) {
            subjects = subjects.filter(s => s.id !== id);
            saveData();
            renderDashboard();
        }
    }

    // --- 路由交互逻辑 ---
    function enterWorkspace(id, event) {
        currentSubjectId = id;
        const sub = subjects.find(s => s.id === id);
        if (!sub) return;
        
        if (getEl('currentSubjectTitle')) getEl('currentSubjectTitle').innerText = sub.name;
        if (getEl('noteTextarea')) getEl('noteTextarea').value = sub.notes || '';

        if (getEl('mainDashboard')) getEl('mainDashboard').classList.remove('active');
        if (getEl('subjectWorkspace')) getEl('subjectWorkspace').classList.add('active');

        renderTodos();
        renderFiles();
    }

    function backToDashboard() {
        currentSubjectId = null;
        if (getEl('subjectWorkspace')) getEl('subjectWorkspace').classList.remove('active');
        if (getEl('mainDashboard')) getEl('mainDashboard').classList.add('active');
        renderDashboard();
    }

    // --- 章节/节点控制逻辑 ---
    function renderTodos() {
        const sub = subjects.find(s => s.id === currentSubjectId);
        const container = getEl('todoContainer');
        if (!sub || !container) return;

        container.innerHTML = (sub.todos || []).map(t => `
            <li class="todo-item ${t.completed ? 'completed' : ''}">
                <label style="display:flex; align-items:center; gap:12px; cursor:pointer; width:85%;">
                    <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="actions.toggleTodo(${t.id})">
                    <span>${t.text}</span>
                </label>
                <span onclick="actions.deleteTodo(${t.id})" style="cursor:pointer; color:var(--text-muted); font-size:11px;">✕</span>
            </li>
        `).join('');
    }

    function addTodo() {
        const input = getEl('newTaskInput');
        if (!input || !input.value.trim()) return;
        const sub = subjects.find(s => s.id === currentSubjectId);
        if (!sub) return;
        
        if (!sub.todos) sub.todos = [];
        sub.todos.push({ 
            id: Date.now(), 
            text: input.value.trim(), 
            completed: false 
        });
        
        input.value = '';
        saveData(); 
        renderTodos();
    }

    function toggleTodo(id) {
        const sub = subjects.find(s => s.id === currentSubjectId);
        if (!sub || !sub.todos) return;
        sub.todos = sub.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        saveData(); 
        renderTodos();
    }

    function deleteTodo(id) {
        const sub = subjects.find(s => s.id === currentSubjectId);
        if (!sub || !sub.todos) return;
        sub.todos = sub.todos.filter(t => t.id !== id);
        saveData(); 
        renderTodos();
    }

    function saveNotes() {
        const sub = subjects.find(s => s.id === currentSubjectId);
        const textarea = getEl('noteTextarea');
        if (sub && textarea) {
            sub.notes = textarea.value;
            saveData();
        }
    }

    function handleFileUpload(uploadedFiles) {
        const sub = subjects.find(s => s.id === currentSubjectId);
        if (!sub) return;
        if (!sub.files) sub.files = [];
        for (let file of uploadedFiles) {
            sub.files.push({ id: Date.now() + Math.random(), name: file.name });
        }
        saveData(); 
        renderFiles();
    }

    function renderFiles() {
        const sub = subjects.find(s => s.id === currentSubjectId);
        const container = getEl('fileContainer');
        if (!sub || !container) return;

        if (!sub.files || sub.files.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:var(--text-muted); font-size:12px; margin-top:25px;">NO MATERIALS RECOGNIZED</p>';
            return;
        }
        container.innerHTML = sub.files.map(f => `
            <li class="file-item">
                <span>📄 ${f.name}</span>
                <span onclick="actions.deleteFile(${f.id})" style="cursor:pointer;">✕</span>
            </li>
        `).join('');
    }

    function deleteFile(id) {
        const sub = subjects.find(s => s.id === currentSubjectId);
        if (!sub || !sub.files) return;
        sub.files = sub.files.filter(f => f.id !== id);
        saveData(); 
        renderFiles();
    }

    function saveData() {
        localStorage.setItem('ns_multi_subjects', JSON.stringify(subjects));
    }

    // 绑定初始化
    document.addEventListener('DOMContentLoaded', init);

    // 完美暴露所有外部 HTML 需要调用的核心接口
    return { 
        addSubject, 
        deleteSubject, 
        enterWorkspace, 
        backToDashboard, 
        addTodo, 
        toggleTodo, 
        deleteTodo, 
        saveNotes, 
        handleFileUpload, 
        deleteFile 
    };
})();
