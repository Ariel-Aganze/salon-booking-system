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
    
    context = {
        'full_name': booking.full_name,
        'reservation_code': booking.reservation_code,
        'service': booking.service.name,
        'date': booking.date,
        'time_slot': booking.time_slot,
        'total_price': total_price,
        'deposit_paid': deposit_amount,
        'remaining_balance': remaining_amount,
        'status': booking.status,
    }
    
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
                <h1>Nysha Braiding Salon By Ariel</h1>
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
                <p>Nysha Braiding Salon | 123 Beauty Street | Kigali, Rwanda</p>
                <p>Phone: +250 788 888 888 | Email: info@astansalon.com</p>
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
        print(f"Email sent to {booking.email}")
    except Exception as e:
        print(f"Failed to send email: {e}")


def send_admin_notification(booking):
    """Send notification email to admin when new booking is created"""
    subject = f"New Booking - {booking.reservation_code}"
    
    total_price = float(booking.total_price)
    
    html_message = f"""
    <html>
    <body>
        <h2>New Booking Created!</h2>
        <p><strong>Reservation Code:</strong> {booking.reservation_code}</p>
        <p><strong>Customer:</strong> {booking.full_name}</p>
        <p><strong>Email:</strong> {booking.email}</p>
        <p><strong>Phone:</strong> {booking.phone}</p>
        <p><strong>Service:</strong> {booking.service.name}</p>
        <p><strong>Date:</strong> {booking.date} at {booking.time_slot}</p>
        <p><strong>Total Price:</strong> ${total_price:.2f}</p>
        <p><strong>Status:</strong> {booking.status}</p>
        <p><a href="http://localhost:8000/admin/dashboard">Go to Admin Dashboard</a></p>
    </body>
    </html>
    """
    
    plain_message = strip_tags(html_message)
    
    try:
        send_mail(
            subject=subject,
            message=plain_message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=['admin@astansalon.com'],  # Change to your admin email
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
        message = f"""
        Dear {booking.full_name},
        
        Your deposit of ${amount_paid:.2f} has been received.
        
        Remaining balance: ${remaining:.2f}
        Please pay the remaining amount before your appointment.
        
        Thank you for choosing Nysha Braiding Salon!
        """
    else:
        subject = f"Full Payment Confirmed - {booking.reservation_code}"
        message = f"""
        Dear {booking.full_name},
        
        Your full payment of ${amount_paid:.2f} has been received.
        Your booking is now fully confirmed.
        
        Thank you for choosing Nysha Braiding Salon!
        """
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=[booking.email],
            fail_silently=False,
        )
        print(f"Payment confirmation email sent to {booking.email}")
    except Exception as e:
        print(f"Failed to send payment email: {e}")


def send_booking_update(booking, update_type="cancelled"):
    """Send notification when booking is updated by admin"""
    if update_type == "cancelled":
        subject = f"Booking Cancelled - {booking.reservation_code}"
        message = f"""
        Dear {booking.full_name},
        
        Your booking for {booking.service.name} on {booking.date} at {booking.time_slot} has been CANCELLED.
        
        If you have any questions, please contact us.
        """
    elif update_type == "rescheduled":
        new_date = booking.date
        new_time = booking.time_slot
        subject = f"Booking Rescheduled - {booking.reservation_code}"
        message = f"""
        Dear {booking.full_name},
        
        Your booking has been RESCHEDULED to {new_date} at {new_time}.
        
        Please contact us if this doesn't work for you.
        """
    else:
        subject = f"Booking Confirmed - {booking.reservation_code}"
        message = f"""
        Dear {booking.full_name},
        
        Your booking for {booking.service.name} on {booking.date} at {booking.time_slot} has been CONFIRMED.
        
        We look forward to seeing you!
        """
    
    send_mail(
        subject=subject,
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[booking.email],
        fail_silently=False,
    )