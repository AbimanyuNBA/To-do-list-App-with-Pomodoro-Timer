let tasks = []; 
let nextTaskId = 1; 
let editingTaskId = null;

let timerInterval;
let timerSeconds = 25 * 60;
let isTimerRunning = false;

// const currentDateEl = document.getElementById('current-date');
const taskListEl = document.getElementById('task-list');
const taskModalEl = document.getElementById('task-modal');
const newTaskBtn = document.getElementById('new-task-btn');
const closeModalBtn = document.getElementById('close-modal');
const cancelTaskBtn = document.getElementById('cancel-task');
const saveTaskBtn = document.getElementById('save-task');
const modalTitle = document.getElementById('modal-title');
const taskTextInput = document.getElementById('task-text');
const startTimeInput = document.getElementById('start-time');
const endTimeInput = document.getElementById('end-time');

const timerDisplayEl = document.getElementById('timer-display');
const timerPlayBtn = document.getElementById('timer-play');
const timerPauseBtn = document.getElementById('timer-pause');
const timerResetBtn = document.getElementById('timer-reset');
const minutesInput = document.getElementById('minutes-input');
const secondsInput = document.getElementById('seconds-input');

function initApp() {
    // setCurrentDateInIndonesian();
    
    renderTasks();
    
    updateTimerDisplay();
    
    setupEventListeners();
}

function renderTasks() {
    taskListEl.innerHTML = '';
    
    if (tasks.length === 0) {
        taskListEl.innerHTML = '<div class="no-tasks">Belum ada tugas. Klik "Tugas Baru" untuk menambahkan tugas pertama!</div>';
        return;
    }
    
    tasks.forEach(task => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        
        taskItem.innerHTML = `
            <div class="task-checkbox ${task.completed ? 'checked' : ''}" data-id="${task.id}"></div>
            <div class="task-content">
                <div class="task-text ${task.completed ? 'completed' : ''}">${task.text}</div>
                <div class="task-time">${task.startTime} - ${task.endTime}</div>
            </div>
            <button class="task-delete" data-id="${task.id}">×</button>
        `;
        
        taskListEl.appendChild(taskItem);
    });
}

function openNewTaskModal() {
    editingTaskId = null;
    modalTitle.textContent = 'Tugas Baru';
    taskTextInput.value = '';
    startTimeInput.value = '09:00';
    endTimeInput.value = '10:00';
    taskModalEl.style.display = 'flex';
}

function openEditTaskModal(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    editingTaskId = taskId;
    modalTitle.textContent = 'Edit Tugas';
    taskTextInput.value = task.text;
    startTimeInput.value = task.startTime;
    endTimeInput.value = task.endTime;
    taskModalEl.style.display = 'flex';
}

function saveTask() {
    const text = taskTextInput.value.trim();
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;
    
    if (!text) {
        alert('Masukkan deskripsi tugas');
        return;
    }
    
    if (editingTaskId) {
        // Update tugas yang ada
        const task = tasks.find(t => t.id === editingTaskId);
        if (task) {
            task.text = text;
            task.startTime = startTime;
            task.endTime = endTime;
        }
    } else {
        // Tambah tugas baru
        tasks.push({
            id: nextTaskId++,
            text,
            startTime,
            endTime,
            completed: false
        });
    }
    
    renderTasks();
    taskModalEl.style.display = 'none';
}

function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        renderTasks();
    }
}

function deleteTask(taskId) {
    tasks = tasks.filter(t => t.id !== taskId);
    renderTasks();
}

// ==================== FUNGSI TIMER ====================
function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    timerDisplayEl.textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (timerSeconds === 0) {
        setTimerFromInput();
    }
    
    isTimerRunning = true;
    timerPlayBtn.style.display = 'none';
    timerPauseBtn.style.display = 'block';
    
    timerInterval = setInterval(() => {
        if (timerSeconds > 0) {
            timerSeconds--;
            updateTimerDisplay();
            
            if (timerSeconds === 0) {
                clearInterval(timerInterval);
                isTimerRunning = false;
                timerPlayBtn.style.display = 'block';
                timerPauseBtn.style.display = 'none';
                alert('Timer selesai!');
            }
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(timerInterval);
    isTimerRunning = false;
    timerPlayBtn.style.display = 'block';
    timerPauseBtn.style.display = 'none';
}

function resetTimer() {
    pauseTimer();
    timerSeconds = 25 * 60;
    updateTimerDisplay();
    minutesInput.value = 25;
    secondsInput.value = 0;
}

function setTimerFromInput() {
    const minutes = parseInt(minutesInput.value) || 0;
    const seconds = parseInt(secondsInput.value) || 0;
    
    if (minutes < 0 || minutes > 120 || seconds < 0 || seconds > 59) {
        alert('Masukkan nilai waktu yang valid');
        return;
    }
    
    timerSeconds = minutes * 60 + seconds;
    updateTimerDisplay();
}

// ==================== EVENT LISTENERS ====================
function setupEventListeners() {
    // Tombol tugas baru
    newTaskBtn.addEventListener('click', openNewTaskModal);
    
    // Tombol modal
    closeModalBtn.addEventListener('click', () => taskModalEl.style.display = 'none');
    cancelTaskBtn.addEventListener('click', () => taskModalEl.style.display = 'none');
    saveTaskBtn.addEventListener('click', saveTask);
    
    // Tutup modal saat klik di luar
    window.addEventListener('click', (e) => {
        if (e.target === taskModalEl) {
            taskModalEl.style.display = 'none';
        }
    });
    
    // Event delegation untuk daftar tugas
    taskListEl.addEventListener('click', (e) => {
        const target = e.target;
        const taskId = parseInt(target.getAttribute('data-id'));
        
        if (target.classList.contains('task-checkbox')) {
            toggleTaskCompletion(taskId);
        }
        
        if (target.classList.contains('task-delete')) {
            deleteTask(taskId);
        }
        
        // Edit saat double-click pada teks tugas
        if (target.classList.contains('task-text')) {
            const taskItem = target.closest('.task-item');
            const taskId = parseInt(taskItem.querySelector('.task-checkbox').getAttribute('data-id'));
            openEditTaskModal(taskId);
        }
    });
    
    // Kontrol timer
    timerPlayBtn.addEventListener('click', startTimer);
    timerPauseBtn.addEventListener('click', pauseTimer);
    timerResetBtn.addEventListener('click', resetTimer);
    
    // Input timer
    minutesInput.addEventListener('change', setTimerFromInput);
    secondsInput.addEventListener('change', setTimerFromInput);
    
    // Klik display timer untuk set input
    timerDisplayEl.addEventListener('click', () => {
        const minutes = Math.floor(timerSeconds / 60);
        const seconds = timerSeconds % 60;
        minutesInput.value = minutes;
        secondsInput.value = seconds;
    });
}

// ==================== MULAI APLIKASI ====================
document.addEventListener('DOMContentLoaded', initApp);