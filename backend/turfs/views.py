from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Q
from datetime import date, time, timedelta
from .models import Sport, Amenity, Turf, TurfImage, AvailabilitySlot, Wishlist
from .serializers import (
    SportSerializer,
    AmenitySerializer,
    TurfListSerializer,
    TurfDetailSerializer,
    TurfCreateUpdateSerializer,
    AvailabilitySlotSerializer
)


class SportListView(generics.ListAPIView):
    queryset = Sport.objects.all()
    serializer_class = SportSerializer
    permission_classes = (permissions.AllowAny,)


class AmenityListView(generics.ListAPIView):
    queryset = Amenity.objects.all()
    serializer_class = AmenitySerializer
    permission_classes = (permissions.AllowAny,)


class TurfListView(generics.ListAPIView):
    serializer_class = TurfListSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        queryset = Turf.objects.filter(approval_status='approved')

        # Filter: City (Case-insensitive)
        city = self.request.query_params.get('city')
        if city and city.lower() != 'all':
            queryset = queryset.filter(city__iexact=city)

        # Filter: Area
        area = self.request.query_params.get('area')
        if area:
            queryset = queryset.filter(area__icontains=area)

        # Filter: Search query
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(name__icontains=search) |
                Q(area__icontains=search) |
                Q(city__icontains=search) |
                Q(address__icontains=search)
            )

        # Filter: Sport
        sport = self.request.query_params.get('sport')
        if sport and sport.lower() != 'all':
            queryset = queryset.filter(sports__name__iexact=sport)

        # Filter: Min Price & Max Price
        min_price = self.request.query_params.get('min_price')
        if min_price:
            try:
                queryset = queryset.filter(base_price_per_hour__gte=float(min_price))
            except ValueError:
                pass

        max_price = self.request.query_params.get('max_price')
        if max_price:
            try:
                queryset = queryset.filter(base_price_per_hour__lte=float(max_price))
            except ValueError:
                pass

        # Filter: Turf Type (indoor / outdoor / both)
        turf_type = self.request.query_params.get('turf_type')
        if turf_type and turf_type.lower() != 'all':
            queryset = queryset.filter(turf_type=turf_type)

        # Filter: Amenity
        amenity = self.request.query_params.get('amenity')
        if amenity:
            queryset = queryset.filter(amenities__name__iexact=amenity)

        # Ordering
        ordering = self.request.query_params.get('ordering', 'featured')
        if ordering == 'price_low':
            queryset = queryset.order_by('base_price_per_hour')
        elif ordering == 'price_high':
            queryset = queryset.order_by('-base_price_per_hour')
        elif ordering == 'newest':
            queryset = queryset.order_by('-created_at')

        return queryset.distinct()


class TurfDetailView(generics.RetrieveAPIView):
    queryset = Turf.objects.all()
    serializer_class = TurfDetailSerializer
    permission_classes = (permissions.AllowAny,)


class TurfAvailabilityView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request, turf_id):
        try:
            turf = Turf.objects.get(id=turf_id)
        except Turf.DoesNotExist:
            return Response({'error': 'Turf not found'}, status=status.HTTP_404_NOT_FOUND)

        date_str = request.query_params.get('date')
        if not date_str:
            target_date = date.today()
        else:
            try:
                target_date = date.fromisoformat(date_str)
            except ValueError:
                return Response({'error': 'Invalid date format. Use YYYY-MM-DD'}, status=status.HTTP_400_BAD_REQUEST)

        # Check if slots exist for this date. If none exist, auto-generate standard hourly slots.
        if not AvailabilitySlot.objects.filter(turf=turf, date=target_date).exists():
            start_hour = turf.opening_time.hour if hasattr(turf.opening_time, 'hour') else 6
            end_hour = turf.closing_time.hour if hasattr(turf.closing_time, 'hour') else 23
            is_weekend = target_date.weekday() >= 5
            price = turf.weekend_price_per_hour if is_weekend and turf.weekend_price_per_hour else turf.base_price_per_hour

            new_slots = []
            for h in range(start_hour, end_hour):
                new_slots.append(AvailabilitySlot(
                    turf=turf,
                    date=target_date,
                    start_time=time(hour=h, minute=0),
                    end_time=time(hour=h + 1, minute=0),
                    price=price,
                    is_blocked=False
                ))
            if new_slots:
                AvailabilitySlot.objects.bulk_create(new_slots)

        slots = AvailabilitySlot.objects.filter(turf=turf, date=target_date).order_by('start_time')
        serializer = AvailabilitySlotSerializer(slots, many=True)
        return Response({
            'turf_id': turf.id,
            'date': str(target_date),
            'slots': serializer.data
        })


class OwnerTurfListCreateView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return TurfCreateUpdateSerializer
        return TurfListSerializer

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'role', '') == 'admin' or user.is_superuser:
            return Turf.objects.all().order_by('-created_at')
        return Turf.objects.filter(owner=user).order_by('-created_at')


class OwnerTurfDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TurfCreateUpdateSerializer

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'role', '') == 'admin' or user.is_superuser:
            return Turf.objects.all().order_by('-created_at')
        return Turf.objects.filter(owner=user).order_by('-created_at')


class WishlistToggleView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, turf_id):
        try:
            turf = Turf.objects.get(id=turf_id)
        except Turf.DoesNotExist:
            return Response({'error': 'Turf not found'}, status=status.HTTP_404_NOT_FOUND)

        wishlist_item, created = Wishlist.objects.get_or_create(user=request.user, turf=turf)
        if not created:
            wishlist_item.delete()
            return Response({'favorited': False, 'message': 'Removed from wishlist'})
        return Response({'favorited': True, 'message': 'Added to wishlist'})


class WishlistListView(generics.ListAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = TurfListSerializer

    def get_queryset(self):
        turf_ids = Wishlist.objects.filter(user=self.request.user).values_list('turf_id', flat=True)
        return Turf.objects.filter(id__in=turf_ids)
