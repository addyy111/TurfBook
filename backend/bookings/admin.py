from django.contrib import admin
from .models import Booking


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = ('id', 'customer', 'turf', 'booking_date', 'start_time', 'end_time', 'total_price', 'booking_status', 'created_at')
    list_filter = ('booking_status', 'booking_date', 'turf__city')
    search_fields = ('customer__name', 'customer__email', 'turf__name')
    list_editable = ('booking_status',)
