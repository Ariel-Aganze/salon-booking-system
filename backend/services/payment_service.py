import stripe
from django.conf import settings
from decimal import Decimal
from django.core.cache import cache

stripe.api_key = settings.STRIPE_SECRET_KEY


def get_deposit_percentage():
    """Get deposit percentage from database settings - always get fresh value"""
    try:
        from apps.adminpanel.models import Setting
        
        # Clear any cached value
        cache.delete('deposit_percentage')
        
        # Get the setting directly without any caching
        setting = Setting.objects.using('default').first()
        
        if setting:
            percentage = setting.deposit_percentage
            print(f"Retrieved deposit percentage from database: {percentage}%")
            return percentage
        
        # If no setting exists, create one with default
        setting = Setting.objects.create(deposit_percentage=30)
        print(f"Created new setting with default 30%")
        return 30
        
    except Exception as e:
        print(f"Error getting deposit percentage: {e}")
        return 30  # Fallback to 30%


def calculate_deposit_amount(total_price):
    """Calculate deposit amount based on current deposit percentage"""
    deposit_percentage = get_deposit_percentage()
    deposit = (Decimal(deposit_percentage) / 100) * Decimal(total_price)
    print(f"Calculating deposit: {deposit_percentage}% of {total_price} = {deposit}")
    return int(deposit * 100)  # Return in cents for Stripe


def calculate_remaining_amount(total_price, amount_paid):
    """Calculate remaining balance"""
    return Decimal(total_price) - Decimal(amount_paid)


def create_checkout_session(booking_id, success_url, cancel_url):
    """Create Stripe checkout session for deposit"""
    from apps.booking.models import Booking
    
    # Force fresh database query
    booking = Booking.objects.select_related('service').get(id=booking_id)
    
    # Get fresh deposit percentage
    deposit_percentage = get_deposit_percentage()
    deposit_amount = calculate_deposit_amount(booking.total_price)
    
    print("=" * 60)
    print(f"Creating checkout session for booking {booking_id}")
    print(f"Service: {booking.service.name}")
    print(f"Total price: ${booking.total_price}")
    print(f"Deposit percentage: {deposit_percentage}%")
    print(f"Deposit amount: ${deposit_amount / 100}")
    print("=" * 60)
    
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'usd',
                'product_data': {
                    'name': f"Salon Booking Deposit - {booking.service.name}",
                    'description': f"Date: {booking.date} at {booking.time_slot} ({deposit_percentage}% deposit required)",
                },
                'unit_amount': deposit_amount,
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url=success_url,
        cancel_url=cancel_url,
        metadata={
            'booking_id': str(booking_id),
            'payment_type': 'deposit',
            'deposit_percentage': str(deposit_percentage)
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
            'booking_id': str(booking.id),
            'reservation_code': reservation_code,
            'payment_type': 'remaining'
        }
    )
    
    return session