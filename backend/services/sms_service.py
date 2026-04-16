import logging
import re
from django.conf import settings

logger = logging.getLogger(__name__)

# Try to import Twilio, fail gracefully if not installed
try:
    from twilio.rest import Client
    from twilio.base.exceptions import TwilioRestException
    TWILIO_AVAILABLE = True
except ImportError:
    TWILIO_AVAILABLE = False
    logger.warning("Twilio not installed. SMS notifications will be disabled.")


class SMSService:
    """Service for sending SMS notifications using Twilio Messaging Service"""
    
    def __init__(self):
        self.account_sid = getattr(settings, 'TWILIO_ACCOUNT_SID', None)
        self.auth_token = getattr(settings, 'TWILIO_AUTH_TOKEN', None)
        self.messaging_service_sid = getattr(settings, 'TWILIO_MESSAGING_SERVICE_SID', None)
        self.client = None
        
        if TWILIO_AVAILABLE and self.account_sid and self.auth_token and self.messaging_service_sid:
            try:
                self.client = Client(self.account_sid, self.auth_token)
                logger.info("Twilio client initialized successfully with Messaging Service")
            except Exception as e:
                logger.error(f"Failed to initialize Twilio client: {e}")
        else:
            logger.warning("SMS service not fully configured. Missing Twilio credentials or Messaging Service SID.")
    
    def is_available(self):
        """Check if SMS service is properly configured"""
        return self.client is not None and self.messaging_service_sid is not None
    
    def validate_phone_number(self, phone_number):
        """Validate phone number format"""
        if not phone_number:
            return False
        # Remove all non-digit characters
        digits = re.sub(r'\D', '', phone_number)
        # Check if we have at least 10 digits (basic validation)
        return len(digits) >= 10
    
    def format_phone_number(self, phone_number):
        """Format phone number for international dialing"""
        # Remove all non-digit characters
        digits = re.sub(r'\D', '', phone_number)
        
        # If number starts with 0 and has 10 digits (local format), add country code
        if digits.startswith('0') and len(digits) == 10:
            # Assume Usa format: 0788XXXXXX -> +1788XXXXXX
            digits = '1' + digits[1:]
        # If number starts with 0 and has 9 digits, assume Usa format without prefix
        elif digits.startswith('0') and len(digits) == 9:
            digits = '1' + digits[1:]
        
        # Add plus sign for international format
        return f"+{digits}"
    
    def send_sms(self, to_number, message):
        """
        Send SMS message to a phone number using Twilio Messaging Service
        
        Args:
            to_number (str): Recipient phone number
            message (str): SMS message content
        
        Returns:
            bool: True if sent successfully, False otherwise
        """
        if not self.is_available():
            logger.warning("SMS service not available, skipping send")
            return False
        
        if not self.validate_phone_number(to_number):
            logger.warning(f"Invalid phone number format: {to_number}")
            return False
        
        # Truncate message if too long (1600 chars max for Twilio)
        if len(message) > 1600:
            message = message[:1597] + '...'
            logger.warning(f"SMS message truncated to 1600 characters")
        
        try:
            formatted_number = self.format_phone_number(to_number)
            
            # Send SMS using Messaging Service (no "from_" parameter)
            sms = self.client.messages.create(
                body=message,
                to=formatted_number,
                messaging_service_sid=self.messaging_service_sid
            )
            
            logger.info(f"SMS sent successfully to {to_number}. SID: {sms.sid}, Status: {sms.status}")
            return True
            
        except TwilioRestException as e:
            logger.error(f"Twilio error sending SMS to {to_number}: {e}")
            return False
        except Exception as e:
            logger.error(f"Unexpected error sending SMS to {to_number}: {e}")
            return False


# Singleton instance
sms_service = SMSService()


def send_booking_sms(booking, event, extra_context=None):
    """
    Send SMS notification for a booking event
    
    Events: booking_created, booking_confirmed, payment_success, 
            payment_remaining_success, booking_cancelled, 
            booking_rescheduled, booking_status_updated
    
    Args:
        booking: Booking object
        event (str): Event type
        extra_context (dict): Additional context for message building
    
    Returns:
        bool: True if SMS was sent successfully, False otherwise
    """
    if not booking.phone:
        logger.warning(f"No phone number for booking {booking.id}. SMS skipped.")
        return False
    
    if not sms_service.is_available():
        logger.warning("SMS service not available for booking {booking.id}")
        return False
    
    # Build message based on event
    message = _build_sms_message(booking, event, extra_context)
    
    if not message:
        logger.warning(f"No message template for event: {event}")
        return False
    
    return sms_service.send_sms(booking.phone, message)


def _build_sms_message(booking, event, extra_context=None):
    """
    Build SMS message for specific event
    
    Args:
        booking: Booking object
        event (str): Event type
        extra_context (dict): Additional context
    
    Returns:
        str: Formatted SMS message
    """
    
    def format_time(time_str):
        """Convert 24-hour time to 12-hour format"""
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
        'booking_created': f"{salon_name}: Booking created. Complete payment using code {booking.reservation_code}.",
        'booking_confirmed': f"{salon_name}: Booking confirmed for {booking.date} at {format_time(booking.time_slot)}. Code: {booking.reservation_code}",
        'payment_success': f"{salon_name}: Payment received. Your booking for {booking.date} at {format_time(booking.time_slot)} is confirmed. Code: {booking.reservation_code}",
        'payment_remaining_success': f"{salon_name}: Remaining payment received. Your booking is now fully paid. Thank you!",
        'booking_cancelled': f"{salon_name}: Booking for {booking.date} at {format_time(booking.time_slot)} has been cancelled.",
        'booking_rescheduled': f"{salon_name}: Booking rescheduled to {booking.date} at {format_time(booking.time_slot)}. Code: {booking.reservation_code}",
        'booking_status_updated': f"{salon_name}: Your booking status is now {booking.status}. Code: {booking.reservation_code}",
    }
    
    # Get base message
    message = messages.get(event)
    
    # Add amount information for payment events if available
    if extra_context and 'amount' in extra_context and event == 'payment_success':
        amount = extra_context['amount']
        message = f"{salon_name}: ${amount:.2f} payment received. Your booking for {booking.date} at {format_time(booking.time_slot)} is confirmed. Code: {booking.reservation_code}"
    
    if extra_context and 'amount' in extra_context and event == 'payment_remaining_success':
        amount = extra_context['amount']
        message = f"{salon_name}: Remaining payment of ${amount:.2f} received. Your booking is now fully paid."
    
    # Add reschedule details
    if event == 'booking_rescheduled' and extra_context:
        old_date = extra_context.get('old_date')
        old_time = extra_context.get('old_time')
        if old_date and old_time:
            message = f"{salon_name}: Booking rescheduled from {old_date} at {format_time(old_time)} to {booking.date} at {format_time(booking.time_slot)}. Code: {booking.reservation_code}"
    
    # Keep SMS under 160 characters for optimal delivery (but allow up to 1600)
    if len(message) > 160:
        logger.info(f"SMS message is {len(message)} characters long")
    
    return message