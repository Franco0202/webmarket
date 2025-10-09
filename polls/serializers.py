from rest_framework import serializers
from .models import Products, product_images

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.ImageField()  # ensures full URL is returned

    class Meta:
        model = product_images
        fields = ['id', 'image']


class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(source='product_images_set', many=True, read_only=True)

    class Meta:
        model = Products
        fields = ['id', 'name', 'price', 'stock', 'products_text', 'pub_date', 'images']