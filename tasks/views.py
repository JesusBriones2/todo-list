import json
from .models import Tasks
from django.shortcuts import render
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist


class SMS:
    no_access = "You can't access the site."
    invalid_method = "Invalid HTTP method."
    task_created = "Resource created successfully."
    no_content = "Content is missing in the request."
    invalid_json = "Invalid JSON data in the request."
    no_task = "The task does not exist."
    task_update = "The resource was updated."
    invalid_data = "Invalid data in the request."
    task_delete = "The resource was removed from the registry."
    no_id = "Task ID is missing in the request."


class RES(JsonResponse):
    @staticmethod
    def error(message, status):
        return JsonResponse({'error': message}, status=status)

    @staticmethod
    def success(message, status):
        return JsonResponse({'success': message}, status=status)


def index(req):
    if req.method == 'GET':
        return render(req, 'index.html')

    return RES.error(SMS.no_access, 403)


def get_tasks(req):
    if req.method == 'GET':
        tasks = Tasks.objects.all().values()
        return JsonResponse({"tasks": list(tasks)})

    return RES.error(SMS.invalid_method, 405)


def add_task(req):
    if req.method != 'POST':
        return RES.error(SMS.invalid_method, 405)

    try:
        data = json.loads(req.body)
        task_id = data['id']
        content = data['content']

        if content and task_id:
            task = Tasks(task_id=task_id, content=content)
            task.save()
            return RES.success(SMS.task_created, 201)
        else:
            return RES.error(SMS.no_content, 400)

    except json.JSONDecodeError:
        return RES.error(SMS.invalid_json, 400)


def update_task(req):
    if req.method != 'PATCH':
        return RES.error(SMS.invalid_method, status=405)

    try:
        data = json.loads(req.body)
        task_id = data['id']
        status = data['status']

        if task_id:
            try:
                task = Tasks.objects.get(task_id=task_id)
                task.status = status
                task.save()
                return RES.success(SMS.task_update, status=200)
            except ObjectDoesNotExist:
                return RES.error(SMS.no_task, status=404)
        else:
            return RES.error(SMS.invalid_data, status=400)

    except json.JSONDecodeError:
        return RES.error(SMS.invalid_json, status=400)


def delete_task(req):
    if req.method != 'DELETE':
        return RES.error(SMS.invalid_method, status=405)

    try:
        data = json.loads(req.body)
        task_id = data['id']

        if task_id:
            try:
                task = Tasks.objects.get(task_id=task_id)
                task.delete()
                return RES.success(SMS.task_delete, status=200)
            except ObjectDoesNotExist:
                return RES.error(SMS.no_task, status=404)
        else:
            return RES.error(SMS.no_id, status=400)

    except json.JSONDecodeError:
        return RES.error(SMS.invalid_json, status=400)
