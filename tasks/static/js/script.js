(() => {
  const tasksElem = document.getElementById("tasks");
  const csrfToken = document.querySelector('[name="csrfmiddlewaretoken"]').value;


  function createElementTask(id, content, status=false) {
    const div = document.createElement("div");
    div.id = id;
    div.classList.add("task");
    status ? div.classList.add('task--checked'): 0;
    div.innerHTML = `
    <div class="task__container">
      <div class="task__checkbox">
          <svg class="icon task__icon task__icon--checked" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
          <svg class="icon task__icon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96z"/></svg>
      </div>
      <p class="task__text">${content}</p>
      <button class="task__cta">
          <svg class="icon task__cta-icon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
      </button>
    </div>`;

    tasksElem.insertAdjacentElement("afterbegin", div);
  }



  function Fetch(path, method, content, fn) {
    if (!path || !method || !fn) {
      console.error("The path, method, and fn arguments are required.");
      return;
    }

    const config = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken,
      },
    }

    if (method != "GET") {config.body = JSON.stringify(content)}

    fetch(path, config)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Error de red: ${res.status} ${res.statusText}`);
        }

        const contentType = res.headers.get("Content-Type");
        return contentType == "application/json" ? res.json(): res.text();
      })
      .then(data => fn(data))
      .catch(error => console.error("Error en la solicitud:", error));
  }



  function getTasks() {
    Fetch('/get_tasks/', 'GET', 0, ({tasks}) => {
      tasks.forEach(({task_id, content, status}) => {
        createElementTask(task_id, content, status)
      });
    });
  }



  function addTask(content) {
    const id = Math.fround(Math.floor(Date.now() * (Math.random() * 100)));
    createElementTask(id, content);

    Fetch("/add_task/", "POST", 
    {
      content: content, 
      task_id: id  
    },
    (data) => {
      // console.log(data);
    });
  }



  function updateTask(id, status) {
    Fetch( "/update_task/", "PATCH",
      {
        task_id: id,
        status: status,
      },
      (data) => {
        // console.log(data);
      }
    );
  }



  function deleteTask(task) {
    task.classList.add("task--remove");
    task.addEventListener("animationend", () => {
      task.remove();
    });

    Fetch("/delete_task/", "DELETE", { task_id: task.id }, (data) => {
      // console.log(data);
    });
  }



  document.getElementById("form").addEventListener("submit", function (e) {
    e.preventDefault();
    const input = this.querySelector(".form__input");

    if (input.value) {
      addTask(input.value);
      input.value = "";
    }
  });



  tasksElem.addEventListener('click', (e) => {

    const task = e.target.closest('.task');

    if (task?.classList.contains('task--remove')) return;

    if (e.target.closest('.task__cta')) {
      deleteTask(task);
      return;
    }

    if (task) {
      task.classList.toggle('task--checked');
      updateTask(task.id, task.classList.contains('task--checked'))
    }
  });


  getTasks();

})();