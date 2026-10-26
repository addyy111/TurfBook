from django.urls import path
from .views import TurfReviewsListView, CreateReviewView

urlpatterns = [
    path('turf/<int:turf_id>/', TurfReviewsListView.as_view(), name='turf-reviews'),
    path('create/', CreateReviewView.as_view(), name='create-review'),
]
