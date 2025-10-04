from django.contrib import admin
from .models import Products, Order, Cart, product_images, CartItem

admin.site.register(Products)
admin.site.register(Order)
admin.site.register(Cart)  
admin.site.register(product_images)  # Register the product_images model
admin.site.register(CartItem)

class Product_imagesInline(admin.TabularInline):
    model = product_images
    extra = 1
    max_num = 5  # máximo 5 imágenes por producto (límite visual en admin)


class ProductsAdmin(admin.ModelAdmin):
    inlines = [Product_imagesInline]


class Product_imagesAdmin(admin.ModelAdmin):
    list_display = ("product", "image")

class CartItemAdmin(admin.ModelAdmin):
    list_display = ("cart", "product", "quantity")
