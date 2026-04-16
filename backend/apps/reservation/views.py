from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from apps.booking.models import Booking
from apps.booking.serializers import BookingSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser

@api_view(['POST'])
@permission_classes([AllowAny])
def find_reservation(request):
    """Find a booking by reservation code and email"""
    reservation_code = request.data.get('reservation_code')
    email = request.data.get('email')
    
    if not reservation_code or not email:
        return Response(
            {'error': 'reservation_code and email are required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    try:
        booking = Booking.objects.get(
            reservation_code=reservation_code,
            email=email
        )
        serializer = BookingSerializer(booking)
        return Response(serializer.data)
    except Booking.DoesNotExist:
        return Response(
            {'error': 'No booking found with this code and email'},
            status=status.HTTP_404_NOT_FOUND
        )


@api_view(['GET'])
@permission_classes([AllowAny])
def get_reservation_details(request, code):
    """Get reservation details by code (without email for admin view)"""
    try:
        booking = Booking.objects.get(reservation_code=code)
        serializer = BookingSerializer(booking)
        return Response(serializer.data)
    except Booking.DoesNotExist:
        return Response(
            {'error': 'Reservation not found'},
            status=status.HTTP_404_NOT_FOUND
        )