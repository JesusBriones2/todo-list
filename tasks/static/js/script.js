(() => {
  // Constantes para las clases y elementos HTML
  const classNames = {
    task: "task",
    taskCompleted: "task--completed",
    taskCta: "task__cta",
    taskRemove: "task--remove",
  };

  const form = document.getElementById("form");
  const tasks = document.getElementById("tasks");
  const input = form.querySelector(".form__input");

  const csrfToken = document.querySelector('[name="csrfmiddlewaretoken"]').value;

  // Función para realizar solicitudes fetch
  function fetchData(path, method, content, callback) {
    if (!path || !method || !callback) {
      console.error("Los argumentos 'path', 'method' y 'callback' son requeridos.");
      return;
    }

    const config = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
    };

    if (method !== "GET") {
      config.body = JSON.stringify(content);
    }

    fetch(path, config)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error de red: ${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get("Content-Type");
        return contentType === "application/json" ? response.json() : response.text();
      })
      .then((data) => callback(data))
      .catch((error) => console.error("Error en la solicitud:", error));
  }

  // Función para crear una nueva tarea
  function createTask(id, content, status) {
    const task = document.createElement("div");
    task.classList.add(classNames.task);
    if (status) {
      task.classList.add(classNames.taskCompleted);
    }
    task.id = id;

    const taskTemplate = `
      <div class="task__checkbox">
        <svg class="task__icon task__icon--check" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
        <svg class="task__icon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96z"/></svg>
      </div>
      <p class="task__text">${content}</p>
      <button class="task__cta">
        <svg class="task__cta-icon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
      </button>`;

    task.innerHTML = taskTemplate;

    // Agrega la tarea al contenedor
    tasks.insertBefore(task, tasks.firstChild);
  }

  // Función para obtener las tareas
  function getTasks() {
    fetchData('/get_tasks/', 'GET', 0, ({ tasks }) => {
      tasks.forEach(({ task_id, content, status }) => {
        createTask(task_id, content, status);
      });
    });
  }
  getTasks();

  // Función para agregar una tarea
  function addTask() {
    const id = Math.floor(Date.now() * Math.random() * 100);
    const content = input.value;

    if (content) {
      createTask(id, content);

      fetchData("/add_task/", "POST", { content: content, task_id: id }, (data) => {
        // console.log(data);
      });

      input.value = "";
    }
  }

  // Función para actualizar una tarea
  function updateTask(id, status) {
    fetchData("/update_task/", "PATCH", { task_id: id, status: status }, (data) => {
      // console.log(data);
    });
  }

  // Función para eliminar una tarea
  function removeTask(task) {
    task.removeEventListener("animationend", removeTask);
    task.remove();
  }

  // Event handler para hacer clic en las tareas
  function toggleTaskCompletion(e) {
    const task = e.target.closest(`.${classNames.task}`);

    if (!task || task.classList.contains(classNames.taskRemove)) return;

    if (e.target.closest(`.${classNames.taskCta}`)) {
      task.classList.add(classNames.taskRemove);
      task.addEventListener("animationend", () => removeTask(task));

      fetchData("/delete_task/", "DELETE", { task_id: task.id }, (data) => {
        // console.log(data);
      });

      return;
    }

    task.classList.toggle(classNames.taskCompleted);
    const status = task.classList.contains(classNames.taskCompleted);
    updateTask(task.id, status);
  }

  // Event handler para enviar el formulario
  function handleFormSubmit(e) {
    e.preventDefault();
    addTask();
  }

  // Agrega event listeners
  tasks.addEventListener("click", toggleTaskCompletion);
  form.addEventListener("submit", handleFormSubmit);
})();
