from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Review
from .serializers import ReviewSerializer, ReviewCreateSerializer


class TurfReviewsListView(generics.ListAPIView):
    serializer_class = ReviewSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        turf_id = self.kwargs.get('turf_id')
        return Review.objects.filter(turf_id=turf_id).order_by('-created_at')


class CreateReviewView(generics.CreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = ReviewCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        review = serializer.save(customer=request.user)
        return Response(ReviewSerializer(review).data, status=status.HTTP_201_CREATED)
