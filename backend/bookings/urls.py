from django.urls import path
from .views import (
    CreateBookingView,
    CustomerBookingsView,
    OwnerBookingsView,
    CancelBookingView
)

urlpatterns = [
    path('create/', CreateBookingView.as_view(), name='booking-create'),
    path('my-bookings/', CustomerBookingsView.as_view(), name='customer-bookings'),
    path('owner-bookings/', OwnerBookingsView.as_view(), name='owner-bookings'),
    path('<int:pk>/cancel/', CancelBookingView.as_view(), name='booking-cancel'),
]
