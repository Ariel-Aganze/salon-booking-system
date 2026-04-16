# backend/apps/booking/urls.py
# Update your existing urls.py file

from django.urls import path
from . import views

urlpatterns = [
    # Public endpoints
    path('services/', views.get_services, name='services'),
    path('slots/', views.get_available_slots, name='available-slots'),
    path('create/', views.create_booking, name='create-booking'),
    path('timeslots/generate/', views.generate_time_slots, name='generate-time-slots'),
    path('blocked-dates/', views.get_public_blocked_dates, name='public-blocked-dates'),  # NEW: Public endpoint
    
    # Admin blocked dates management
    path('admin/blocked-dates/', views.get_blocked_dates, name='get-blocked-dates'),
    path('admin/blocked-dates/create/', views.create_blocked_date, name='create-blocked-date'),
    path('admin/blocked-dates/<int:id>/delete/', views.delete_blocked_date, name='delete-blocked-date'),
    path('admin/blocked-dates/<int:id>/update/', views.update_blocked_date, name='update-blocked-date'),
    path('admin/blocked-dates/bulk-block/', views.bulk_block_dates, name='bulk-block-dates'),
]