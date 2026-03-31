from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from django.db.models import Sum, Count, Q
from django.utils import timezone
from apps.booking.models import Booking, Service
from apps.booking.serializers import BookingSerializer, ServiceSerializer

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
    """Update booking status (confirm, cancel, reschedule)"""
    try:
        booking = Booking.objects.get(id=id)
        new_status = request.data.get('status')
        
        if new_status not in ['pending', 'partial', 'paid', 'cancelled']:
            return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
        
        booking.status = new_status
        booking.save()
        
        # If cancelled, unlock the time slot
        if new_status == 'cancelled':
            from apps.booking.models import TimeSlot
            TimeSlot.objects.filter(
                date=booking.date,
                time=booking.time_slot
            ).update(is_available=True)
        
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