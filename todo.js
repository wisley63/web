document.getElementById('to-do-list').addEventListener('click', function() {
    var todoContainer = document.getElementById('todo-list-container');
    if (todoContainer.style.display === 'none' || todoContainer.style.display === '') {
        todoContainer.style.display = 'block';
    } else {
        todoContainer.style.display = 'none';
    }
});

window.onload = function() {
    loadTasks();
}

function addTask() {
    var taskInput = document.getElementById('new-task');
    var taskList = document.getElementById('task-list');

    if (taskInput.value === '') {
        alert('Please enter a task.');
        return;
    }

    var li = document.createElement('li');
    li.textContent = taskInput.value;

    var deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function() {
        taskList.removeChild(li);
        saveTasks();
    };

    li.appendChild(deleteButton);
    taskList.appendChild(li);

    taskInput.value = '';

    saveTasks();
}

function saveTasks() {
    var taskList = document.getElementById('task-list');
    var tasks = [];
    for (var i = 0; i < taskList.children.length; i++) {
        tasks.push(taskList.children[i].textContent.replace('Delete', '').trim());
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    var tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
        var taskList = document.getElementById('task-list');
        for (var i = 0; i < tasks.length; i++) {
            var li = document.createElement('li');
            li.textContent = tasks[i];

            var deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = function() {
                taskList.removeChild(li);
                saveTasks();
            };

            li.appendChild(deleteButton);
            taskList.appendChild(li);
        }
    }
}

document.addEventListener('click', function(event) {
    var isClickInside = document.getElementById('todo-list-container').contains(event.target);
    var isButtonClick = document.getElementById('to-do-list').contains(event.target);

    if (!isClickInside && !isButtonClick) {
        document.getElementById('todo-list-container').style.display = 'none';
    }
});
