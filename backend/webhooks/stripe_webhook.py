import stripe
import json
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from apps.booking.models import Booking
from services.email_service import send_payment_confirmation, send_booking_confirmation, send_admin_notification
from services.notification_service import notify_customer
from utils.code_generator import generate_reservation_code

stripe.api_key = settings.STRIPE_SECRET_KEY


@csrf_exempt
@require_POST
def webhook(request):
    """Handle Stripe webhook events - NO AUTHENTICATION REQUIRED"""
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    webhook_secret = settings.STRIPE_WEBHOOK_SECRET
    
    if not webhook_secret:
        return JsonResponse({'error': 'Webhook secret not configured'}, status=500)
    
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )
    except ValueError as e:
        return JsonResponse({'error': f'Invalid payload: {str(e)}'}, status=400)
    except stripe.error.SignatureVerificationError as e:
        return JsonResponse({'error': f'Invalid signature: {str(e)}'}, status=400)
    
    # Handle the event
    event_type = event['type']
    
    if event_type == 'checkout.session.completed':
        session = event['data']['object']
        handle_checkout_completed(session)
    else:
        print(f"Unhandled event type: {event_type}")
    
    return JsonResponse({'status': 'success'})


def handle_checkout_completed(session):
    """Process successful payment"""
    session_dict = session.to_dict() if hasattr(session, 'to_dict') else dict(session)
    metadata = session_dict.get('metadata', {})
    
    payment_type = metadata.get('payment_type')
    booking_id = metadata.get('booking_id')
    
    if not booking_id:
        return
    
    try:
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        return
    
    amount_total = session_dict.get('amount_total', 0)
    amount_paid = amount_total / 100 if amount_total else 0
    
    if payment_type == 'deposit':
        booking.amount_paid = amount_paid
        booking.status = 'partial'
        
        if not booking.reservation_code:
            booking.reservation_code = generate_reservation_code()
        
        booking.save()
        
        try:
            send_booking_confirmation(booking)
            send_admin_notification(booking)
            send_payment_confirmation(booking, "deposit")
        except Exception as e:
            print(f"Email error: {e}")
        
        # Send SMS notification for deposit payment
        try:
            notify_customer(booking, 'payment_success', {'payment_type': 'deposit', 'amount': amount_paid})
        except Exception as e:
            print(f"SMS notification error: {e}")
        
    elif payment_type == 'remaining':
        booking.amount_paid = amount_paid
        booking.status = 'paid'
        booking.save()
        
        try:
            send_payment_confirmation(booking, "full")
        except Exception as e:
            print(f"Email error: {e}")
        
        # Send SMS notification for remaining payment
        try:
            notify_customer(booking, 'payment_remaining_success', {'amount': amount_paid})
        except Exception as e:
            print(f"SMS notification error: {e}")


def handle_payment_intent_succeeded(payment_intent):
    """Handle successful payment intent (fallback for checkout events)"""
    # Convert to dictionary
    intent_dict = payment_intent.to_dict() if hasattr(payment_intent, 'to_dict') else dict(payment_intent)
    
    # Get metadata
    metadata = intent_dict.get('metadata', {})
    
    booking_id = metadata.get('booking_id')
    
    if not booking_id:
        print("No booking_id in payment_intent metadata")
        return
    
    print(f"Processing payment_intent.succeeded for booking {booking_id}")
    
    try:
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        print(f"Booking {booking_id} not found")
        return
    
    # Only process if booking is still pending
    if booking.status == 'pending':
        amount_received = intent_dict.get('amount_received', 0)
        amount_paid = amount_received / 100 if amount_received else 0
        
        booking.amount_paid = amount_paid
        booking.status = 'partial'
        
        if not booking.reservation_code:
            booking.reservation_code = generate_reservation_code()
        
        booking.save()
        print(f"Booking updated via payment_intent - Status: {booking.status}, Code: {booking.reservation_code}")
        
        # Send emails
        try:
            send_booking_confirmation(booking)
            send_admin_notification(booking)
            send_payment_confirmation(booking, "deposit")
        except Exception as e:
            print(f"Email error: {e}")
        
        # Send SMS notification for deposit payment (fallback)
        try:
            notify_customer(booking, 'payment_success', {'payment_type': 'deposit', 'amount': amount_paid})
        except Exception as e:
            print(f"SMS notification error: {e}")


def handle_checkout_expired(session):
    """Handle expired checkout session"""
    session_dict = session.to_dict() if hasattr(session, 'to_dict') else dict(session)
    metadata = session_dict.get('metadata', {})
    
    booking_id = metadata.get('booking_id')
    
    if not booking_id:
        return
    
    try:
        booking = Booking.objects.get(id=booking_id)
        # If booking is still pending and payment expired, unlock the time slot
        if booking.status == 'pending':
            from apps.booking.models import TimeSlot
            TimeSlot.objects.filter(
                date=booking.date,
                time=booking.time_slot
            ).update(is_available=True)
            booking.delete()
            print(f"Expired booking {booking_id} deleted, slot unlocked")
    except Booking.DoesNotExist:
        pass