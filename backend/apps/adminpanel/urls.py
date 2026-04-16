from django.urls import path
from . import views

urlpatterns = [
    path('dashboard/', views.get_dashboard_stats, name='dashboard'),
    path('bookings/', views.get_all_bookings, name='all-bookings'),
    path('bookings/<int:id>/', views.get_booking_detail, name='booking-detail'),
    path('bookings/<int:id>/update/', views.update_booking_status, name='update-booking'),
    path('services/', views.manage_services, name='services'),
    path('calendar/', views.get_calendar_view, name='calendar'),
    path('me/', views.get_current_user, name='current-user'),
    path('deposit-settings/', views.deposit_settings, name='deposit-settings'),
]