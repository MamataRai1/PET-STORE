from django.urls import path,include
from .views import (
    index,
    PhoneNumberViewSet,
    AddressViewSet,
    CategoryViewSet,
    BrandViewSet,
    ProductCategoryViewSet,
    ProductImageViewSet,
    ProductAttributeViewSet,
    VariantViewSet,
    CartViewSet,
    CartItemViewSet,
    OrderViewSet,
    OrderItemViewSet,
    PaymentViewSet,
    ReviewViewSet
)
from rest_framework.routers import DefaultRouter

router=DefaultRouter()
router.register(r'phonenum', PhoneNumberViewSet, basename='phone-number'),
router.register(r'address', AddressViewSet, basename='address'),
router.register(r'category', CategoryViewSet, basename='category'), 
router.register(r'brand', BrandViewSet, basename='brand'),
router.register(r'product-category', ProductCategoryViewSet, basename='product-category'),  
router.register(r'product-image', ProductImageViewSet, basename='product-image'),
router.register(r'product-attribute', ProductAttributeViewSet, basename='product-attribute'),
router.register(r'variant', VariantViewSet, basename='variant'),
router.register(r'cart', CartViewSet, basename='cart'), 
router.register(r'cart-item', CartItemViewSet, basename='cart-item'),
router.register(r'order', OrderViewSet, basename='order'),
router.register(r'order-item', OrderItemViewSet, basename='order-item'),
router.register(r'payment', PaymentViewSet, basename='payment'),
router.register(r'review', ReviewViewSet, basename='review'),




urlpatterns = [
    path('',index, name='index'),
    path('api/', include(router.urls)),
   
]
