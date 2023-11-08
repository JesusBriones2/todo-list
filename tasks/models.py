from django.db import models

# Create your models here.
class Tasks(models.Model):
    task_id = models.CharField(max_length=20)
    content = models.TextField(max_length=200)
    status = models.BooleanField(default=False)

    class Meta:
        db_table = 'tasks'