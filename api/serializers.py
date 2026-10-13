from rest_framework import serializers
from .models import Todo

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = '__all__' # മോഡലിലുള്ള എല്ലാ ഫീൽഡുകളും (title, completed) എടുക്കാൻ വേണ്ടിയാണിത്