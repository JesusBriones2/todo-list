// import * as req from './requests.js'
;(() => {
  const $ = (selector) => document.querySelector(selector)

  const $form = $('.form')
  const $tasks = $('.tasks')


  // Load the tasks in the document
  // function loadTasks() {
  //   req.getTasks((res) => {
  //     res.tasks.forEach(obj => {
  //       createTask(obj.task_id, obj.content, obj.status)
  //     })
  //   })
  // }
  // loadTasks()



  // Function to create a new task
  function createTask(id, content, status) {
    status = status ? 1 : 0
    const complete = status ? 'task--completed' : ''

    const taskTemplate = `
      <div class="task ${complete}" id="${id}" data-status="${status}">
        <div class="task__checkbox">
          <i class="fa-solid fa-square-check task__icon"></i>
          <i class="fa-solid fa-square task__icon"></i>
        </div>
        <p class="task__text">${content}</p>
        <button class="task__delete fa-solid fa-trash"></button>
      </div>`

    $tasks.insertAdjacentHTML('afterbegin', taskTemplate)
  }



  // Event handler for submitting the form
  function formSubmit(e) {
    e.preventDefault()
    const input = $form.querySelector('.form__input')
    const value = input.value

    if (value) {
      const id = Math.floor(Date.now() * (Math.random() * 100))
      createTask(id, value)
      // req.saveTask(id, value, () => removeTask(id))
      input.value = ''
    }
  }
  


  // Event handler for clicking on tasks
  function taskActions(e) {
    const task = e.target.closest('.task')
    const id = task?.id
    
    if (e.target.closest('.task__delete')) {
      removeTask(id)
      // req.deleteTask(id)
      return
    }

    if (task) {
      const status = task.dataset.status
      task.classList.toggle('task--completed')
      const newStatus = Number(status) ? 0 : 1

      task.dataset.status = newStatus
      // req.changeStatus(id, newStatus)
    }
  }



  // Function to remove a task when the animation end
  function removeTask(id) {
    const $task = document.getElementById(id)
    $task.classList.add('task--remove')

    $task.addEventListener('animationend', () => {
      $task.removeEventListener('animationend', removeTask)
      $task.remove()
    })
  }


  
  // Add event listeners
  $tasks.addEventListener('click', taskActions)
  $form.addEventListener('submit', formSubmit)
})()
