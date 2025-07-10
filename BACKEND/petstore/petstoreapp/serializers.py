from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import (
    PhoneNumber, Address, Category, Brand, Product, ProductCategory,
    ProductImage, ProductAttribute, Variant, Cart, CartItem,
    Order, OrderItem, Payment, Review
)

User = get_user_model()

# ---------- USER SERIALIZERS ---------- #
# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email', 'password', 'is_customer', 'is_seller', 'phone', 'address']
#         extra_kwargs = {
#             'password': {'write_only': True}
#         }

#     def create(self, validated_data):
#         user = User(
#             username=validated_data['username'],
#             email=validated_data.get('email'),
#             phone=validated_data.get('phone'),
#             address=validated_data.get('address'),
#             is_customer=validated_data.get('is_customer', False),
#             is_seller=validated_data.get('is_seller', False),
#         )
#         user.set_password(validated_data['password'])
#         user.save()
#         return user
class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password', 'is_customer', 'is_seller', 'phone', 'address']

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)  # <- hashes the password correctly
        user.save()
        return user




class PhoneNumberSerializer(serializers.ModelSerializer):
    class Meta:
        model = PhoneNumber
        fields = ['id', 'number', 'users']


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'


# ---------- PRODUCT INFO SERIALIZERS ---------- #
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'parent', 'description']


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ['id', 'name']  # Removed 'description' since it’s not in the model


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ['id', 'product', 'category']


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ['id', 'product', 'image_url', 'alt_text', 'sort_order']


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

    class Meta:
        model = Product
        fields = [
            'id', 'sku', 'name', 'main_image', 'description',
            'brand', 'categories', 'created_at', 'updated_at', 'is_active',
            'images', 'attributes', 'variants'
        ]


# ---------- CART & ORDER SERIALIZERS ---------- #
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


# ---------- PAYMENT SERIALIZER ---------- #
class PaymentSerializer(serializers.ModelSerializer):
    method_display = serializers.CharField(source='get_method_display', read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'order', 'method', 'method_display', 'status', 'transaction_id', 'paid_at']
        read_only_fields = ['paid_at', 'method_display']


# ---------- REVIEW SERIALIZER ---------- #
class ReviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'product', 'user', 'rating', 'title', 'comment', 'created_at']
        read_only_fields = ['created_at', 'user', 'product']
