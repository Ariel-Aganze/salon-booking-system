from rest_framework import serializers
from .models import Service, TimeSlot, Booking

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'price', 'duration']


class TimeSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = TimeSlot
        fields = ['id', 'date', 'time', 'is_available']


class BookingSerializer(serializers.ModelSerializer):
    service_name = serializers.ReadOnlyField(source='service.name')
    remaining_balance = serializers.ReadOnlyField()
    
    class Meta:
        model = Booking
        fields = [
            'id', 'reservation_code', 'full_name', 'email', 'phone',
            'service', 'service_name', 'date', 'time_slot', 
            'total_price', 'amount_paid', 'remaining_balance', 
            'status', 'created_at'
        ]
        read_only_fields = ['reservation_code', 'amount_paid', 'status', 'created_at']


class CreateBookingSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=200)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20)
    service = serializers.IntegerField()  # Changed to IntegerField
    date = serializers.DateField()
    time_slot = serializers.CharField(max_length=5)
    
    def validate(self, data):
        """Check if time slot is available"""
        from .models import TimeSlot
        
        date = data['date']
        time_slot = data['time_slot']
        
        try:
            slot = TimeSlot.objects.get(date=date, time=time_slot)
            if not slot.is_available:
                raise serializers.ValidationError("This time slot is already booked")
        except TimeSlot.DoesNotExist:
            # If slot doesn't exist, it might be outside working hours
            raise serializers.ValidationError("This time slot is not available")
        
        return data