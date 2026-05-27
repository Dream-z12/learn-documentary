const actions = (() => {
    let subjects = JSON.parse(localStorage.getItem('ns_multi_subjects')) || [
        {
            id: 1,
            name: '考研政治核心演练',
            date: '2026-12-25',
            todos: [{ id: 101, text: '马原第一章概念梳理', completed: true }],
            files: [{ id: 201, name: '核心思维导图大纲.pdf' }],
            notes: '政治网盘资料在第3个复习收藏夹。'
        },
        {
            id: 2,
            name: '高等数学极速破局',
            date: '2026-07-15',
            todos: [{ id: 102, text: '泰勒展开公式专项练习', completed: false }],
            files: [],
            notes: ''
        }
    ];

    let currentSubjectId = null;

    function init() {
        renderDashboard();
        setInterval(updateAllCountdowns, 1000);
        
        const dropZone = document.getElementById('dropZone');
        if(dropZone){
            dropZone.addEventListener('dragover', (e) => { e.preventDefault(); dropZone.style.borderColor = 'var(--accent-blue)'; });
            dropZone.addEventListener('dragleave', () => { dropZone.style.borderColor = 'rgba(255,255,255,0.06)'; });
            dropZone.addEventListener('drop', (e) => { e.preventDefault(); actions.handleFileUpload(e.dataTransfer.files); });
        }
    }

    function renderDashboard() {
        const container = document.getElementById('subjectsContainer');
        if (subjects.length === 0) {
            container.innerHTML = `<p style="color:var(--text-muted); font-size:13px; margin:40px auto; letter-spacing:1px;">NO SUBJECT TRACKS FOUND</p>`;
            return;
        }

        container.innerHTML = subjects.map(sub => {
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
                            <span>PROGRESS</span>
                            <span>${pct}% (${done}/${total})</span>
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

    function addSubject() {
        const nameInput = document.getElementById('newSubjectName');
        const dateInput = document.getElementById('newSubjectDate');
        if (!nameInput.value.trim() || !dateInput.value) return;

        subjects.push({
            id: Date.now(),
            name: nameInput.value.trim(),
            date: dateInput.value,
            todos: [], files: [], notes: ''
        });
        
        nameInput.value = ''; dateInput.value = '';
        saveData();
        renderDashboard();
    }

    function deleteSubject(id, event) {
        event.stopPropagation();
        if(confirm('确认移除该学科轨道吗？')) {
            subjects = subjects.filter(s => s.id !== id);
            saveData();
            renderDashboard();
        }
    }

    function enterWorkspace(id, event) {
        currentSubjectId = id;
        const sub = subjects.find(s => s.id === id);
        
        document.getElementById('currentSubjectTitle').innerText = sub.name;
        document.getElementById('noteTextarea').value = sub.notes;

        document.getElementById('mainDashboard').classList.remove('active');
        document.getElementById('subjectWorkspace').classList.add('active');

        renderTodos();
        renderFiles();
    }

    function backToDashboard() {
        currentSubjectId = null;
        document.getElementById('subjectWorkspace').classList.remove('active');
        document.getElementById('mainDashboard').classList.add('active');
        renderDashboard();
    }

    function renderTodos() {
        const sub = subjects.find(s => s.id === currentSubjectId);
        const container = document.getElementById('todoContainer');
        container.innerHTML = sub.todos.map(t => `
            <li class="todo-item ${t.completed ? 'completed' : ''}">
                <label style="display:flex; align-items:center; gap:12px; cursor:pointer;">
                    <input type="checkbox" ${t.completed ? 'checked' : ''} onchange="actions.toggleTodo(${t.id})">
                    <span>${t.text}</span>
                </label>
                <span onclick="actions.deleteTodo(${t.id})" style="cursor:pointer; color:var(--text-muted); font-size:11px;">✕</span>
            </li>
        `).join('');
    }

    function addTodo() {
        const input = document.getElementById('newTaskInput');
        if (!input.value.trim()) return;
        const sub = subjects.find(s => s.id === currentSubjectId);
        sub.todos.push({ id: Date.now(), text: input.value.trim(), completed: false });
        input.value = '';
        saveData(); renderTodos();
    }

    function toggleTodo(id) {
        const sub = subjects.find(s => s.id === currentSubjectId);
        sub.todos = sub.todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
        saveData(); renderTodos();
    }

    function deleteTodo(id) {
        const sub = subjects.find(s => s.id === currentSubjectId);
        sub.todos = sub.todos.filter(t => t.id !== id);
        saveData(); renderTodos();
    }

    function saveNotes() {
        const sub = subjects.find(s => s.id === currentSubjectId);
        sub.notes = document.getElementById('noteTextarea').value;
        saveData();
    }

    function handleFileUpload(uploadedFiles) {
        const sub = subjects.find(s => s.id === currentSubjectId);
        for (let file of uploadedFiles) {
            sub.files.push({ id: Date.now() + Math.random(), name: file.name });
        }
        saveData(); renderFiles();
    }

    function renderFiles() {
        const sub = subjects.find(s => s.id === currentSubjectId);
        const container = document.getElementById('fileContainer');
        if(sub.files.length === 0) {
            container.innerHTML = '<p style="text-align:center; color:var(--text-muted); font-size:12px; margin-top:25px; letter-spacing:0.5px;">NO MATERIALS RECOGNIZED</p>';
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
        sub.files = sub.files.filter(f => f.id !== id);
        saveData(); renderFiles();
    }

    function saveData() {
        localStorage.setItem('ns_multi_subjects', JSON.stringify(subjects));
    }

    document.addEventListener('DOMContentLoaded', init);
    return { addSubject, deleteSubject, enterWorkspace, backToDashboard, addTodo, toggleTodo, deleteTodo, saveNotes, handleFileUpload, deleteFile };
})();
