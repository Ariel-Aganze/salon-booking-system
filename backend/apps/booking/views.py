from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from decimal import Decimal
from .models import Service, TimeSlot, Booking
from .serializers import ServiceSerializer, TimeSlotSerializer, CreateBookingSerializer, BookingSerializer


@api_view(['GET'])
def get_services(request):
    """Get all services"""
    services = Service.objects.all()
    serializer = ServiceSerializer(services, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def get_available_slots(request):
    """Get available time slots for a specific date"""
    date = request.GET.get('date')
    
    if not date:
        return Response(
            {'error': 'date parameter is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    slots = TimeSlot.objects.filter(date=date, is_available=True)
    serializer = TimeSlotSerializer(slots, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def create_booking(request):
    """Create a booking before payment"""
    try:
        serializer = CreateBookingSerializer(data=request.data)
        
        if serializer.is_valid():
            # Get service using the integer ID
            service_id = serializer.validated_data['service']
            service = Service.objects.get(id=service_id)
            
            # Check if time slot is available (double-check)
            date = serializer.validated_data['date']
            time_slot = serializer.validated_data['time_slot']
            
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
            
            # Create booking
            booking = Booking.objects.create(
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