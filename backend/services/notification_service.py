import logging
from services.email_service import (
    send_booking_confirmation,
    send_admin_notification,
    send_payment_confirmation,
    send_booking_update
)
from services.sms_service import send_booking_sms

logger = logging.getLogger(__name__)


def notify_customer(booking, event, extra_context=None):
    """
    Send both email and SMS notifications to customer
    
    Args:
        booking: Booking object
        event (str): Event type
        extra_context (dict): Additional context for notifications
    
    Returns:
        dict: Results of both notifications
    """
    results = {
        'email_sent': False,
        'sms_sent': False,
        'errors': []
    }
    
    # Send email notification
    try:
        email_result = _send_email_notification(booking, event, extra_context)
        results['email_sent'] = email_result
        if not email_result:
            results['errors'].append('Email notification failed')
    except Exception as e:
        logger.error(f"Email notification error for booking {booking.id}, event {event}: {e}")
        results['errors'].append(f"Email error: {str(e)}")
    
    # Send SMS notification
    try:
        sms_result = send_booking_sms(booking, event, extra_context)
        results['sms_sent'] = sms_result
        if not sms_result:
            results['errors'].append('SMS notification failed')
    except Exception as e:
        logger.error(f"SMS notification error for booking {booking.id}, event {event}: {e}")
        results['errors'].append(f"SMS error: {str(e)}")
    
    if not results['email_sent'] and not results['sms_sent']:
        logger.error(f"Both email and SMS failed for booking {booking.id}, event {event}")
    
    return results


def _send_email_notification(booking, event, extra_context=None):
    """
    Send appropriate email based on event type
    """
    if event == 'booking_created':
        send_booking_confirmation(booking)
        return True
    elif event == 'booking_confirmed':
        send_booking_confirmation(booking)
        return True
    elif event == 'payment_success':
        payment_type = extra_context.get('payment_type', 'deposit') if extra_context else 'deposit'
        send_payment_confirmation(booking, payment_type)
        return True
    elif event == 'payment_remaining_success':
        send_payment_confirmation(booking, 'full')
        return True
    elif event == 'booking_cancelled':
        send_booking_update(booking, 'cancelled')
        return True
    elif event == 'booking_rescheduled':
        old_date = extra_context.get('old_date') if extra_context else None
        old_time = extra_context.get('old_time') if extra_context else None
        send_booking_update(booking, 'rescheduled', old_date, old_time)
        return True
    elif event == 'booking_status_updated':
        # Use appropriate email based on status
        if booking.status == 'cancelled':
            send_booking_update(booking, 'cancelled')
        elif booking.status == 'partial' or booking.status == 'paid':
            send_booking_confirmation(booking)
        return True
    else:
        logger.warning(f"No email handler for event: {event}")
        return False


def notify_admin(booking, event, extra_context=None):
    """
    Send admin notification (currently email only, could be extended to SMS)
    
    Args:
        booking: Booking object
        event (str): Event type
        extra_context (dict): Additional context
    
    Returns:
        bool: True if notification sent successfully
    """
    try:
        from services.email_service import send_admin_notification
        send_admin_notification(booking)
        return True
    except Exception as e:
        logger.error(f"Admin notification error for booking {booking.id}, event {event}: {e}")
        return False