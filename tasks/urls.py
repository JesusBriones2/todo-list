from django.urls import path
from .views import *

urlpatterns = [
    path('', main, name='main'),
    path('get_tasks/', get_tasks, name='get_tasks'),
    path('add_task/', add_task, name='add_task'),
    path('delete_task/', delete_task, name='delete_task'),
    path('update_task/', update_task, name='update_task'),
]