from django.db import models

class Leader(models.Model):
    name = models.CharField(max_length=100)
    score = models.IntegerField()
