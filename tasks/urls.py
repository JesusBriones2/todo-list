from django.urls import path
from .views import *

urlpatterns = [
    path('', index, name='index'),
    path('add_task/', add_task, name='add_task'),
    path('get_tasks/', get_tasks, name='get_tasks'),
    path('delete_task/', delete_task, name='delete_task'),
    path('update_task/', update_task, name='update_task'),
]