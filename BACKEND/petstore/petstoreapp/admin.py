from django.contrib import admin
from .models import (User,Product, PhoneNumber, Address, Category,Brand, ProductCategory,ProductImage,ProductAttribute,Variant,Cart,CartItem,Order, OrderItem, Payment,Review, BannerImage,UserProfile)

admin.site.register(User)
admin.site.register(Product)
admin.site.register(PhoneNumber)
admin.site.register(Address)
admin.site.register(Category)
admin.site.register(Brand)
admin.site.register(ProductCategory)
admin.site.register(ProductImage)
admin.site.register(ProductAttribute)
admin.site.register(Variant)
admin.site.register(Cart)
admin.site.register(CartItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Payment)
admin.site.register(Review)
admin.site.register(BannerImage)  # Registering BannerImage model
admin.site.register(UserProfile)  # Registering UserProfile model if it exists