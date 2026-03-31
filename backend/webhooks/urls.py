from django.urls import path
from . import stripe_webhook

urlpatterns = [
    path('stripe/', stripe_webhook.webhook, name='stripe-webhook'),
]