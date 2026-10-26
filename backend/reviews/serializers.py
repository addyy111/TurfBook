from rest_framework import serializers
from .models import Review
from accounts.serializers import UserProfileSerializer


class ReviewSerializer(serializers.ModelSerializer):
    customer = UserProfileSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ('id', 'customer', 'turf', 'booking', 'rating', 'comment', 'created_at')


class ReviewCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = ('turf', 'rating', 'comment')

    def create(self, validated_data):
        user = self.context['request'].user
        validated_data['customer'] = user
        return Review.objects.create(**validated_data)
