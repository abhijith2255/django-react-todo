from django.db import models
from django.contrib.auth.models import User # പുതിയതായി ചേർത്തത്

class Todo(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True) # ടാസ്ക് ആരുടേതാണെന്ന് അറിയാൻ
    title = models.CharField(max_length=200)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.title