from django.contrib import admin
from .models import Review


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'turf', 'customer', 'rating', 'created_at')
    list_filter = ('rating', 'created_at')
    search_fields = ('turf__name', 'customer__name', 'comment')
