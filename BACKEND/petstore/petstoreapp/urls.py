from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    index, PhoneNumberViewSet, AddressViewSet, CategoryViewSet,
    BrandViewSet, ProductCategoryViewSet, ProductImageViewSet,
    ProductAttributeViewSet, VariantViewSet, CartViewSet, CartItemViewSet,
    OrderViewSet, OrderItemViewSet, PaymentViewSet, ReviewViewSet,
    UserViewSet, ProductViewSet, BannerImageView, SignUpView,
    UserProfileView , admin_dashboard
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'phonenum', PhoneNumberViewSet)
router.register(r'address', AddressViewSet)
router.register(r'category', CategoryViewSet)
router.register(r'brand', BrandViewSet)
router.register(r'product-category', ProductCategoryViewSet)
router.register(r'product-image', ProductImageViewSet)
router.register(r'product-attribute', ProductAttributeViewSet)
router.register(r'variant', VariantViewSet)
router.register(r'cart', CartViewSet)
router.register(r'cart-item', CartItemViewSet)
router.register(r'order', OrderViewSet)
router.register(r'order-item', OrderItemViewSet)
router.register(r'payment', PaymentViewSet)
router.register(r'review', ReviewViewSet)
router.register(r'product', ProductViewSet)

urlpatterns = [
    path('', index, name='index'),
    path('api/', include(router.urls)),
    path('api/images/banner', BannerImageView.as_view(), name='banner-image'),
    path('api/users/', SignUpView.as_view(), name='signup'),
    path('api/user/profile/', UserProfileView.as_view(), name='user-profile'), 
    path('api/admin/dashboard/', admin_dashboard, name='admin-dashboard'),
     
]
