from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.conf import settings
from django.shortcuts import get_object_or_404
from apps.booking.models import Booking
from services.payment_service import create_checkout_session, create_remaining_payment_session
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes


@api_view(['POST'])
@permission_classes([AllowAny])
def create_deposit_session(request):
    """Create Stripe checkout session for deposit"""
    booking_id = request.data.get('booking_id')
    
    if not booking_id:
        return Response(
            {'error': 'booking_id is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    booking = get_object_or_404(Booking, id=booking_id)
    
    # Success and cancel URLs (update with your frontend URLs)
    success_url = request.data.get('success_url', 'http://localhost:3000/payment/success')
    cancel_url = request.data.get('cancel_url', 'http://localhost:3000/payment/cancel')
    
    try:
        session = create_checkout_session(booking_id, success_url, cancel_url)
        return Response({
            'session_id': session.id,
            'checkout_url': session.url
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['POST'])
@permission_classes([AllowAny])
def create_remaining_session(request):
    """Create Stripe checkout session for remaining balance"""
    reservation_code = request.data.get('reservation_code')
    
    if not reservation_code:
        return Response(
            {'error': 'reservation_code is required'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    booking = get_object_or_404(Booking, reservation_code=reservation_code)
    
    # Check if payment is already completed
    if booking.status == 'paid':
        return Response(
            {'error': 'Booking is already fully paid'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    success_url = request.data.get('success_url', 'http://localhost:3000/payment/success')
    cancel_url = request.data.get('cancel_url', 'http://localhost:3000/payment/cancel')
    
    try:
        session = create_remaining_payment_session(reservation_code, success_url, cancel_url)
        return Response({
            'session_id': session.id,
            'checkout_url': session.url
        })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )