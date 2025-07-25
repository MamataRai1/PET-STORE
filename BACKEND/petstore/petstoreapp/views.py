from django.http import HttpResponse
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken

from .models import (
    PhoneNumber, Address, Category, Brand, Product, ProductCategory,
    ProductImage, ProductAttribute, Variant, Cart, CartItem, Order,
    OrderItem, Payment, Review, BannerImage
)
from .serializers import (
    PhoneNumberSerializer, AddressSerializer, CategorySerializer,
    BrandSerializer, ProductCategorySerializer, ProductImageSerializer,
    ProductAttributeSerializer, VariantSerializer, CartSerializer,
    CartItemSerializer, OrderSerializer, OrderItemSerializer,
    PaymentSerializer, ReviewSerializer, UserSerializer,
    BannerImageSerializer, ProductSerializer
)

User = get_user_model()


# ---------- Welcome ---------- #
def index(request):
    return HttpResponse("Welcome to the Pet Store API.")


# ---------- Signup View ---------- #
class SignUpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        data = request.data
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        phone = data.get("phone")
        address = data.get("address")
        is_customer = data.get("is_customer", True)
        is_seller = data.get("is_seller", False)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already taken"}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        
        # Optional: Auto-create UserProfile (if not handled by signal)
        profile = getattr(user, "userprofile", None)
        if profile:
            profile.phone = phone
            profile.address = address
            profile.is_customer = is_customer
            profile.is_seller = is_seller
            profile.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            "user": {
                "username": user.username,
                "email": user.email,
                "phone": profile.phone if profile else "",
                "address": profile.address if profile else "",
                "is_customer": profile.is_customer if profile else False,
                "is_seller": profile.is_seller if profile else False,
            },
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        }, status=status.HTTP_201_CREATED)


# ---------- User Profile View ---------- #
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        profile = user.userprofile
        data = {
            "username": user.username,
            "email": user.email,
            "phone": profile.phone,
            "address": profile.address,
            "is_customer": profile.is_customer,
            "is_seller": profile.is_seller
        }
        return Response(data)


# ---------- Generic ViewSets ---------- #
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class PhoneNumberViewSet(viewsets.ModelViewSet):
    queryset = PhoneNumber.objects.all()
    serializer_class = PhoneNumberSerializer

class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer

class ProductCategoryViewSet(viewsets.ModelViewSet):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer

class ProductImageViewSet(viewsets.ModelViewSet):
    queryset = ProductImage.objects.all()
    serializer_class = ProductImageSerializer

class ProductAttributeViewSet(viewsets.ModelViewSet):
    queryset = ProductAttribute.objects.all()
    serializer_class = ProductAttributeSerializer

class VariantViewSet(viewsets.ModelViewSet):
    queryset = Variant.objects.all()
    serializer_class = VariantSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_serializer_context(self):
        return {'request': self.request}

class CartViewSet(viewsets.ModelViewSet):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer

class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer


# ---------- Banner View ---------- #
class BannerImageView(APIView):
    def get(self, request):
        banner = BannerImage.objects.first()
        serializer = BannerImageSerializer(banner, context={'request': request})
        return Response(serializer.data)
