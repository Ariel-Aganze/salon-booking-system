# backend/apps/booking/views.py
# Add these new view functions to your existing views.py file

import random
import string
from datetime import datetime, timedelta

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from decimal import Decimal
from .models import Service, TimeSlot, Booking, BlockedDate
from .serializers import ServiceSerializer, TimeSlotSerializer, CreateBookingSerializer, BookingSerializer, BlockedDateSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser


@api_view(['GET'])
@permission_classes([AllowAny])
def get_services(request):
    """Get all services"""
    services = Service.objects.all()
    serializer = ServiceSerializer(services, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_available_slots(request):
    """Get available time slots for a specific date"""
    date = request.GET.get('date')
    
    if not date:
        return Response(
            {'error': 'date parameter is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Check if date is blocked
    if BlockedDate.objects.filter(date=date, is_active=True).exists():
        return Response(
            {'error': f'This date is blocked. Bookings are not available.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    slots = TimeSlot.objects.filter(date=date, is_available=True)
    serializer = TimeSlotSerializer(slots, many=True)
    return Response(serializer.data)


def generate_reservation_code():
    """Generate a unique reservation code like SALON-8F3K92"""
    prefix = "SALON"
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    return f"{prefix}-{random_part}"


@api_view(['POST'])
@permission_classes([AllowAny])
def create_booking(request):
    """Create a booking before payment"""
    try:
        serializer = CreateBookingSerializer(data=request.data)
        
        if serializer.is_valid():
            # Get service using the integer ID
            service_id = serializer.validated_data['service']
            service = Service.objects.get(id=service_id)
            
            # Check if time slot is available
            date = serializer.validated_data['date']
            time_slot = serializer.validated_data['time_slot']
            
            # Double-check date is not blocked (redundant with serializer validation)
            if BlockedDate.objects.filter(date=date, is_active=True).exists():
                return Response(
                    {'error': f'Bookings are not available for {date}. This date has been blocked by the administrator.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            slot_exists = TimeSlot.objects.filter(
                date=date, 
                time=time_slot, 
                is_available=True
            ).exists()
            
            if not slot_exists:
                return Response(
                    {'error': 'This time slot is no longer available'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Generate unique reservation code BEFORE creating booking
            reservation_code = generate_reservation_code()
            while Booking.objects.filter(reservation_code=reservation_code).exists():
                reservation_code = generate_reservation_code()
            
            # Create booking WITH reservation code
            booking = Booking.objects.create(
                reservation_code=reservation_code,
                full_name=serializer.validated_data['full_name'],
                email=serializer.validated_data['email'],
                phone=serializer.validated_data['phone'],
                service=service,
                date=date,
                time_slot=time_slot,
                total_price=service.price,
                amount_paid=Decimal('0.00'),
                status='pending'
            )
            
            # Lock the time slot
            TimeSlot.objects.filter(
                date=booking.date,
                time=booking.time_slot
            ).update(is_available=False)
            
            # Send admin notification email
            try:
                from services.email_service import send_admin_notification
                send_admin_notification(booking)
            except Exception as e:
                print(f"Admin notification error: {e}")
            
            # Send customer notifications (Email + SMS)
            try:
                from services.notification_service import notify_customer
                notify_customer(booking, 'booking_created')
            except Exception as e:
                print(f"Customer notification error: {e}")
            
            response_serializer = BookingSerializer(booking)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def generate_time_slots(request):
    """Generate time slots for a date range based on working hours"""
    start_date = request.data.get('start_date')
    end_date = request.data.get('end_date')
    working_hours = request.data.get('working_hours')
    
    if not start_date or not end_date:
        return Response(
            {'error': 'start_date and end_date are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        start = datetime.strptime(start_date, '%Y-%m-%d').date()
        end = datetime.strptime(end_date, '%Y-%m-%d').date()
    except ValueError:
        return Response(
            {'error': 'Invalid date format. Use YYYY-MM-DD'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    created_count = 0
    current_date = start
    
    while current_date <= end:
        # Skip blocked dates when generating time slots
        if BlockedDate.objects.filter(date=current_date, is_active=True).exists():
            current_date += timedelta(days=1)
            continue
            
        day_key = current_date.strftime('%A').lower()
        hours = working_hours.get(day_key, {})
        
        if hours.get('is_open', False):
            open_hour = int(hours['open'].split(':')[0])
            close_hour = int(hours['close'].split(':')[0])
            
            for hour in range(open_hour, close_hour):
                time_str = f"{hour:02d}:00"
                slot, created = TimeSlot.objects.get_or_create(
                    date=current_date,
                    time=time_str,
                    defaults={'is_available': True}
                )
                if created:
                    created_count += 1
        
        current_date += timedelta(days=1)
    
    return Response({
        'success': True,
        'message': f'Created {created_count} time slots',
        'created_count': created_count
    })


# Blocked Dates Management Views (Admin Only)

@api_view(['GET'])
@permission_classes([IsAuthenticated, IsAdminUser])
def get_blocked_dates(request):
    """Get all blocked dates"""
    blocked_dates = BlockedDate.objects.filter(is_active=True)
    serializer = BlockedDateSerializer(blocked_dates, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def create_blocked_date(request):
    """Create a new blocked date"""
    serializer = BlockedDateSerializer(data=request.data)
    
    if serializer.is_valid():
        date = serializer.validated_data['date']
        
        # Check if date already exists
        if BlockedDate.objects.filter(date=date).exists():
            # Reactivate if it exists but is inactive
            blocked = BlockedDate.objects.get(date=date)
            if not blocked.is_active:
                blocked.is_active = True
                blocked.reason = serializer.validated_data.get('reason', blocked.reason)
                blocked.save()
                return Response(BlockedDateSerializer(blocked).data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {'error': f'Date {date} is already blocked'},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # Create new blocked date
        blocked_date = serializer.save()
        
        # Optional: Delete any existing time slots for this date to ensure no bookings
        TimeSlot.objects.filter(date=date).delete()
        
        return Response(BlockedDateSerializer(blocked_date).data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_blocked_date(request, id):
    """Delete or deactivate a blocked date"""
    try:
        blocked_date = BlockedDate.objects.get(id=id)
        
        # Instead of hard delete, we deactivate it
        blocked_date.is_active = False
        blocked_date.save()
        
        # Optionally, you can regenerate time slots for this date
        # This would need working hours info
        
        return Response({
            'success': True,
            'message': f'Date {blocked_date.date} has been unblocked'
        }, status=status.HTTP_200_OK)
        
    except BlockedDate.DoesNotExist:
        return Response(
            {'error': 'Blocked date not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['PATCH'])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_blocked_date(request, id):
    """Update a blocked date (reason only, date cannot be changed)"""
    try:
        blocked_date = BlockedDate.objects.get(id=id)
        
        # Only allow updating reason
        if 'reason' in request.data:
            blocked_date.reason = request.data['reason']
            blocked_date.save()
        
        serializer = BlockedDateSerializer(blocked_date)
        return Response(serializer.data)
        
    except BlockedDate.DoesNotExist:
        return Response(
            {'error': 'Blocked date not found'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def bulk_block_dates(request):
    """Block multiple dates at once"""
    dates = request.data.get('dates', [])
    reason = request.data.get('reason', '')
    
    if not dates:
        return Response(
            {'error': 'dates array is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    created_dates = []
    skipped_dates = []
    
    for date_str in dates:
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
            
            # Check if already blocked
            if BlockedDate.objects.filter(date=date, is_active=True).exists():
                skipped_dates.append(date_str)
                continue
            
            # Create or reactivate blocked date
            blocked, created = BlockedDate.objects.get_or_create(
                date=date,
                defaults={'reason': reason, 'is_active': True}
            )
            
            if not created and not blocked.is_active:
                blocked.is_active = True
                blocked.reason = reason or blocked.reason
                blocked.save()
            
            # Delete time slots for this date
            TimeSlot.objects.filter(date=date).delete()
            
            created_dates.append(date_str)
            
        except ValueError:
            skipped_dates.append(date_str)
    
    return Response({
        'success': True,
        'message': f'Blocked {len(created_dates)} dates. Skipped {len(skipped_dates)} dates.',
        'blocked_dates': created_dates,
        'skipped_dates': skipped_dates
    }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([AllowAny])  # Public endpoint - no authentication required
def get_public_blocked_dates(request):
    """Get all blocked dates - public endpoint for customers"""
    # Only return active blocked dates
    blocked_dates = BlockedDate.objects.filter(is_active=True)
    
    # Return only the date and reason (no admin-only fields)
    data = [
        {
            'date': blocked.date,
            'reason': blocked.reason if blocked.reason else None
        }
        for blocked in blocked_dates
    ]
    return Response(data)