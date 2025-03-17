from django.db import models

# Create your models here.

class Todo(models.Model):
    date = models.DateField()
    task = models.CharField(max_length=100)
    time = models.TimeField()
