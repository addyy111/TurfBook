from django.urls import path
from .views import (
    SportListView,
    AmenityListView,
    TurfListView,
    TurfDetailView,
    TurfAvailabilityView,
    OwnerTurfListCreateView,
    OwnerTurfDetailView,
    WishlistToggleView,
    WishlistListView
)

urlpatterns = [
    path('', TurfListView.as_view(), name='turf-list'),
    path('sports/', SportListView.as_view(), name='sports-list'),
    path('amenities/', AmenityListView.as_view(), name='amenities-list'),
    path('<int:pk>/', TurfDetailView.as_view(), name='turf-detail'),
    path('<int:turf_id>/availability/', TurfAvailabilityView.as_view(), name='turf-availability'),
    path('<int:turf_id>/wishlist/', WishlistToggleView.as_view(), name='wishlist-toggle'),
    path('wishlist/', WishlistListView.as_view(), name='wishlist-list'),

    # Owner specific routes
    path('owner/my-turfs/', OwnerTurfListCreateView.as_view(), name='owner-turf-list-create'),
    path('owner/my-turfs/<int:pk>/', OwnerTurfDetailView.as_view(), name='owner-turf-detail'),
]
