const CSRF_TOKEN = document.querySelector('[name="csrfmiddlewaretoken"]').value

const URLS = {
  add: '/add_task',
  update: '/update_task',
  delete: '/delete_task',
  getTasks: '/get_tasks',
}

const header = {
  'Content-Type': 'application/json',
  'X-CSRFToken': CSRF_TOKEN,
}

export function saveTask(id, content, fn) {
  fetch(URLS.add, {
    method: 'post',
    headers: header,
    body: JSON.stringify({ id, content }),
  })
    .then((res) => {
      if (!res.ok) fn()
    })
    .catch((err) => {
      console.error(err)
      fn()
    })
}

export function changeStatus(id, status) {
  fetch(URLS.update, {
    method: 'patch',
    headers: header,
    body: JSON.stringify({ id, status }),
  })
    .then()
    .catch((err) => {
      console.error(err)
    })
}

export function deleteTask(id) {
  fetch(URLS.delete, {
    method: 'delete',
    headers: header,
    body: JSON.stringify({ id }),
  })
    .then()
    .catch((err) => {
      console.error(err)
    })
}

export function getTasks(fn) {
  fetch(URLS.getTasks, {
    method: 'get',
    headers: header,
  })
    .then((res) => res.json())
    .then(fn)
    .catch((err) => {
      console.error(err)
    })
}
