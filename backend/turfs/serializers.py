from rest_framework import serializers
from .models import Sport, Amenity, Turf, TurfImage, AvailabilitySlot, Wishlist
from accounts.serializers import UserProfileSerializer


class SportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sport
        fields = ('id', 'name', 'icon')


class AmenitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Amenity
        fields = ('id', 'name', 'icon')


class TurfImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = TurfImage
        fields = ('id', 'image', 'image_url', 'caption', 'is_cover')


class AvailabilitySlotSerializer(serializers.ModelSerializer):
    is_available = serializers.SerializerMethodField()

    class Meta:
        model = AvailabilitySlot
        fields = ('id', 'turf', 'date', 'start_time', 'end_time', 'price', 'is_blocked', 'block_reason', 'is_available')

    def get_is_available(self, obj):
        # A slot is available if it is not blocked and not already booked in a confirmed/pending state
        if obj.is_blocked:
            return False
        # Check against active bookings overlapping this slot
        from bookings.models import Booking
        has_active_booking = Booking.objects.filter(
            turf=obj.turf,
            booking_date=obj.date,
            booking_status__in=['confirmed', 'pending_payment']
        ).filter(
            start_time__lt=obj.end_time,
            end_time__gt=obj.start_time
        ).exists()
        return not has_active_booking


class TurfListSerializer(serializers.ModelSerializer):
    sports = SportSerializer(many=True, read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    total_reviews = serializers.IntegerField(read_only=True)
    is_favorited = serializers.SerializerMethodField()

    class Meta:
        model = Turf
        fields = (
            'id', 'name', 'city', 'area', 'address', 'latitude', 'longitude',
            'sports', 'turf_type', 'amenities', 'cover_image', 'cover_image_url',
            'base_price_per_hour', 'weekend_price_per_hour', 'peak_price_per_hour',
            'opening_time', 'closing_time', 'slot_duration_mins',
            'average_rating', 'total_reviews', 'is_favorited', 'approval_status'
        )

    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Wishlist.objects.filter(user=request.user, turf=obj).exists()
        return False


class TurfDetailSerializer(serializers.ModelSerializer):
    sports = SportSerializer(many=True, read_only=True)
    amenities = AmenitySerializer(many=True, read_only=True)
    images = TurfImageSerializer(many=True, read_only=True)
    owner = UserProfileSerializer(read_only=True)
    average_rating = serializers.FloatField(read_only=True)
    total_reviews = serializers.IntegerField(read_only=True)
    is_favorited = serializers.SerializerMethodField()

    class Meta:
        model = Turf
        fields = (
            'id', 'owner', 'name', 'description', 'city', 'area', 'address',
            'latitude', 'longitude', 'contact_phone', 'contact_email',
            'sports', 'turf_type', 'amenities', 'images', 'cover_image', 'cover_image_url',
            'base_price_per_hour', 'weekend_price_per_hour', 'peak_price_per_hour',
            'opening_time', 'closing_time', 'slot_duration_mins',
            'venue_rules', 'cancellation_policy', 'approval_status',
            'average_rating', 'total_reviews', 'is_favorited', 'created_at'
        )

    def get_is_favorited(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Wishlist.objects.filter(user=request.user, turf=obj).exists()
        return False


class TurfCreateUpdateSerializer(serializers.ModelSerializer):
    sports_ids = serializers.PrimaryKeyRelatedField(
        queryset=Sport.objects.all(), source='sports', many=True, write_only=True
    )
    amenities_ids = serializers.PrimaryKeyRelatedField(
        queryset=Amenity.objects.all(), source='amenities', many=True, write_only=True, required=False
    )

    class Meta:
        model = Turf
        fields = (
            'id', 'name', 'description', 'city', 'area', 'address',
            'latitude', 'longitude', 'contact_phone', 'contact_email',
            'sports_ids', 'turf_type', 'amenities_ids', 'cover_image', 'cover_image_url',
            'base_price_per_hour', 'weekend_price_per_hour', 'peak_price_per_hour',
            'opening_time', 'closing_time', 'slot_duration_mins',
            'venue_rules', 'cancellation_policy'
        )

    def create(self, validated_data):
        sports = validated_data.pop('sports', [])
        amenities = validated_data.pop('amenities', [])
        request = self.context.get('request')
        validated_data['owner'] = request.user
        validated_data['approval_status'] = 'approved'  # Auto approve for development/testing ease
        turf = Turf.objects.create(**validated_data)
        turf.sports.set(sports)
        turf.amenities.set(amenities)

        # Pre-generate availability slots for the next 7 days
        from datetime import date, time, timedelta
        today = date.today()
        start_hour = turf.opening_time.hour if hasattr(turf.opening_time, 'hour') else 6
        end_hour = turf.closing_time.hour if hasattr(turf.closing_time, 'hour') else 23
        initial_slots = []
        for offset in range(7):
            d = today + timedelta(days=offset)
            is_weekend = d.weekday() >= 5
            price = turf.weekend_price_per_hour if is_weekend and turf.weekend_price_per_hour else turf.base_price_per_hour
            for h in range(start_hour, end_hour):
                initial_slots.append(AvailabilitySlot(
                    turf=turf,
                    date=d,
                    start_time=time(hour=h, minute=0),
                    end_time=time(hour=h + 1, minute=0),
                    price=price,
                    is_blocked=False
                ))
        if initial_slots:
            AvailabilitySlot.objects.bulk_create(initial_slots)

        return turf
