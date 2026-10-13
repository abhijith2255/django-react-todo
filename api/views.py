from rest_framework import generics, permissions
from .models import Todo
from .serializers import TodoSerializer

class TodoListCreate(generics.ListCreateAPIView):
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated] # ലോഗിൻ നിർബന്ധമാക്കാൻ

    # ലോഗിൻ ചെയ്ത ആളുടെ ടാസ്ക് മാത്രം കാണിക്കാൻ
    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)

    # പുതിയ ടാസ്ക് സേവ് ചെയ്യുമ്പോൾ അത് ആ യൂസറിന്റെ പേരിൽ സേവ് ചെയ്യാൻ
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TodoRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = TodoSerializer
    permission_classes = [permissions.IsAuthenticated] # ലോഗിൻ നിർബന്ധമാക്കാൻ

    def get_queryset(self):
        return Todo.objects.filter(user=self.request.user)