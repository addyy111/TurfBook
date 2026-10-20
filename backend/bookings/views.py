from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Booking
from .serializers import BookingSerializer, BookingCreateSerializer


class CreateBookingView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = BookingCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        return Response(BookingSerializer(booking).data, status=status.HTTP_201_CREATED)


class CustomerBookingsView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = BookingSerializer

    def get_queryset(self):
        return Booking.objects.filter(customer=self.request.user).order_by('-created_at')


class OwnerBookingsView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = BookingSerializer

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'role', '') == 'admin' or user.is_superuser:
            return Booking.objects.all().order_by('-created_at')
        return Booking.objects.filter(turf__owner=user).order_by('-created_at')


class CancelBookingView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, pk):
        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response({'error': 'Booking not found.'}, status=status.HTTP_404_NOT_FOUND)

        if booking.customer != request.user and booking.turf.owner != request.user:
            return Response({'error': 'Unauthorized to cancel this booking.'}, status=status.HTTP_403_FORBIDDEN)

        if booking.booking_status == 'cancelled':
            return Response({'message': 'Booking is already cancelled.'}, status=status.HTTP_400_BAD_REQUEST)

        reason = request.data.get('reason', 'Cancelled by user')
        booking.booking_status = 'cancelled'
        booking.cancellation_reason = reason
        booking.save()

        return Response({
            'message': 'Booking cancelled successfully. Slot has been freed.',
            'booking': BookingSerializer(booking).data
        })
