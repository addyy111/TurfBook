from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from turfs.models import Turf
from bookings.models import Booking


class Review(models.Model):
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    turf = models.ForeignKey(
        Turf,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    booking = models.ForeignKey(
        Booking,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='review'
    )
    rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.customer.name}'s review on {self.turf.name} ({self.rating}★)"
