from django.db import models
from django.conf import settings
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.models import AbstractUser, Group, Permission,User
from decimal import Decimal


# ---------- Custom User ---------- #
class User(AbstractUser):
    is_customer = models.BooleanField(default=False)
    is_seller = models.BooleanField(default=False)
    phone = models.CharField(max_length=10, blank=True, null=True)
    address = models.TextField(blank=True, null=True)

    # Avoiding reverse accessor clashes
    groups = models.ManyToManyField(
        Group,
        related_name="custom_user_groups",
        blank=True,
        help_text=_("The groups this user belongs to."),
        related_query_name="user",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name="custom_user_permissions",
        blank=True,
        help_text=_("Specific permissions for this user."),
        related_query_name="user",
    )

    def __str__(self):
        return self.username


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    is_customer = models.BooleanField(default=True)
    is_seller = models.BooleanField(default=False)

    def __str__(self):
        return self.user.username

class PhoneNumber(models.Model):
    """A phone number can be used by many users (e.g., family)."""
    number = models.CharField(max_length=25, unique=True)
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="phone_numbers")

    def __str__(self):
        return self.number


class Address(models.Model):
    class AddressType(models.TextChoices):
        SHIPPING = "SHP", _("Shipping")
        BILLING = "BIL", _("Billing")

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="addresses")
    type = models.CharField(max_length=5, choices=AddressType.choices, default=AddressType.SHIPPING)
    line1 = models.CharField(max_length=150)
    line2 = models.CharField(max_length=150, blank=True)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    country = models.CharField(max_length=50, default="NEPAL")
    is_default = models.BooleanField(default=False)

    class Meta:
        unique_together = ("user", "type", "is_default")

    def __str__(self):
        return f"{self.line1}, {self.city}"


# ---------- Product Info ---------- #
class Category(models.Model):
    name = models.CharField(max_length=80, unique=True)
    parent = models.ForeignKey("self", null=True, blank=True, on_delete=models.CASCADE, related_name="children")
    description = models.TextField(blank=True)

    class Meta:
        verbose_name_plural = "Categories"
        ordering = ['name']

    def __str__(self):
        full_path = [self.name]
        k = self.parent
        while k:
            full_path.append(k.name)
            k = k.parent
        return " -> ".join(full_path[::-1])


class Brand(models.Model):
    name = models.CharField(max_length=150, unique=True)
    description = models.TextField(blank=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Product(models.Model):
    sku = models.CharField(max_length=40, unique=True)
    name = models.CharField(max_length=120)
    main_image = models.ImageField(upload_to="mainProductImages", null=True, blank=True)
    description = models.TextField()
    brand = models.ForeignKey('Brand', on_delete=models.PROTECT, related_name="products")
    categories = models.ManyToManyField('Category', through="ProductCategory")
    price = models.DecimalField(max_digits=10, decimal_places=2)  # New price field
    stock = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.name

class ProductCategory(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("product", "category")

    def __str__(self):
        return f"{self.product.name} in {self.category.name}"


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image_url = models.ImageField(upload_to="productImages")
    alt_text = models.CharField(max_length=140, blank=True)
    sort_order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        unique_together = ("product", "sort_order")
        ordering = ("sort_order",)

    def __str__(self):
        return f"Image for {self.product.name} ({self.sort_order})"


class ProductAttribute(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="attributes")
    name = models.CharField(max_length=40)   # e.g., "Color"
    value = models.CharField(max_length=120) # e.g., "Red"

    class Meta:
        unique_together = ("product", "name", "value")

    def __str__(self):
        return f"{self.name}: {self.value}"


class Variant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    label = models.CharField(max_length=80)  # e.g., "2kg pack"
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.PositiveIntegerField()
    weight_kg = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)

    class Meta:
        unique_together = ("product", "label")

    def __str__(self):
        return f"{self.product.name} – {self.label}"


# ---------- Cart & Orders ---------- #
class Cart(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"Cart {self.pk}"


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    variant = models.ForeignKey(Variant, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()

    class Meta:
        unique_together = ("cart", "variant")

    def __str__(self):
        return f"{self.variant} x {self.quantity}"


class Order(models.Model):
    class Status(models.TextChoices):
        PENDING = "PEN", _("Pending")
        PAID = "PAI", _("Paid")
        SHIPPED = "SHP", _("Shipped")
        DELIVERED = "DEL", _("Delivered")
        CANCELLED = "CAN", _("Cancelled")

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    status = models.CharField(max_length=3, choices=Status.choices, default=Status.PENDING)
    placed_at = models.DateTimeField(auto_now_add=True)
    shipping_addr = models.ForeignKey(Address, on_delete=models.PROTECT, related_name="order_shipping")
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"Order {self.pk}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    variant = models.ForeignKey(Variant, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ("order", "variant")


class Payment(models.Model):
    class Method(models.TextChoices):
        KHALTI = "KHA", _("Khalti")
        COD = "COD", _("Cash on Delivery")

    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="payment")
    method = models.CharField(max_length=3, choices=Method.choices)
    status = models.CharField(max_length=20, default="unpaid")
    transaction_id = models.CharField(max_length=120, blank=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Payment for Order {self.order.id}"


# ---------- Reviews ---------- #
class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)
    rating = models.PositiveSmallIntegerField()
    title = models.CharField(max_length=120, blank=True)
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("product", "user")

    def __str__(self):
        return f"{self.user} review on {self.product}"


class BannerImage(models.Model):
    image = models.ImageField(upload_to='banners/')
    alt_text = models.CharField(max_length=120, blank=True)

    def __str__(self):
        return self.alt_text or f"Banner {self.id}"
