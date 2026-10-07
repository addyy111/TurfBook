from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomLoginView, RegisterView, UserProfileView

urlpatterns = [
    path('login/', CustomLoginView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='profile'),
]
