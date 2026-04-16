from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.html import strip_tags

def send_booking_confirmation(booking):
    """Send booking confirmation email to customer"""
    subject = f"Booking Confirmation - {booking.reservation_code}"
    
    # Convert Decimal to float safely
    total_price = float(booking.total_price)
    deposit_amount = total_price * 0.3  # 30% deposit
    remaining_amount = total_price - deposit_amount
    
    # HTML email template
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #8B4513; color: white; padding: 20px; text-align: center; }}
            .content {{ padding: 20px; background-color: #f9f9f9; }}
            .booking-details {{ background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }}
            .status {{ display: inline-block; padding: 5px 10px; border-radius: 3px; font-weight: bold; }}
            .status-pending {{ background-color: #ffc107; color: #000; }}
            .status-partial {{ background-color: #17a2b8; color: #fff; }}
            .status-paid {{ background-color: #28a745; color: #fff; }}
            .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Nysha Braiding Salon</h1>
                <h2>Booking Confirmation</h2>
            </div>
            <div class="content">
                <h3>Dear {booking.full_name},</h3>
                <p>Thank you for booking with us! Your appointment has been confirmed.</p>
                
                <div class="booking-details">
                    <h3>Booking Details:</h3>
                    <p><strong>Reservation Code:</strong> {booking.reservation_code}</p>
                    <p><strong>Service:</strong> {booking.service.name}</p>
                    <p><strong>Date:</strong> {booking.date}</p>
                    <p><strong>Time:</strong> {booking.time_slot}</p>
                    <p><strong>Total Price:</strong> ${total_price:.2f}</p>
                    <p><strong>Deposit Paid:</strong> ${deposit_amount:.2f}</p>
                    <p><strong>Remaining Balance:</strong> ${remaining_amount:.2f}</p>
                    <p><strong>Status:</strong> 
                        <span class="status status-{booking.status}">{booking.status.upper()}</span>
                    </p>
                </div>
                
                <p>Please keep your reservation code <strong>{booking.reservation_code}</strong> for future reference.</p>
                <p>You can use this code to check your booking status or pay the remaining balance.</p>
                
                <p><strong>Important:</strong> Please arrive 10 minutes before your appointment time.</p>
            </div>
            <div class="footer">
                <p>Nysha Braiding Salon | 217 South 47th Street, Philadelphia, PA</p>
                <p>Phone: +1 317 372 7049 | Email: aichetoudiah12@gmail.com</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[booking.email],
            html_message=html_message,
            fail_silently=False,
        )
        print(f"Booking confirmation email sent to {booking.email}")
    except Exception as e:
        print(f"Failed to send booking confirmation: {e}")


def send_admin_notification(booking):
    """Send notification email to admin when new booking is created"""
    subject = f"New Booking - {booking.reservation_code}"
    
    total_price = float(booking.total_price)
    
    html_message = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; }}
            .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
            .header {{ background-color: #8B4513; color: white; padding: 20px; text-align: center; }}
            .content {{ padding: 20px; background-color: #f9f9f9; }}
            .booking-details {{ background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }}
            .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666; }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Nysha Braiding Salon</h1>
                <h2>New Booking Created!</h2>
            </div>
            <div class="content">
                <div class="booking-details">
                    <h3>Booking Details:</h3>
                    <p><strong>Reservation Code:</strong> {booking.reservation_code}</p>
                    <p><strong>Customer:</strong> {booking.full_name}</p>
                    <p><strong>Email:</strong> {booking.email}</p>
                    <p><strong>Phone:</strong> {booking.phone}</p>
                    <p><strong>Service:</strong> {booking.service.name}</p>
                    <p><strong>Date:</strong> {booking.date} at {booking.time_slot}</p>
                    <p><strong>Total Price:</strong> ${total_price:.2f}</p>
                    <p><strong>Status:</strong> {booking.status}</p>
                </div>
                <p><a href="http://localhost:5174/admin/dashboard">Go to Admin Dashboard</a></p>
            </div>
            <div class="footer">
                <p>Nysha Braiding Salon | 217 South 47th Street, Philadelphia, PA</p>
                <p>Phone: +1 317 372 7049 | Email: aichetoudiah12@gmail.com</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=['admin@nyshabraiding.com'],
            html_message=html_message,
            fail_silently=False,
        )
        print(f"Admin notification sent")
    except Exception as e:
        print(f"Failed to send admin notification: {e}")


def send_payment_confirmation(booking, payment_type="deposit"):
    """Send payment confirmation email"""
    total_price = float(booking.total_price)
    amount_paid = float(booking.amount_paid)
    remaining = total_price - amount_paid
    
    if payment_type == "deposit":
        subject = f"Deposit Payment Confirmed - {booking.reservation_code}"
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #17a2b8; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; background-color: #f9f9f9; }}
                .booking-details {{ background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }}
                .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Nysha Braiding Salon</h1>
                    <h2>Deposit Payment Confirmed</h2>
                </div>
                <div class="content">
                    <h3>Dear {booking.full_name},</h3>
                    <p>Your deposit payment has been received.</p>
                    
                    <div class="booking-details">
                        <h3>Payment Details:</h3>
                        <p><strong>Reservation Code:</strong> {booking.reservation_code}</p>
                        <p><strong>Deposit Paid:</strong> ${amount_paid:.2f}</p>
                        <p><strong>Remaining Balance:</strong> ${remaining:.2f}</p>
                    </div>
                    
                    <p>Please pay the remaining amount before your appointment.</p>
                    <p>Thank you for choosing Nysha Braiding Salon!</p>
                </div>
                <div class="footer">
                    <p>Nysha Braiding Salon | 217 South 47th Street, Philadelphia, PA</p>
                    <p>Phone: +1 317 372 7049 | Email: aichetoudiah12@gmail.com</p>
                </div>
            </div>
        </body>
        </html>
        """
    else:
        subject = f"Full Payment Confirmed - {booking.reservation_code}"
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #28a745; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; background-color: #f9f9f9; }}
                .booking-details {{ background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }}
                .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Nysha Braiding Salon</h1>
                    <h2>Full Payment Confirmed</h2>
                </div>
                <div class="content">
                    <h3>Dear {booking.full_name},</h3>
                    <p>Your full payment has been received.</p>
                    
                    <div class="booking-details">
                        <h3>Payment Details:</h3>
                        <p><strong>Reservation Code:</strong> {booking.reservation_code}</p>
                        <p><strong>Amount Paid:</strong> ${amount_paid:.2f}</p>
                    </div>
                    
                    <p>Your booking is now fully confirmed.</p>
                    <p>Thank you for choosing Nysha Braiding Salon!</p>
                </div>
                <div class="footer">
                    <p>Nysha Braiding Salon | 217 South 47th Street, Philadelphia, PA</p>
                    <p>Phone: +1 317 372 7049 | Email: aichetoudiah12@gmail.com</p>
                </div>
            </div>
        </body>
        </html>
        """
    
    plain_message = strip_tags(html_message)
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[booking.email],
            html_message=html_message,
            fail_silently=False,
        )
        print(f"Payment confirmation email sent to {booking.email}")
    except Exception as e:
        print(f"Failed to send payment email: {e}")


def send_booking_update(booking, update_type="cancelled", old_date=None, old_time=None):
    """Send notification when booking is updated by admin"""
    if not booking.email:
        return
    
    if update_type == "cancelled":
        subject = f"Booking Cancelled - {booking.reservation_code}"
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #dc2626; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; background-color: #f9f9f9; }}
                .booking-details {{ background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }}
                .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Nysha Braiding Salon</h1>
                    <h2>Booking Cancelled</h2>
                </div>
                <div class="content">
                    <h3>Dear {booking.full_name},</h3>
                    <p>Your booking has been <strong>CANCELLED</strong>.</p>
                    
                    <div class="booking-details">
                        <h3>Cancelled Booking Details:</h3>
                        <p><strong>Reservation Code:</strong> {booking.reservation_code}</p>
                        <p><strong>Service:</strong> {booking.service.name}</p>
                        <p><strong>Original Date:</strong> {booking.date}</p>
                        <p><strong>Original Time:</strong> {booking.time_slot}</p>
                    </div>
                    
                    <p>If you have any questions, please contact us.</p>
                </div>
                <div class="footer">
                    <p>Nysha Braiding Salon | 217 South 47th Street, Philadelphia, PA</p>
                    <p>Phone: +1 317 372 7049 | Email: aichetoudiah12@gmail.com</p>
                </div>
            </div>
        </body>
        </html>
        """
    
    elif update_type == "rescheduled":
        subject = f"Booking Rescheduled - {booking.reservation_code}"
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #3b82f6; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; background-color: #f9f9f9; }}
                .old-details {{ background-color: #fee2e2; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #dc2626; }}
                .new-details {{ background-color: #dcfce7; padding: 15px; margin: 10px 0; border-radius: 5px; border-left: 4px solid #22c55e; }}
                .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Nysha Braiding Salon</h1>
                    <h2>Booking Rescheduled</h2>
                </div>
                <div class="content">
                    <h3>Dear {booking.full_name},</h3>
                    <p>Your booking has been <strong>RESCHEDULED</strong>.</p>
                    
                    <div class="old-details">
                        <h4>Original Appointment:</h4>
                        <p><strong>Date:</strong> {old_date}</p>
                        <p><strong>Time:</strong> {old_time}</p>
                    </div>
                    
                    <div class="new-details">
                        <h4>New Appointment:</h4>
                        <p><strong>Date:</strong> {booking.date}</p>
                        <p><strong>Time:</strong> {booking.time_slot}</p>
                    </div>
                    
                    <div class="booking-details" style="background: white; padding: 15px; margin: 15px 0; border-radius: 5px;">
                        <p><strong>Reservation Code:</strong> {booking.reservation_code}</p>
                        <p><strong>Service:</strong> {booking.service.name}</p>
                    </div>
                    
                    <p>Please contact us if this doesn't work for you.</p>
                </div>
                <div class="footer">
                    <p>Nysha Braiding Salon | 217 South 47th Street, Philadelphia, PA</p>
                    <p>Phone: +1 317 372 7049 | Email: aichetoudiah12@gmail.com</p>
                </div>
            </div>
        </body>
        </html>
        """
    
    else:
        subject = f"Booking Confirmed - {booking.reservation_code}"
        html_message = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: Arial, sans-serif; }}
                .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                .header {{ background-color: #22c55e; color: white; padding: 20px; text-align: center; }}
                .content {{ padding: 20px; background-color: #f9f9f9; }}
                .booking-details {{ background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; }}
                .footer {{ text-align: center; padding: 20px; font-size: 12px; color: #666; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Nysha Braiding Salon</h1>
                    <h2>Booking Confirmed</h2>
                </div>
                <div class="content">
                    <h3>Dear {booking.full_name},</h3>
                    <p>Your booking has been <strong>CONFIRMED</strong>.</p>
                    
                    <div class="booking-details">
                        <h3>Booking Details:</h3>
                        <p><strong>Reservation Code:</strong> {booking.reservation_code}</p>
                        <p><strong>Service:</strong> {booking.service.name}</p>
                        <p><strong>Date:</strong> {booking.date}</p>
                        <p><strong>Time:</strong> {booking.time_slot}</p>
                    </div>
                    
                    <p>We look forward to seeing you!</p>
                </div>
                <div class="footer">
                    <p>Nysha Braiding Salon | 217 South 47th Street, Philadelphia, PA</p>
                    <p>Phone: +1 317 372 7049 | Email: aichetoudiah12@gmail.com</p>
                </div>
            </div>
        </body>
        </html>
        """
    
    plain_message = strip_tags(html_message)
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[booking.email],
            html_message=html_message,
            fail_silently=False,
        )
        print(f"Booking update email sent to {booking.email}")
        return True
    except Exception as e:
        print(f"Failed to send booking update email: {str(e)}")
        return False


# ============================================
# SAFE WRAPPER FUNCTIONS FOR SMS INTEGRATION
# ============================================

def send_booking_confirmation_safe(booking):
    """Safe wrapper for send_booking_confirmation that logs errors"""
    try:
        send_booking_confirmation(booking)
        return True
    except Exception as e:
        print(f"Failed to send booking confirmation email: {e}")
        return False


def send_admin_notification_safe(booking):
    """Safe wrapper for send_admin_notification that logs errors"""
    try:
        send_admin_notification(booking)
        return True
    except Exception as e:
        print(f"Failed to send admin notification email: {e}")
        return False


def send_payment_confirmation_safe(booking, payment_type="deposit"):
    """Safe wrapper for send_payment_confirmation that logs errors"""
    try:
        send_payment_confirmation(booking, payment_type)
        return True
    except Exception as e:
        print(f"Failed to send payment confirmation email: {e}")
        return False


def send_booking_update_safe(booking, update_type="cancelled", old_date=None, old_time=None):
    """Safe wrapper for send_booking_update that logs errors"""
    try:
        send_booking_update(booking, update_type, old_date, old_time)
        return True
    except Exception as e:
        print(f"Failed to send booking update email: {e}")
        return False