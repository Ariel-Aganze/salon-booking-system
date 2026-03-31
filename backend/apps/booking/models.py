from django.db import models
import uuid

class Service(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.IntegerField(help_text="Duration in minutes")
    
    def __str__(self):
        return f"{self.name} - ${self.price}"
    
    class Meta:
        ordering = ['name']


class TimeSlot(models.Model):
    date = models.DateField()
    time = models.CharField(max_length=5)  # Format: "09:00"
    is_available = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['date', 'time']
        ordering = ['date', 'time']
    
    def __str__(self):
        return f"{self.date} {self.time} - {'Available' if self.is_available else 'Booked'}"


class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Payment'),
        ('partial', 'Deposit Paid'),
        ('paid', 'Fully Paid'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.AutoField(primary_key=True)
    reservation_code = models.CharField(max_length=50, unique=True, blank=True, null=True)
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    date = models.DateField()
    time_slot = models.CharField(max_length=5)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.reservation_code} - {self.full_name} - {self.status}"
    
    def remaining_balance(self):
        return self.total_price - self.amount_paid
    
    class Meta:
        ordering = ['-created_at']