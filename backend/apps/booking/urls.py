from django.urls import path
from . import views

urlpatterns = [
    path('services/', views.get_services, name='services'),
    path('slots/', views.get_available_slots, name='available-slots'),
    path('create/', views.create_booking, name='create-booking'),
]