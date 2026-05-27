// --- 1. 数据强行初始化与清洗 ---
let subjects = [];
try {
    let localData = localStorage.getItem('ns_multi_subjects');
    // 如果之前保存的数据格式不对，强制清空，防止卡死
    if (localData && localData.startsWith('[')) {
        subjects = JSON.parse(localData);
    } else {
        subjects = [];
    }
} catch (e) {
    subjects = [];
}

// 默认初始数据
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

// --- 2. 页面加载完毕后的启动器 ---
document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
    setInterval(updateAllCountdowns, 1000);
});

// --- 3. 全局核心交互函数（直接挂载到 window，确保 HTML 100% 能调用） ---

window.renderDashboard = function() {
    const container = document.getElementById('subjectsContainer');
    if (!container) return;

    if (subjects.length === 0) {
        container.innerHTML = `<p style="color:var(--text-muted); font-size:13px; margin:40px auto; text-align:center; width:100%;">💡 请在右上方注入新学科轨道</p>`;
        return;
    }

    container.innerHTML = subjects.map(sub => {
        const total = sub.todos ? sub.todos.length : 0;
        const done = sub.todos ? sub.todos.filter(t => t.completed).length : 0;
        const pct = total === 0 ? 0 : Math.round((done / total) * 100);

        return `
            <div class="subject-card" onclick="globalEnterWorkspace(${sub.id})">
                <button class="btn-delete-sub" onclick="globalDeleteSubject(${sub.id}, event)">REMOVE</button>
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
};

window.updateAllCountdowns = function() {
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
};

// 【彻底修复：添加轨道】
window.globalAddSubject = function() {
    const nameInput = document.getElementById('newSubjectName');
    const dateInput = document.getElementById('newSubjectDate');
    
    if (!nameInput || !dateInput) return;
    
    const name = nameInput.value.trim();
    const date = dateInput.value;

    if (!name || !date) {
        alert('请填写学科名称并选择目标日期！');
        return;
    }

    subjects.push({
        id: Date.now(),
        name: name,
        date: date,
        todos: [], 
        files: [], 
        notes: ''
    });
    
    nameInput.value = ''; 
    dateInput.value = '';
    
    localStorage.setItem('ns_multi_subjects', JSON.stringify(subjects));
    renderDashboard();
};

window.globalDeleteSubject = function(id, event) {
    if (event) event.stopPropagation();
    if (confirm('确认移除该学科轨道吗？')) {
        subjects = subjects.filter(s => s.id !== id);
        localStorage.setItem('ns_multi_subjects', JSON.stringify(subjects));
        renderDashboard();
    }
};

window.globalEnterWorkspace = function(id) {
    currentSubjectId = id;
    const sub = subjects.find(s => s.id === id);
    if (!sub) return;
    
    if (document.getElementById('currentSubjectTitle')) document.getElementById('currentSubjectTitle').innerText = sub.name;
    if (document.getElementById('noteTextarea')) document.getElementById('noteTextarea').value = sub.notes || '';

    if (document.getElementById('mainDashboard')) document.getElementById('mainDashboard').classList.remove('active');
    if (document.getElementById('subjectWorkspace')) document.getElementById('subjectWorkspace').classList.add('active');

    globalRenderTodos();
    globalRenderFiles();
};

window.globalBackToDashboard = function() {
    currentSubjectId = null;
    if (document.getElementById('subjectWorkspace')) document.getElementById('subjectWorkspace').classList.remove('active');
    if (document.getElementById('mainDashboard')) document.getElementById('mainDashboard').classList.add('active');
    renderDashboard();
};

window.globalRenderTodos = function() {
    const sub = subjects.find(s => s.id === currentSubjectId);
    const container = document.getElementById('todoContainer');
    if (!sub || !container) return;

    container.innerHTML = (sub.todos || []).map(t => `
        <li class="todo-item">
            <label style="display:flex; align-items:center; gap:12px; cursor:pointer; width:85%;">
                <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="globalToggleTodo(${t.id})">
                <span style="${t.completed ? 'text-decoration:line-through; opacity:0.3;' : ''}">${t.text}</span>
            </label>
            <span onclick="globalDeleteTodo(${t.id})" style="cursor:pointer; color:var(--text-muted); font-size:11px;">✕</span>
        </li>
    `).join('');
};

window.globalAddTodo = function() {
    const input = document.getElementById('newTaskInput');
    if (!input || !input.value.trim()) return;
    const sub = subjects.find(s => s.id === currentSubjectId);
    if (!sub) return;
    
    if (!sub.todos) sub.todos = [];
    sub.todos.push({ id: Date.now(), text: input.value.trim(), completed: false });
    input.value = '';
    localStorage.setItem('ns_multi_subjects', JSON.stringify(subjects));
    globalRenderTodos();
};

window.globalToggleTodo = function(id) {
    const sub = subjects.find(s => s.id === currentSubjectId);
    if (!sub || !sub.todos) return;
    sub.todos = sub.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    localStorage.setItem('ns_multi_subjects', JSON.stringify(subjects));
    globalRenderTodos();
};

window.globalDeleteTodo = function(id) {
    const sub = subjects.find(s => s.id === currentSubjectId);
    if (!sub || !sub.todos) return;
    sub.todos = sub.todos.filter(t => t.id !== id);
    localStorage.setItem('ns_multi_subjects', JSON.stringify(subjects));
    globalRenderTodos();
};

window.globalSaveNotes = function() {
    const sub = subjects.find(s => s.id === currentSubjectId);
    const textarea = document.getElementById('noteTextarea');
    if (sub && textarea) {
        sub.notes = textarea.value;
        localStorage.setItem('ns_multi_subjects', JSON.stringify(subjects));
    }
};

window.globalHandleFileUpload = function(uploadedFiles) {
    const sub = subjects.find(s => s.id === currentSubjectId);
    if (!sub) return;
    if (!sub.files) sub.files = [];
    for (let file of uploadedFiles) {
        sub.files.push({ id: Date.now() + Math.random(), name: file.name });
    }
    localStorage.setItem('ns_multi_subjects', JSON.stringify(subjects));
    globalRenderFiles();
};

window.globalRenderFiles = function() {
    const sub = subjects.find(s => s.id === currentSubjectId);
    const container = document.getElementById('fileContainer');
    if (!sub || !container) return;

    if (!sub.files || sub.files.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:var(--text-muted); font-size:12px; margin-top:25px;">NO MATERIALS RECOGNIZED</p>';
        return;
    }
    container.innerHTML = sub.files.map(f => `
        <li class="file-item">
            <span>📄 ${f.name}</span>
            <span onclick="globalDeleteFile(${f.id})" style="cursor:pointer;">✕</span>
        </li>
    `).join('');
};

window.globalDeleteFile = function(id) {
    const sub = subjects.find(s => s.id === currentSubjectId);
    if (!sub || !sub.files) return;
    sub.files = sub.files.filter(f => f.id !== id);
    localStorage.setItem('ns_multi_subjects', JSON.stringify(subjects));
    globalRenderFiles();
};
