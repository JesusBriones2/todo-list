import json
from .models import Tasks
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.core.exceptions import ObjectDoesNotExist



def main(req):
    if req.method == 'GET':
        return render(req, 'index.html')
    
    return HttpResponse("You can't access the site.", status=403)



def get_tasks(req):
    if req.method == 'GET':
        tasks = Tasks.objects.all().values()
        return JsonResponse({"tasks": list(tasks)})
    
    return HttpResponse('Invalid HTTP method.', status=405)



def add_task(req):
    if req.method == 'POST':
        try:
            data = json.loads(req.body)
            content = data['content']

            if content:
                task = Tasks(content=content)
                task.save()
                return JsonResponse({"task_id": task.task_id}, status=201)
            else:
                return JsonResponse({'error': 'Content is missing in the request.'}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data in the request.'}, status=400)

    return HttpResponse('Invalid HTTP method.', status=405)



def delete_task(req):
    if req.method == 'DELETE':
        try:
            data = json.loads(req.body)
            task_id = data['task_id']

            if task_id:
                try:
                    task = Tasks.objects.get(task_id=task_id)
                    task.delete()
                    return HttpResponse('The resource was removed from the registry.', status=200)
                except ObjectDoesNotExist:
                    return HttpResponse('The task does not exist.', status=404)
            else:
                return JsonResponse({'error': 'Task ID is missing in the request.'}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data in the request.'}, status=400)

    return HttpResponse('Invalid HTTP method.', status=405)



def update_task(req):
    if req.method == 'PATCH':
        try:
            data = json.loads(req.body)
            task_id = data['task_id']
            status = data['status']

            if task_id:
                try:
                    task = Tasks.objects.get(task_id=task_id)
                    task.status = status
                    task.save()
                    return HttpResponse('The resource was updated.', status=200)
                except ObjectDoesNotExist:
                    return HttpResponse('The task does not exist.', status=404)
            else:
                return JsonResponse({'error': 'Invalid data in the request.'}, status=400)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data in the request.'}, status=400)

    return HttpResponse('Invalid HTTP method.', status=405)
