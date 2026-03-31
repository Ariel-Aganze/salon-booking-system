import stripe
from django.conf import settings
from decimal import Decimal

stripe.api_key = settings.STRIPE_SECRET_KEY

DEPOSIT_PERCENTAGE = 30  # 30% deposit


def calculate_deposit_amount(total_price):
    """Calculate deposit amount (30% of total)"""
    deposit = (Decimal(DEPOSIT_PERCENTAGE) / 100) * Decimal(total_price)
    return int(deposit * 100)  # Return in cents for Stripe


def calculate_remaining_amount(total_price, amount_paid):
    """Calculate remaining balance"""
    return Decimal(total_price) - Decimal(amount_paid)


def create_checkout_session(booking_id, success_url, cancel_url):
    """Create Stripe checkout session for deposit"""
    from apps.booking.models import Booking
    
    booking = Booking.objects.get(id=booking_id)
    deposit_amount = calculate_deposit_amount(booking.total_price)
    
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'usd',
                'product_data': {
                    'name': f"Salon Booking Deposit - {booking.service.name}",
                    'description': f"Date: {booking.date} at {booking.time_slot}",
                },
                'unit_amount': deposit_amount,
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            'booking_id': str(booking_id),  # Convert to string
            'payment_type': 'deposit'
        }
    )
    
    return session


def create_remaining_payment_session(reservation_code, success_url, cancel_url):
    """Create Stripe checkout session for remaining balance"""
    from apps.booking.models import Booking
    
    booking = Booking.objects.get(reservation_code=reservation_code)
    remaining = calculate_remaining_amount(booking.total_price, booking.amount_paid)
    remaining_cents = int(remaining * 100)
    
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'usd',
                'product_data': {
                    'name': f"Remaining Payment - {booking.service.name}",
                    'description': f"Booking: {booking.reservation_code}",
                },
                'unit_amount': remaining_cents,
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            'booking_id': str(booking.id),  # Convert to string
            'reservation_code': reservation_code,
            'payment_type': 'remaining'
        }
    )
    
    return session