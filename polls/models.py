from django.db import models
import datetime
from django.utils import timezone
from django.contrib.auth.models import User



    
class Products(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(decimal_places=2, max_digits=10)
    stock = models.IntegerField(default=0)
    products_text = models.CharField(max_length=200)
    pub_date = models.DateTimeField("date published")
    def __str__(self):
        return f"{self.name} - {self.products_text}"
    def was_published_recently(self):
        return self.pub_date >= timezone.now() - datetime.timedelta(days=1)
    def total_likes(self):
        return self.like_set.filter(like=True).count()
    
class product_images(models.Model):
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="product_images/")
    def __str__(self):
        return f"Image for {self.product.name}"
    

class Order(models.Model):
    STATUS_CHOICES = [
        ("PENDING", "Pending"),
        ("PAID", "Paid"),
        ("SHIPPED", "Shipped"),
        ("DELIVERED", "Delivered"),
        ("CANCELED", "Canceled"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="PENDING")

    def __str__(self):
        return f"Order #{self.id} by {self.user.Username} - {self.status}"

    @property
    def total_price(self):
        return sum(item.subtotal for item in self.items.all())


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey("Products", on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.quantity} × {self.product.products_text} in Order #{self.order.id}"

    @property
    def subtotal(self):
        return self.price_at_purchase * self.quantity

class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cart for {self.user.username}"

    @property
    def total_price(self):
        return sum(item.subtotal for item in self.items.all())


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity} of {self.product.products_text} in {self.cart.user.username}'s cart"

    @property
    def subtotal(self):
        return self.product.price * self.quantity
    
class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Products, on_delete=models.CASCADE)
    like = models.BooleanField(default=False)
    class Meta:
        unique_together = ('user', 'product')  # Un like por usuario-producto

    def __str__(self):
        return f"{self.user} - {self.product} ({self.like})"
    


