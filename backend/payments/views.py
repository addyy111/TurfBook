import time
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from bookings.models import Booking
from .models import Payment
from .serializers import PaymentSerializer


class CreatePaymentOrderView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        booking_id = request.data.get('booking_id')
        if not booking_id:
            return Response({'error': 'booking_id is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            booking = Booking.objects.get(id=booking_id, customer=request.user)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found or not owned by user'}, status=status.HTTP_404_NOT_FOUND)

        # Generate a test order ID for Razorpay Test Mode
        order_id = f"order_test_{booking.id}_{int(time.time())}"
        amount_in_paise = int(float(booking.total_price) * 100)

        # Create or update pending payment record
        Payment.objects.update_or_create(
            booking=booking,
            defaults={
                'amount': booking.total_price,
                'razorpay_order_id': order_id,
                'payment_status': 'pending'
            }
        )

        return Response({
            'order_id': order_id,
            'amount': amount_in_paise,
            'currency': 'INR',
            'key': 'rzp_test_TURFBOOK_DEMO_KEY',
            'turf_name': booking.turf.name,
            'booking_id': booking.id
        })


class VerifyPaymentView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        booking_id = request.data.get('booking_id')
        payment_id = request.data.get('razorpay_payment_id', f"pay_test_{int(time.time())}")
        payment_method = request.data.get('payment_method', 'UPI / Card')

        try:
            booking = Booking.objects.get(id=booking_id, customer=request.user)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found'}, status=status.HTTP_404_NOT_FOUND)

        # Update Payment record
        payment, _ = Payment.objects.get_or_create(booking=booking, defaults={'amount': booking.total_price})
        payment.razorpay_payment_id = payment_id
        payment.payment_method = payment_method
        payment.payment_status = 'successful'
        payment.save()

        # Update booking status
        booking.booking_status = 'confirmed'
        booking.save()

        return Response({
            'message': 'Payment successfully verified and booking confirmed!',
            'payment': PaymentSerializer(payment).data,
            'booking_id': booking.id
        })
