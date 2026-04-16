import logging

logger = logging.getLogger(__name__)


def build_sms_message(booking, event, extra_context=None):
    """
    Build SMS message for a specific booking event
    
    Args:
        booking: Booking object
        event (str): Event type
        extra_context (dict): Additional context for message
    
    Returns:
        str: Formatted SMS message
    """
    
    def format_time(time_str):
        if not time_str:
            return ''
        try:
            hour = int(time_str.split(':')[0])
            minute = time_str.split(':')[1]
            ampm = 'AM' if hour < 12 else 'PM'
            hour12 = hour % 12
            if hour12 == 0:
                hour12 = 12
            return f"{hour12}:{minute} {ampm}"
        except:
            return time_str
    
    salon_name = "Nysha Hair Braiding"
    
    messages = {
        'booking_created': f"{salon_name}: Booking created. Use code {booking.reservation_code} to complete payment.",
        
        'booking_confirmed': f"{salon_name}: Booking confirmed for {booking.date} at {format_time(booking.time_slot)}. Code: {booking.reservation_code}",
        
        'payment_success': f"{salon_name}: Payment received. Your booking for {booking.date} at {format_time(booking.time_slot)} is confirmed. Code: {booking.reservation_code}",
        
        'payment_remaining_success': f"{salon_name}: Remaining payment received. Your booking is now fully paid. Thank you!",
        
        'booking_cancelled': f"{salon_name}: Booking for {booking.date} at {format_time(booking.time_slot)} has been cancelled. Code: {booking.reservation_code}",
        
        'booking_rescheduled': f"{salon_name}: Booking rescheduled to {booking.date} at {format_time(booking.time_slot)}. Code: {booking.reservation_code}",
        
        'booking_status_updated': f"{salon_name}: Your booking status is now {booking.status}. Code: {booking.reservation_code}",
        
        'deposit_payment_success': f"{salon_name}: Deposit payment received. Booking confirmed for {booking.date} at {format_time(booking.time_slot)}. Remaining balance due at appointment.",
    }
    
    message = messages.get(event)
    
    if not message:
        logger.warning(f"No SMS template for event: {event}")
        return None
    
    # Handle payment amount for payment events
    if extra_context and 'amount' in extra_context:
        if event == 'payment_success':
            message = f"{salon_name}: ${extra_context['amount']} payment received. Your booking for {booking.date} at {format_time(booking.time_slot)} is confirmed. Code: {booking.reservation_code}"
        elif event == 'payment_remaining_success':
            message = f"{salon_name}: Remaining payment of ${extra_context['amount']} received. Your booking is now fully paid."
    
    # Handle deposit percentage for booking created
    if event == 'booking_created' and extra_context and 'deposit_percentage' in extra_context:
        message = f"{salon_name}: Booking created. Pay {extra_context['deposit_percentage']}% deposit using code {booking.reservation_code} to secure your spot."
    
    # Keep SMS under 160 characters for optimal delivery
    if len(message) > 160:
        message = message[:157] + '...'
    
    return message