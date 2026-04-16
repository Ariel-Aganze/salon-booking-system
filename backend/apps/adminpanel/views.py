from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.db.models import Sum, Count, Q
from django.utils import timezone
from apps.booking.models import Booking, Service, TimeSlot
from apps.booking.serializers import BookingSerializer, ServiceSerializer
from services.email_service import send_booking_update
from services.notification_service import notify_customer

# Simple admin auth (hardcoded for now - upgrade later)
ADMIN_TOKEN = "admin-secret-token-123"  # Change this!

def check_admin_auth(request):
    auth_header = request.headers.get('Authorization', '')
    return auth_header == f'Bearer {ADMIN_TOKEN}'

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_dashboard_stats(request):
    """Get dashboard statistics"""
    total_bookings = Booking.objects.count()
    pending_payments = Booking.objects.filter(status='pending').count()
    partial_payments = Booking.objects.filter(status='partial').count()
    completed = Booking.objects.filter(status='paid').count()
    
    total_revenue = Booking.objects.filter(status='paid').aggregate(
        total=Sum('total_price')
    )['total'] or 0
    
    deposit_revenue = Booking.objects.filter(status='partial').aggregate(
        total=Sum('amount_paid')
    )['total'] or 0
    
    return Response({
        'total_bookings': total_bookings,
        'pending_payments': pending_payments,
        'partial_payments': partial_payments,
        'completed_bookings': completed,
        'total_revenue': total_revenue,
        'deposit_revenue': deposit_revenue
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_all_bookings(request):
    """Get all bookings with filters"""
    status_filter = request.GET.get('status')
    date_filter = request.GET.get('date')
    
    queryset = Booking.objects.all()
    
    if status_filter:
        queryset = queryset.filter(status=status_filter)
    if date_filter:
        queryset = queryset.filter(date=date_filter)
    
    serializer = BookingSerializer(queryset, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_booking_detail(request, id):
    """Get single booking details"""
    try:
        booking = Booking.objects.get(id=id)
        serializer = BookingSerializer(booking)
        return Response(serializer.data)
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_booking_status(request, id):
    """Update booking status or reschedule"""
    try:
        booking = Booking.objects.get(id=id)
        
        # Check if this is a reschedule request (has date and time_slot)
        if 'date' in request.data and 'time_slot' in request.data:
            new_date = request.data.get('date')
            new_time_slot = request.data.get('time_slot')
            
            # Validate date format
            if not new_date or not new_time_slot:
                return Response(
                    {'error': 'date and time_slot are required for rescheduling'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Check if new time slot is available
            slot_available = TimeSlot.objects.filter(
                date=new_date, 
                time=new_time_slot, 
                is_available=True
            ).exists()
            
            if not slot_available:
                return Response(
                    {'error': 'Selected time slot is not available'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Unlock old time slot
            TimeSlot.objects.filter(
                date=booking.date,
                time=booking.time_slot
            ).update(is_available=True)
            
            # Lock new time slot
            TimeSlot.objects.filter(
                date=new_date,
                time=new_time_slot
            ).update(is_available=False)
            
            # Store old values for email
            old_date = booking.date
            old_time_slot = booking.time_slot
            
            # Update booking
            booking.date = new_date
            booking.time_slot = new_time_slot
            booking.save()
            
            # Send reschedule notification email
            try:
                send_booking_update(booking, "rescheduled", old_date, old_time_slot)
            except Exception as e:
                print(f"Failed to send reschedule email: {e}")
            
            # Send SMS notification for reschedule
            try:
                notify_customer(booking, 'booking_rescheduled', {'old_date': old_date, 'old_time': old_time_slot})
            except Exception as e:
                print(f"Failed to send reschedule SMS: {e}")
            
            serializer = BookingSerializer(booking)
            return Response(serializer.data)
        
        # Otherwise, update status
        new_status = request.data.get('status')
        
        if new_status not in ['pending', 'partial', 'paid', 'cancelled']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        old_status = booking.status
        booking.status = new_status
        booking.save()
        
        # If cancelled, unlock the time slot and send notifications
        if new_status == 'cancelled':
            TimeSlot.objects.filter(
                date=booking.date,
                time=booking.time_slot
            ).update(is_available=True)
            
            # Send cancellation notification email
            try:
                send_booking_update(booking, "cancelled")
            except Exception as e:
                print(f"Failed to send cancellation email: {e}")
            
            # Send SMS notification for cancellation
            try:
                notify_customer(booking, 'booking_cancelled')
            except Exception as e:
                print(f"Failed to send cancellation SMS: {e}")
        
        # If confirmed (from pending to partial/paid), send notifications
        elif old_status == 'pending' and new_status in ['partial', 'paid']:
            try:
                from services.email_service import send_booking_confirmation
                send_booking_confirmation(booking)
            except Exception as e:
                print(f"Failed to send confirmation email: {e}")
            
            # Send SMS notification for status update to confirmed
            try:
                notify_customer(booking, 'booking_confirmed')
            except Exception as e:
                print(f"Failed to send confirmation SMS: {e}")
        
        # For other status changes, send general status update
        elif old_status != new_status:
            try:
                notify_customer(booking, 'booking_status_updated')
            except Exception as e:
                print(f"Failed to send status update SMS: {e}")
        
        serializer = BookingSerializer(booking)
        return Response(serializer.data)
        
    except Booking.DoesNotExist:
        return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)
    

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def manage_services(request):
    """Manage services (CRUD)"""
    if request.method == 'GET':
        services = Service.objects.all()
        serializer = ServiceSerializer(services, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = ServiceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'PUT':
        service_id = request.data.get('id')
        try:
            service = Service.objects.get(id=service_id)
            serializer = ServiceSerializer(service, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Service.DoesNotExist:
            return Response({'error': 'Service not found'}, status=status.HTTP_404_NOT_FOUND)
    
    elif request.method == 'DELETE':
        service_id = request.data.get('id')
        try:
            service = Service.objects.get(id=service_id)
            service.delete()
            return Response({'message': 'Service deleted'})
        except Service.DoesNotExist:
            return Response({'error': 'Service not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_calendar_view(request):
    """Get visual calendar with bookings"""
    start_date = request.GET.get('start_date')
    end_date = request.GET.get('end_date')
    
    if start_date and end_date:
        bookings = Booking.objects.filter(date__range=[start_date, end_date])
    else:
        bookings = Booking.objects.all()[:50]
    
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """Get current authenticated user info"""
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'email': user.email,
        'is_staff': user.is_staff,
        'is_superuser': user.is_superuser
    })

@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated, IsAdminUser])
def deposit_settings(request):
    """Get or update deposit settings"""
    from .models import Setting
    
    # Get or create setting
    setting, created = Setting.objects.get_or_create(
        id=1,
        defaults={'deposit_percentage': 30}
    )
    
    if request.method == 'GET':
        return Response({
            'deposit_percentage': setting.deposit_percentage
        })
    
    elif request.method == 'PATCH':
        deposit_percentage = request.data.get('deposit_percentage')
        
        if deposit_percentage is not None:
            # Ensure it's an integer between 0 and 100
            deposit_percentage = int(deposit_percentage)
            deposit_percentage = max(0, min(100, deposit_percentage))
            
            setting.deposit_percentage = deposit_percentage
            setting.save()
            
            print(f"Deposit percentage updated to: {deposit_percentage}%")
        
        return Response({
            'success': True,
            'deposit_percentage': setting.deposit_percentage,
            'message': f'Deposit settings updated to {setting.deposit_percentage}%'
        })