(() => {

  const tasksElem = document.getElementById('tasks');
  const csrfToken = document.querySelector('[name="csrfmiddlewaretoken"]').value;

  function createTask(id, content) {
    const div = document.createElement('div');
    div.id = id;
    div.classList.add('task');
    div.innerHTML = `
      <label class="task__label" for="checkbox-${id}">
        <input type="checkbox" hidden id="checkbox-${id}">
          <div class="task__checkbox">
            <svg class="icon task__icon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96z"/></svg>
            <svg class="icon task__icon task__icon--checked" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
          </div>
        <p class="task__text">${content}</p>
      </label>
      <button class="task__cta">
        <svg class="icon task__cta-icon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
      </button>`;

    return div;      
  }



  function Fetch(path, method, content, fn) {
    fetch(path, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken
      },
      body: JSON.stringify(content),
    })
    .then(res => 
      res.headers.get('Content-Type') == 'text/plain' ? 
      res.text(): res.json()
    )
    .then(fn)
  }



  function addTask(content) {
    Fetch('/add_task/','POST', {'content': content},
      (data) => {
        const elem = createTask(data.task_id, content);
        tasksElem.insertAdjacentElement('afterbegin', elem);
      }
    )
  }



  function deleteTask(task) {
    Fetch('/delete_task/', 'DELETE', {'task_id': task.id},
      (data) => {
        task.classList.add('remove');
        task.addEventListener('animationend', () => {
          task.remove();
        })
      }
    )
  }



  function updateTask(id, status) {
    Fetch('/update_task/', 'PATCH', 
      {
        'task_id': id,
        'status': status
      }, 
      (data) => {
        // console.log(data);
      }
    )
  }



  document.getElementById('form').addEventListener('submit', function(e){
    e.preventDefault();
    const input = this.querySelector('.form__input');

    if (input.value.length) {
      addTask(input.value);
      input.value = '';
    }
  })



  tasksElem.addEventListener('click', (e) => {
    e.preventDefault();
    const taskElem = e.target.closest('.task');
    
    if (e.target.closest('.task__cta')) {
      deleteTask(taskElem);
      return;
    }
    
    if (e.target.closest('.task__label')) {
      const input = taskElem.querySelector('input');
      input.checked = input.checked ? false: true;
      updateTask(taskElem.id, input.checked);
      return;
    }

  });
  
})();