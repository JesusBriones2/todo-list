;(() => {
  const $ = (selector) => document.querySelector(selector)

  const $form = $('.form')
  const $tasks = $('.tasks')
  const $input = $('.form__input')

  // Function to create a new task
  function createTask(id, content) {
    const taskTemplate = `
      <div class="task" id="${id}">
        <div class="task__checkbox">
          <svg class="task__icon task__icon--check" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
          <svg class="task__icon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><path d="M0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96z"/></svg>
        </div>
        <p class="task__text">${content}</p>
        <button class="task__cta">
          <svg class="task__cta-icon" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
        </button>
      </div>`

    $tasks.insertAdjacentHTML('afterbegin', taskTemplate)
  }

  // Function to remove a task
  function removeTask(e) {
    const $task = e.currentTarget
    $task.removeEventListener('animationend', removeTask)
    $task.remove()
  }

  // Event handler for clicking on tasks
  function handleTaskActions(e) {
    const $task = e.target.closest('.task')

    if (e.target.closest('.task__cta')) {
      $task.classList.add('task--remove')
      $task.addEventListener('animationend', removeTask)
      return
    }

    if ($task) {
      $task.classList.toggle('task--completed')
    }
  }

  // Event handler for submitting the form
  function handleFormSubmit(e) {
    e.preventDefault()

    if ($input.value) {
      const id = Math.floor(Date.now() * (Math.random() * 100))
      createTask(id, $input.value)
      $input.value = ''
    }
  }

  // Add event listeners
  $tasks.addEventListener('click', handleTaskActions)
  $form.addEventListener('submit', handleFormSubmit)
})()
