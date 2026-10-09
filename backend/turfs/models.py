from django.db import models
from django.conf import settings


class Sport(models.Model):
    name = models.CharField(max_length=100, unique=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Lucide icon name or emoji")

    def __str__(self):
        return self.name


class Amenity(models.Model):
    name = models.CharField(max_length=100, unique=True)
    icon = models.CharField(max_length=50, blank=True, help_text="Lucide icon name")

    class Meta:
        verbose_name_plural = "Amenities"

    def __str__(self):
        return self.name


class Turf(models.Model):
    APPROVAL_CHOICES = (
        ('pending', 'Pending Approval'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    )

    TURF_TYPE_CHOICES = (
        ('outdoor', 'Outdoor'),
        ('indoor', 'Indoor'),
        ('both', 'Both Indoor & Outdoor'),
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='owned_turfs'
    )
    name = models.CharField(max_length=200)
    description = models.TextField()
    city = models.CharField(max_length=100, db_index=True)
    area = models.CharField(max_length=100, db_index=True)
    address = models.TextField()
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    contact_phone = models.CharField(max_length=20)
    contact_email = models.EmailField(blank=True, null=True)

    sports = models.ManyToManyField(Sport, related_name='turfs')
    turf_type = models.CharField(max_length=20, choices=TURF_TYPE_CHOICES, default='outdoor')
    amenities = models.ManyToManyField(Amenity, related_name='turfs', blank=True)

    cover_image = models.ImageField(upload_to='turfs/covers/', blank=True, null=True)
    cover_image_url = models.URLField(max_length=500, blank=True, null=True, help_text="Direct image URL if external")

    base_price_per_hour = models.DecimalField(max_digits=8, decimal_places=2)
    weekend_price_per_hour = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    peak_price_per_hour = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)

    opening_time = models.TimeField(default='06:00')
    closing_time = models.TimeField(default='23:00')
    slot_duration_mins = models.IntegerField(default=60)

    venue_rules = models.TextField(blank=True, default="1. Proper sports footwear required.\n2. Arrive 15 minutes before your slot.\n3. No smoking or alcohol allowed on premises.")
    cancellation_policy = models.TextField(blank=True, default="Free cancellation up to 4 hours before the booked slot. 50% refund thereafter.")
    approval_status = models.CharField(max_length=20, choices=APPROVAL_CHOICES, default='approved')

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.city}"

    @property
    def average_rating(self):
        reviews = self.reviews.all()
        if reviews.exists():
            return round(sum(r.rating for r in reviews) / reviews.count(), 1)
        return 4.5  # default baseline if new

    @property
    def total_reviews(self):
        return self.reviews.count()


class TurfImage(models.Model):
    turf = models.ForeignKey(Turf, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='turfs/gallery/', blank=True, null=True)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    caption = models.CharField(max_length=200, blank=True)
    is_cover = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Image for {self.turf.name}"


class AvailabilitySlot(models.Model):
    turf = models.ForeignKey(Turf, on_delete=models.CASCADE, related_name='availability_slots')
    date = models.DateField(db_index=True)
    start_time = models.TimeField()
    end_time = models.TimeField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    is_blocked = models.BooleanField(default=False)
    block_reason = models.CharField(max_length=200, blank=True)

    class Meta:
        unique_together = ('turf', 'date', 'start_time')

    def __str__(self):
        return f"{self.turf.name} | {self.date} {self.start_time}-{self.end_time}"


class Wishlist(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='wishlist')
    turf = models.ForeignKey(Turf, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'turf')

    def __str__(self):
        return f"{self.user.name} - {self.turf.name}"
