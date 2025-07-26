from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    PhoneNumber, Address, Category, Brand, Product, ProductCategory,
    ProductImage, ProductAttribute, Variant, Cart, CartItem,
    Order, OrderItem, Payment, Review, BannerImage
)

User = get_user_model()

# ---------- USER SERIALIZER ---------- #
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_customer', 'is_seller', 'phone', 'address']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


# ---------- PHONE & ADDRESS ---------- #
class PhoneNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhoneNumber
        fields = ['id', 'number', 'users']


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'


# ---------- CATEGORY & BRAND ---------- #
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'parent', 'description']


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name']


# ---------- PRODUCT RELATED ---------- #
class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ['id', 'product', 'category']


class ProductImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ['id', 'product', 'image_url', 'alt_text', 'sort_order']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image_url and hasattr(obj.image_url, 'url'):
            return request.build_absolute_uri(obj.image_url.url)
        return None


class ProductAttributeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductAttribute
        fields = ['id', 'product', 'name', 'value']


class VariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Variant
        fields = ['id', 'product', 'label', 'price', 'stock_quantity', 'weight_kg']


class ProductSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(read_only=True)
    images = ProductImageSerializer(many=True, read_only=True)
    attributes = ProductAttributeSerializer(many=True, read_only=True)
    variants = VariantSerializer(many=True, read_only=True)
    main_image_url = serializers.SerializerMethodField()
    stock = serializers.IntegerField( )

    class Meta:
        model = Product
        fields = [
            'id', 'sku', 'name', 'main_image', 'main_image_url', 'description',
            'brand', 'categories', 'price', 'stock', 'created_at', 'updated_at', 'is_active',
            'images', 'attributes', 'variants'
        ]

    def get_main_image_url(self, obj):
        request = self.context.get('request')
        if obj.main_image and hasattr(obj.main_image, 'url'):
            return request.build_absolute_uri(obj.main_image.url)
        elif obj.images.exists():
            first_image = obj.images.first()
            if first_image.image_url and hasattr(first_image.image_url, 'url'):
                return request.build_absolute_uri(first_image.image_url.url)
        return None


# ---------- CART & ORDER ---------- #
class CartItemSerializer(serializers.ModelSerializer):
    variant = VariantSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'variant', 'quantity']


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = ['id', 'user', 'created_at', 'updated_at', 'is_active', 'items']


class OrderItemSerializer(serializers.ModelSerializer):
    variant = VariantSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'order', 'variant', 'quantity', 'unit_price']


class OrderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    shipping_addr = AddressSerializer(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'status', 'placed_at', 'shipping_addr', 'total_amount', 'items']


# ---------- PAYMENT ---------- #
class PaymentSerializer(serializers.ModelSerializer):
    method_display = serializers.CharField(source='get_method_display', read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'order', 'method', 'method_display', 'status', 'transaction_id', 'paid_at']
        read_only_fields = ['paid_at', 'method_display']


# ---------- REVIEW ---------- #
class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'product', 'user', 'rating', 'title', 'comment', 'created_at']
        read_only_fields = ['created_at', 'user', 'product']


# ---------- BANNER IMAGE ---------- #
class BannerImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = BannerImage
        fields = ['id', 'image_url', 'alt_text']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None
