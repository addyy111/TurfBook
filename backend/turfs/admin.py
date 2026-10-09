from django.contrib import admin
from .models import Sport, Amenity, Turf, TurfImage, AvailabilitySlot, Wishlist


class TurfImageInline(admin.TabularInline):
    model = TurfImage
    extra = 1


@admin.register(Sport)
class SportAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'icon')
    search_fields = ('name',)


@admin.register(Amenity)
class AmenityAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'icon')
    search_fields = ('name',)


@admin.register(Turf)
class TurfAdmin(admin.ModelAdmin):
    list_display = ('name', 'city', 'area', 'owner', 'base_price_per_hour', 'turf_type', 'approval_status', 'created_at')
    list_filter = ('city', 'turf_type', 'approval_status', 'sports', 'amenities')
    search_fields = ('name', 'city', 'area', 'address', 'owner__email', 'owner__name')
    list_editable = ('approval_status',)
    inlines = [TurfImageInline]


@admin.register(TurfImage)
class TurfImageAdmin(admin.ModelAdmin):
    list_display = ('turf', 'caption', 'is_cover', 'created_at')
    list_filter = ('is_cover',)


@admin.register(AvailabilitySlot)
class AvailabilitySlotAdmin(admin.ModelAdmin):
    list_display = ('turf', 'date', 'start_time', 'end_time', 'price', 'is_blocked')
    list_filter = ('date', 'is_blocked', 'turf')


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ('user', 'turf', 'created_at')
