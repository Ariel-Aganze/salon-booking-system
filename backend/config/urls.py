from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # JWT Authentication endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # API endpoints
    path('api/bookings/', include('apps.booking.urls')),
    path('api/payments/', include('apps.payment.urls')),
    path('api/reservations/', include('apps.reservation.urls')),
    path('api/admin/', include('apps.adminpanel.urls')),
    path('api/webhooks/', include('webhooks.urls')),
    # Add to urlpatterns
    # path('api/chatbot/', include('apps.chatbot.urls')),
]