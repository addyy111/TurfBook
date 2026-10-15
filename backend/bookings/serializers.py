from rest_framework import serializers
from datetime import datetime, timedelta, time
from django.db import transaction
from .models import Booking
from turfs.models import Turf
from accounts.serializers import UserProfileSerializer
from turfs.serializers import TurfListSerializer


class BookingSerializer(serializers.ModelSerializer):
    customer = UserProfileSerializer(read_only=True)
    turf = TurfListSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = (
            'id', 'customer', 'turf', 'booking_date', 'start_time', 'end_time',
            'duration_hours', 'base_price', 'platform_fee', 'total_price',
            'booking_status', 'cancellation_reason', 'created_at'
        )


class BookingCreateSerializer(serializers.Serializer):
    turf_id = serializers.IntegerField()
    booking_date = serializers.DateField()
    start_time = serializers.TimeField()
    duration_hours = serializers.DecimalField(max_digits=4, decimal_places=2, default=1.0)

    def validate(self, attrs):
        turf_id = attrs.get('turf_id')
        booking_date = attrs.get('booking_date')
        start_time = attrs.get('start_time')
        duration_hours = float(attrs.get('duration_hours', 1.0))

        try:
            turf = Turf.objects.get(id=turf_id)
        except Turf.DoesNotExist:
            raise serializers.ValidationError({"turf_id": "Turf does not exist."})

        # Calculate end_time
        start_dt = datetime.combine(booking_date, start_time)
        end_dt = start_dt + timedelta(hours=duration_hours)
        end_time = end_dt.time()

        # Check for overlapping active bookings (CRITICAL REQUIREMENT: PREVENT DOUBLE BOOKING)
        overlapping = Booking.objects.filter(
            turf=turf,
            booking_date=booking_date,
            booking_status__in=['confirmed', 'pending_payment']
        ).filter(
            start_time__lt=end_time,
            end_time__gt=start_time
        )

        if overlapping.exists():
            raise serializers.ValidationError({
                "slot": f"The selected time slot ({start_time.strftime('%H:%M')} - {end_time.strftime('%H:%M')}) is already booked! Please select another slot."
            })

        attrs['turf'] = turf
        attrs['end_time'] = end_time
        return attrs

    def create(self, validated_data):
        turf = validated_data['turf']
        booking_date = validated_data['booking_date']
        start_time = validated_data['start_time']
        end_time = validated_data['end_time']
        duration = float(validated_data['duration_hours'])
        user = self.context['request'].user

        # Determine price (weekend or base)
        is_weekend = booking_date.weekday() >= 5
        hourly_rate = float(turf.weekend_price_per_hour or turf.base_price_per_hour) if is_weekend else float(turf.base_price_per_hour)
        base_price = round(hourly_rate * duration, 2)
        platform_fee = 40.00
        total_price = base_price + platform_fee

        with transaction.atomic():
            # Concurrency check right inside the transaction
            conflict = Booking.objects.select_for_update().filter(
                turf=turf,
                booking_date=booking_date,
                booking_status__in=['confirmed', 'pending_payment'],
                start_time__lt=end_time,
                end_time__gt=start_time
            ).exists()

            if conflict:
                raise serializers.ValidationError({
                    "slot": "Another user has just booked this time slot. Please choose another slot."
                })

            booking = Booking.objects.create(
                customer=user,
                turf=turf,
                booking_date=booking_date,
                start_time=start_time,
                end_time=end_time,
                duration_hours=duration,
                base_price=base_price,
                platform_fee=platform_fee,
                total_price=total_price,
                booking_status='confirmed'  # Ready or confirmed upon creation/payment
            )
            return booking
