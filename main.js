// { title: "Design a website", completed: true },
// { title: "Learn JavaScript", completed: false },
// { title: "Build a Todo App", completed: true },

const tasks = JSON.parse(localStorage.getItem("tasks")) ?? [];

const taskList = document.querySelector("#task-list");
const toDoForm = document.querySelector(".todo-form");
const input = document.querySelector("#todo-input");
const addBtn = document.querySelector("#submit");

// Chống XSS
function escapeHTML(input) {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
}

// Xử lí trùng tên
function isDuplicateTask(newTitle, excludeIndex) {
    const isDuplicate = tasks.some((task, index) => {
        return task.title === newTitle && excludeIndex !== index;
    });

    if (isDuplicate) {
        alert(
            `The name "${newTitle}" is already taken. Please use another name!`,
        );
        return true;
    }
    return false;
}

// Lưu Tasks vào localStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Thêm task mới, add vào danh sách
function addNewTask(e) {
    e.preventDefault();
    const newTitle = input.value.trim();

    if (!newTitle) {
        input.value = "";
        return alert("Please input your task title!");
    }

    // Check trùng tên
    if (isDuplicateTask(newTitle)) {
        input.value = "";
        return;
    }

    // Add thông tin vào danh sách
    tasks.push({
        title: newTitle,
        completed: false,
    });

    // Update lại tasks bên DOM
    updateTaskList();
    saveTasks();

    // Clear nội dung cũ
    input.value = "";
}

// Xử lí edit, mark, delete
function handleTaskActions(e) {
    const taskItem = e.target.closest(".task-item");
    if (!taskItem) return;

    const taskIndex = +taskItem.dataset.index;
    const task = tasks[taskIndex];

    // Edit tên task
    if (e.target.closest(".edit")) {
        // Hiện prompt nhập tên mới, check tên valid
        const userInput = prompt("Input your new task name:", task.title);
        if (userInput === null) return;

        const newTitle = userInput.trim();
        if (!newTitle) {
            return alert(
                "Task name cannot be empty. Please enter a valid name.",
            );
        }

        // Check trùng tên
        if (isDuplicateTask(newTitle, taskIndex)) {
            return;
        }

        // Lưu vào data
        task.title = newTitle;
        updateTaskList();
        saveTasks();
        return;
    }

    // Mark: toggle xong/chưa xong
    if (e.target.closest(".done")) {
        task.completed = !task.completed;
        updateTaskList();
        saveTasks();
        return;
    }

    // Xóa task
    if (e.target.closest(".delete")) {
        if (confirm(`Are you sure to delete "${task.title}"`)) {
            tasks.splice(taskIndex, 1);
            updateTaskList();
            saveTasks();
        }
    }
}

// Update taskList lên DOM
function updateTaskList() {
    let html = "";
    if (tasks.length === 0) {
        html = `<li class="empty-message">No tasks available.</li>`;
    } else {
        html = tasks
            .map((task, index) => {
                return `<li class="task-item ${task.completed ? "completed" : ""}" data-index="${index}">
            <span class="task-title">${escapeHTML(task.title)}</span>
            <div class="task-action">
            <button class="task-btn edit">Edit</button>
            <button class="task-btn done">${task.completed ? "Mark as undone" : "Mark as done"}</button>
            <button class="task-btn delete">Delete</button>
        </div>
        </li>
        `;
            })
            .join("");
    }
    taskList.innerHTML = html;
}

toDoForm.addEventListener("submit", addNewTask);
taskList.addEventListener("click", handleTaskActions);
updateTaskList();
