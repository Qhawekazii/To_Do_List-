const prioritySelect = document.querySelector("#priority-select");
const taskInput = document.querySelector("#taskInput");
const addBtn = document.querySelector("#addBtn");
const taskList = document.querySelector("#taskList");
const filterBtns = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

displayTasks();

addBtn.addEventListener("click", addTask);

filterBtns.forEach(function(button) {
  button.addEventListener("click", function() {
    currentFilter = button.dataset.filter;
    displayTasks();
  });
});

function addTask() {
  const taskText = taskInput.value.trim();

  if (taskText === "") {
    return;
  }

  const newTask = {
    id: Date.now(),
    text: taskText,
    completed: false,
    priority: prioritySelect.value
  };

  tasks.push(newTask);
  saveTasks();
  displayTasks();

  taskInput.value = "";
}

function displayTasks() {
  taskList.innerHTML = "";

  let filteredTasks = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter(function(task) {
      return task.completed === false;
    });
  }

  if (currentFilter === "completed") {
    filteredTasks = tasks.filter(function(task) {
      return task.completed === true;
    });
  }

 //Tasks filtering layer so that only the relevant tasks are displayed based on the selected filter (all, active, completed).
  filteredTasks.forEach(function(task) {
    const li = document.createElement("li");

    if (task.completed) {
      li.classList.add("completed");
    }

    const leftDiv = document.createElement("div");
    leftDiv.classList.add("task-left");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    checkbox.addEventListener("change", function() {
      task.completed = !task.completed;
      saveTasks();
      displayTasks();
    });

    const span = document.createElement("span");
    span.textContent = task.text;

    const priority = document.createElement("small");
    priority.textContent = `(${task.priority})`;

    leftDiv.appendChild(checkbox);
    leftDiv.appendChild(span);
    leftDiv.appendChild(priority);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    deleteBtn.addEventListener("click", function() {
      tasks = tasks.filter(function(item) {
        return item.id !== task.id;
      });

      saveTasks();
      displayTasks();
    });

    li.appendChild(leftDiv);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
  });
}

// Saves tasks 
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Adds tasks when Enter key is pressed
taskInput.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    addTask();
  }
});

// Hopefully adds the current date to the top of the page in a readable format
const dateElement = document.querySelector("#currentDate");

const today = new Date();

const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };

dateElement.textContent = today.toLocaleDateString("en-ZA", options);

