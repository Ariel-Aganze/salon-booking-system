from django.db import models

class Setting(models.Model):
    deposit_percentage = models.IntegerField(default=30, help_text="Deposit percentage required for bookings")
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Setting"
        verbose_name_plural = "Settings"
    
    def __str__(self):
        return f"Deposit: {self.deposit_percentage}%"