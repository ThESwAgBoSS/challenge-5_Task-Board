// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = 
    `<div class="card mb-3" id="task-${task.id}">
        <div class="card-body">
            <h5 class="card-title">${task.name}</h5>
            <p class="card-text">Due Date: ${task.dueDate}</p>
            <button type="button" class="btn btn-danger delete-btn" data-task-id="${task.id}">Delete</button>
        </div>
    </div>`;
    $('#' + task.status + '-cards').append(taskCard);

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    if (taskList){
        taskList.forEach(task => {
            createTaskCard(task);
        });
        $(".card").draggable({
            revert: "invalid",
            stack: ".card",
            cursor: "move"
        });
    }
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();
    const taskName = $("#taskName").val();
    const dueDate = $("#dueDate").val();
    if (!taskList){
        taskList = [];
    }
    const newTask = {
        id: generateTaskId(),
        name: taskName,
        dueDate: dueDate,
        status: "todo"
    };
    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", nextId);
    createTaskCard(newTask);
    $("#formModal").modal("hide");

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
    const taskId = $(this).data("task-id");
    taskList = taskList.filter(task => task.id !== taskId);
    $('#' + task.status + '-cards').remove();
    localStorage.setItem("tasks", JSON.stringify(taskList));

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = ui.draggable.attr("id").split("-")[1];
    const newStatus = $(this).attr("id");
    const taskIndex = taskList.findIndex(task => task.id == taskId);
    taskList[taskIndex].status = newStatus;
    localStorage.setItem("tasks", JSON.stringify(taskList));

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
    $("#addTaskForm").submit(handleAddTask);
    $(document).on("click", ".delete-btn", handleDeleteTask);
    $(".lane").droppable({
        accept: ".card",
        drop: handleDrop
    });
    dayjs.extend(window.dayjs_plugin_customParseFromat);
    dayjs.locale(`en`);

    $(`#dueDate`).on(`click`, function() {
        $(this).attr(`type`, `text`).datepicker({
            dateFormat: `MM-DD-YYYY`
        });
    });

});
