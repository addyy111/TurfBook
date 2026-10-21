from rest_framework import serializers
from .models import Payment


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ('id', 'booking', 'razorpay_order_id', 'razorpay_payment_id', 'amount', 'payment_method', 'payment_status', 'created_at')
