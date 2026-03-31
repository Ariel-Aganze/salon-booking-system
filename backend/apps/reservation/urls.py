from django.urls import path
from . import views

urlpatterns = [
    path('find/', views.find_reservation, name='find-reservation'),
    path('<str:code>/', views.get_reservation_details, name='reservation-details'),
]