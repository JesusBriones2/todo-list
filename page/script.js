;(() => {
  const $ = (selector) => document.querySelector(selector)

  const $form = $('.form')
  const $tasks = $('.tasks')

  // Function to create a new task
  function createTask(id, content) {
    const taskTemplate = `
      <div class="task id="${id}">
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
    const $input = $form[0];

    if ($input.value) {
      const id = Math.floor(Date.now() * (Math.random() * 100))
      createTask(id, $input.value)
      $input.value = ''
    }
  }


  // Event handler for clicking on tasks
  function taskActions(e) {
    const $task = e.target.closest('.task')

    if (e.target.closest('.task__delete')) {
      $task.classList.add('task--remove')
      $task.addEventListener('animationend', removeTask)
      return
    }

    if ($task) {
      $task.classList.toggle('task--completed')
    }
  }


  // Function to remove a task when the animation end
  function removeTask(e) {
    const $task = e.currentTarget
    $task.removeEventListener('animationend', removeTask)
    $task.remove()
  }


  // Add event listeners
  $tasks.addEventListener('click', taskActions)
  $form.addEventListener('submit', formSubmit)
})()
