// Variable global state
let tasks = []; 
let nextTaskId = 1; 

let timerInterval;
let timerSeconds = 25 * 60;
let isTimerRunning = false;

// Ambil elemen HTML
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

// Fungsi init aplikasi
function initApp() {
    renderTasks();          // Tampilkan semua tugas
    updateTimerDisplay();   // Tampilkan timer awal
    setupEventListeners();  // Setup semua event listener
}

// Fungsi untuk menampilkan semua tugas
function renderTasks() {
    taskListEl.innerHTML = ''; // Kosongkan daftar tugas
    
    if (tasks.length === 0) {
        taskListEl.innerHTML = '<div class="no-tasks">Belum ada tugas. Klik "Tugas Baru" untuk menambahkan tugas!</div>';
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

// Fungsi untuk membuka modal tambah tugas baru
function openNewTaskModal() {
    modalTitle.textContent = 'Tugas Baru'; // Set judul modal
    taskTextInput.value = ''; // Reset input teks
    startTimeInput.value = '09:00'; // Set waktu mulai default
    endTimeInput.value = '10:00'; // Set waktu selesai default
    taskModalEl.style.display = 'flex'; // Tampilkan modal
}

// Fungsi untuk menyimpan tugas baru
function saveTask() {
    const text = taskTextInput.value.trim(); // Ambil teks tugas
    const startTime = startTimeInput.value; // Ambil waktu mulai
    const endTime = endTimeInput.value; // Ambil waktu selesai
    
    // Validasi: teks tidak boleh kosong
    if (!text) {
        alert('Masukkan deskripsi tugas');
        return;
    }
    
    // Tambahkan tugas baru ke array tasks
    tasks.push({
        id: nextTaskId++, // tambah ID setiap task baru
        text,
        startTime,
        endTime,
        completed: false 
    });
    
    renderTasks(); // Render ulang daftar tugas
    taskModalEl.style.display = 'none'; // Tutup modal
}

// Fungsi untuk toggle status selesai/belum selesai
function toggleTaskCompletion(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed; // Ubah status
        renderTasks(); // Render ulang
    }
}

// Fungsi untuk menghapus tugas
function deleteTask(taskId) {
    // Filter: hanya simpan tugas yang ID-nya tidak sama dengan taskId
    tasks = tasks.filter(t => t.id !== taskId);
    renderTasks(); // Render ulang
}

//  FUNGSI TIMER 

// Fungsi untuk update tampilan timer
function updateTimerDisplay() {
    const minutes = Math.floor(timerSeconds / 60); // Hitung menit
    const seconds = timerSeconds % 60; // Hitung sisa detik
    // Format: MM:SS 
    timerDisplayEl.textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Fungsi untuk memulai timer
function startTimer() {
    // Jika timer sudah 0, set ulang dari input
    if (timerSeconds === 0) {
        setTimerFromInput();
    }
    
    isTimerRunning = true; // Set status timer berjalan
    timerPlayBtn.style.display = 'none'; // Sembunyikan tombol play
    timerPauseBtn.style.display = 'block'; // Tampilkan tombol pause
    
    // Jalankan interval setiap 1 detik
    timerInterval = setInterval(() => {
        if (timerSeconds > 0) {
            timerSeconds--; // Kurangi 1 detik
            updateTimerDisplay(); // Update tampilan
            
            // Jika timer habis
            if (timerSeconds === 0) {
                clearInterval(timerInterval); // Stop timer
                isTimerRunning = false; // Set status timer berhenti
                timerPlayBtn.style.display = 'block'; // Tampilkan tombol play
                timerPauseBtn.style.display = 'none'; // Sembunyikan tombol pause
                alert('Timer selesai!'); // Tampilkan notifikasi
            }
        }
    }, 1000);
}

// Fungsi untuk pause timer
function pauseTimer() {
    clearInterval(timerInterval); // Stop timer
    isTimerRunning = false; // Set status timer berhenti
    timerPlayBtn.style.display = 'block'; // Tampilkan tombol play
    timerPauseBtn.style.display = 'none'; // Sembunyikan tombol pause
}

// Fungsi untuk reset timer ke 25 menit
function resetTimer() {
    pauseTimer(); // Hentikan timer jika sedang berjalan
    timerSeconds = 25 * 60; // Set ke 25 menit
    updateTimerDisplay(); // Update tampilan
    minutesInput.value = 25; // Update input menit
    secondsInput.value = 0; // Update input detik
}

// Fungsi untuk set timer dari input menit dan detik
function setTimerFromInput() {
    const minutes = parseInt(minutesInput.value) || 0; // Ambil nilai menit
    const seconds = parseInt(secondsInput.value) || 0; // Ambil nilai detik
    
    // Validasi input
    if (minutes < 0 || minutes > 120 || seconds < 0 || seconds > 59) {
        alert('Masukkan nilai waktu yang valid');
        return;
    }
    
    timerSeconds = minutes * 60 + seconds; // Konversi ke detik
    updateTimerDisplay(); // Update tampilan
}

//  EVENT LISTENERS 

// Fungsi untuk setup semua event listener
function setupEventListeners() {
    // Tombol untuk membuka modal tugas baru
    newTaskBtn.addEventListener('click', openNewTaskModal);
    
    // Tombol untuk menutup modal
    closeModalBtn.addEventListener('click', () => taskModalEl.style.display = 'none');
    cancelTaskBtn.addEventListener('click', () => taskModalEl.style.display = 'none');
    
    // Tombol untuk menyimpan tugas
    saveTaskBtn.addEventListener('click', saveTask);
    
    // Tutup modal saat klik di luar area modal
    window.addEventListener('click', (e) => {
        if (e.target === taskModalEl) {
            taskModalEl.style.display = 'none';
        }
    });
    
    // Event delegation untuk daftar tugas
    taskListEl.addEventListener('click', (e) => {
        const target = e.target;
        const taskId = parseInt(target.getAttribute('data-id'));
        
        // Jika klik pada checkbox
        if (target.classList.contains('task-checkbox')) {
            toggleTaskCompletion(taskId);
        }
        
        // Jika klik pada tombol delete
        if (target.classList.contains('task-delete')) {
            deleteTask(taskId);
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

document.addEventListener('DOMContentLoaded', initApp);