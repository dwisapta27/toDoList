document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addButton = document.getElementById('add-button');
    const taskList = document.getElementById('task-list');

    // 1. Ambil data dari Local Storage saat halaman dimuat
    loadTasks();

    // Event listener untuk tombol 'Tambah'
    addButton.addEventListener('click', addTask);

    // Event listener untuk tombol 'Enter' pada input
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // Event listener delegasi untuk tombol di dalam daftar (Selesai & Hapus)
    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('complete-button') || e.target.closest('.complete-button')) {
            toggleComplete(e);
        } else if (e.target.classList.contains('delete-button') || e.target.closest('.delete-button')) {
            deleteTask(e);
        }
    });

    // --- FUNGSI UTAMA ---

    function addTask() {
        const taskText = taskInput.value.trim();

        if (taskText !== "") {
            // Buat elemen <li> baru
            const listItem = createListItem(taskText, false); 
            taskList.appendChild(listItem);

            // Simpan ke Local Storage
            saveTasks();

            // Kosongkan input
            taskInput.value = "";
        }
    }

    function createListItem(text, completed) {
        const li = document.createElement('li');
        li.textContent = text;
        
        if (completed) {
            li.classList.add('completed');
        }

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('actions');

        // Tombol Selesai
        const completeBtn = document.createElement('button');
        completeBtn.classList.add('complete-button');
        completeBtn.innerHTML = '<i class="fas fa-check"></i>';
        
        // Tombol Hapus
        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-button');
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';

        actionsDiv.appendChild(completeBtn);
        actionsDiv.appendChild(deleteBtn);
        li.appendChild(actionsDiv);

        return li;
    }

    function toggleComplete(e) {
        // Cari elemen <li> terdekat (induk tugas)
        const listItem = e.target.closest('li'); 
        listItem.classList.toggle('completed');
        
        saveTasks();
    }

    function deleteTask(e) {
        // Cari elemen <li> terdekat
        const listItem = e.target.closest('li');
        // Hapus dari DOM
        taskList.removeChild(listItem);
        
        saveTasks();
    }

    // --- FUNGSI LOCAL STORAGE ---

    function saveTasks() {
        // Ambil semua tugas saat ini
        const tasks = [];
        taskList.querySelectorAll('li').forEach(li => {
            tasks.push({
                text: li.textContent.trim().replace('✔🗑', ''), // Hapus ikon dari teks saat menyimpan
                completed: li.classList.contains('completed')
            });
        });

        // Simpan sebagai string JSON di Local Storage
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const savedTasks = localStorage.getItem('tasks');
        
        if (savedTasks) {
            const tasks = JSON.parse(savedTasks);
            tasks.forEach(task => {
                // Buat ulang elemen <li> dan masukkan ke daftar
                const listItem = createListItem(task.text, task.completed);
                taskList.appendChild(listItem);
            });
        }
    }
});