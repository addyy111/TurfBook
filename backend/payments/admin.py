from django.contrib import admin
from .models import Payment


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'booking', 'amount', 'payment_method', 'payment_status', 'razorpay_payment_id', 'created_at')
    list_filter = ('payment_status', 'payment_method')
    search_fields = ('booking__id', 'razorpay_order_id', 'razorpay_payment_id')
