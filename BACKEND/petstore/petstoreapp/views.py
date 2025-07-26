from django.http import HttpResponse
from django.contrib.auth import get_user_model
from django.contrib.auth.models import User
from rest_framework import status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Sum, Count
from rest_framework.decorators import api_view

from .models import (
    PhoneNumber, Address, Category, Brand, Product, ProductCategory,
    ProductImage, ProductAttribute, Variant, Cart, CartItem, Order,
    OrderItem, Payment, Review, BannerImage,User
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

@api_view(['GET'])
def admin_dashboard(request):
    total_products = Product.objects.count()
    total_sales = Order.objects.aggregate(total=Sum('total_amount'))['total'] or 0
    total_customers = User.objects.filter(order__isnull=False).distinct().count()

    # Recent 5 orders ordered by placed_at
    recent_orders = Order.objects.select_related('user').order_by('-placed_at')[:5]
    orders_data = [
        {
            "id": order.id,
            "customer_name": order.user.username if order.user else "Unknown",
            "total": order.total_amount,
            "status": order.status,
        }
        for order in recent_orders
    ]

    # Top 5 products by total sold count (through variants -> orderitems)
    top_products = Product.objects.annotate(
        sold_count=Count('variants__orderitem')
    ).order_by('-sold_count')[:5]

    top_products_data = []
    for p in top_products:
        total_revenue = OrderItem.objects.filter(
            variant__product=p
        ).aggregate(rev=Sum('unit_price'))['rev'] or 0

        top_products_data.append({
            "id": p.id,
            "name": p.name,
            "category": p.categories.first().name if p.categories.exists() else '',
            "image": p.main_image.url if p.main_image else None,
            "sold_count": p.sold_count,
            "total_revenue": total_revenue,
        })

    return Response({
        "total_products": total_products,
        "total_sales": total_sales,
        "total_customers": total_customers,
        "analytics_score": 87,  # You can replace with real calculation
        "recent_orders": orders_data,
        "top_products": top_products_data,
    })

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
