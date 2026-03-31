from django.urls import path
from . import views

urlpatterns = [
    path('deposit/', views.create_deposit_session, name='deposit'),
    path('remaining/', views.create_remaining_session, name='remaining'),
]