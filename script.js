let tasks = [];
let timer = 1500;
let interval = null;

const taskInput = document.getElementById('task-text');
const addBtn = document.getElementById('save-task');
const taskList = document.getElementById('task-list');
const timerDisplay = document.getElementById('timer-display');
const playBtn = document.getElementById('timer-play');
const pauseBtn = document.getElementById('timer-pause');
const resetBtn = document.getElementById('timer-reset');

function renderTasks() {
    taskList.innerHTML = '';

    if (tasks.length === 0) {
        taskList.innerHTML = '<p>Belum ada tugas</p>';
        return;
    }

    tasks.forEach((task, i) => {
        taskList.innerHTML += `
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">
                <input type="checkbox" ${task.done ? 'checked' : ''} data-check="${i}">
                <span style="flex:1;text-decoration:${task.done ? 'line-through' : 'none'}">
                    ${task.text}
                </span>
                <button data-del="${i}">x</button>
            </div>
        `;
    });
}

addBtn.onclick = () => {
    if (!taskInput.value.trim()) return;

    tasks.push({
        text: taskInput.value,
        done: false
    });

    taskInput.value = '';
    renderTasks();
};

taskList.onclick = (e) => {
    if (e.target.dataset.check !== undefined) {
        tasks[e.target.dataset.check].done = e.target.checked;
    }

    if (e.target.dataset.del !== undefined) {
        tasks.splice(e.target.dataset.del, 1);
    }

    renderTasks();
};

function renderTimer() {
    const m = Math.floor(timer / 60);
    const s = timer % 60;
    timerDisplay.textContent =
        `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

playBtn.onclick = () => {
    if (interval) return;

    interval = setInterval(() => {
        if (timer <= 0) {
            clearInterval(interval);
            interval = null;
            alert('Timer selesai!');
            return;
        }
        timer--;
        renderTimer();
    }, 1000);
};

pauseBtn.onclick = () => {
    clearInterval(interval);
    interval = null;
};

resetBtn.onclick = () => {
    clearInterval(interval);
    interval = null;
    timer = 1500;
    renderTimer();
};

renderTasks();
renderTimer();
