from django.db import models
from django.conf import settings
from turfs.models import Turf


class Booking(models.Model):
    STATUS_CHOICES = (
        ('pending_payment', 'Pending Payment'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
        ('failed', 'Payment Failed'),
        ('expired', 'Expired'),
    )

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    turf = models.ForeignKey(
        Turf,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    booking_date = models.DateField(db_index=True)
    start_time = models.TimeField()
    end_time = models.TimeField()
    duration_hours = models.DecimalField(max_digits=4, decimal_places=2, default=1.0)
    base_price = models.DecimalField(max_digits=8, decimal_places=2)
    platform_fee = models.DecimalField(max_digits=8, decimal_places=2, default=40.0)
    total_price = models.DecimalField(max_digits=8, decimal_places=2)
    
    booking_status = models.CharField(max_length=25, choices=STATUS_CHOICES, default='pending_payment')
    cancellation_reason = models.TextField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Booking #{self.id} - {self.turf.name} on {self.booking_date} ({self.start_time}-{self.end_time})"
