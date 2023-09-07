from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from .models import Tasks
import json, time, random



# Create your views here.
def main(req):
    if req.method == 'GET':
        tasks = Tasks.objects.all()
        return render(req, 'index.html', {"tasks": tasks})

    return HttpResponse("You can't access the site", status=405)



def get_tasks(req):
    if req.method == 'GET':
        tasks = Tasks.objects.all()
        return JsonResponse({"tasks": list(tasks.values())})
    
    return HttpResponse('Invalid http method', status=405)



def add_task(req):
    if req.method == 'POST':
        content = json.loads(req.body)['content']
    
        if content:
            task = Tasks(content=content)
            task.save()
            return JsonResponse({"task_id": task.task_id})

        return HttpResponse(
            'No data was sent in the request', 
            status=404, 
            content_type='text/plain'
        )
    
    return HttpResponse('Invalid http method', status=405)
    




def delete_task(req):
    if req.method == 'DELETE':
        task_id = json.loads(req.body)['task_id']

        if task_id:
            Tasks.objects.get(task_id=task_id).delete()
            return HttpResponse(
                'removed item', 
                status=200, 
                content_type='text/plain'
            )

        return HttpResponse(
            'Item id not sent', 
            status=404, 
            content_type='text/plain'
        )
    
    return HttpResponse('Invalid http method', status=405)

    




def update_task(req):
    if req.method == 'PATCH':
        data = json.loads(req.body)

        if data['task_id']:
            task = Tasks.objects.get(task_id=data['task_id'])
            task.status = data['status']
            task.save()

            return HttpResponse(
                'Item updated', 
                status=200, 
                content_type='text/plain'
            )
        
        return HttpResponse(
            'No data was sent in the request', 
            status=404, 
            content_type='text/plain'
        )
        
    return HttpResponse('Invalid http method', status=405)
    