function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

const URLS = {
  add: '/add_task/',
  update: '/update_task/',
  delete: '/delete_task/',
  getTasks: '/get_tasks/',
}

const header = {
  'Content-Type': 'application/json',
  'X-CSRFToken': getCookie('csrftoken'),
}

export function saveTask(id, content, fn) {
  fetch(URLS.add, {
    method: 'POST',
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
    method: 'PATCH',
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
    method: 'DELETE',
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
    method: 'GET',
    headers: header,
  })
    .then((res) => res.json())
    .then(fn)
    .catch((err) => {
      console.error(err)
    })
}
