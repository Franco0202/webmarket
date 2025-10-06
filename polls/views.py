from django.http import HttpResponse
from django.shortcuts import render
from .models import Products, Like, Cart, CartItem, Order, OrderItem
from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import ProductSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated



def index(request):
    latest_products_list = Products.objects.order_by('-pub_date')  # El "-" indica descendente
    data = [
        {
            "id": p.id,
            "name": p.name,
            "text": p.products_text,
            "price": str(p.price),
            "pub_date": p.pub_date
        }
        for p in latest_products_list
    ]
    return JsonResponse(data, safe=False)


@api_view(['GET'])
def index(request):
    products = Products.objects.all()
    serializer = ProductSerializer(products, many=True)
    return JsonResponse(serializer.data, safe=False)


def search(request):
    query = request.GET.get("q", "")
    products = Products.objects.all()
    if query:
        products = products.filter(name__icontains=query) | products.filter(products_text__icontains=query)
    
    data = [
                {
                "id": p.id,
                "name": p.name,
                "price": str(p.price),
                "images": [{"id": img.id, "image": img.image.url} for img in p.product_images_set.all()]
                }


                for p in products
            ]
    return JsonResponse(data, safe=False)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def toggle_like(request, product_id):
    try:
        product = get_object_or_404(Products, id=product_id)
        like_obj, created = Like.objects.get_or_create(user=request.user, product=product)

        # Toggle the boolean
        like_obj.like = not like_obj.like
        like_obj.save()

        return JsonResponse({"success": True, "liked": like_obj.like})
    except Exception as e:
        return JsonResponse({"success": False, "error": str(e)}, status=500)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def likes_view(request):
    liked_products = Products.objects.filter(like__user=request.user, like__like=True)
    data = [
        {
            "id": p.id,
            "name": p.name,
            "price": str(p.price),
            "text": p.products_text,
            "images": [{"id": img.id, "image": img.image.url} for img in p.product_images_set.all()]
        }
        for p in liked_products
    ]
    return JsonResponse(data, safe=False)
def product_detail(request, product_id):
    product = get_object_or_404(Products, id=product_id)
    images = product.product_images_set.all()  # default related name
    data = {
        "id": product.id,
        "name": product.name,
        "text": product.products_text,
        "price": str(product.price),
        "pub_date": product.pub_date,
        "images": [{"id": img.id, "image": img.image.url} for img in images],
    }
    return JsonResponse(data)

from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from .models import Products, Cart, CartItem

from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.http import JsonResponse
from .models import Products, Cart, CartItem

# --- Helper: serialize cart ---
def serialize_cart(cart):
    items = cart.items.all()  # thanks to related_name="items" on CartItem
    cart_items = [
        {
            "id": item.id,
            "product": {
                "id": item.product.id,
                "name": item.product.name,
                "text": item.product.products_text,
                "price": float(item.product.price),
                "images": [{"id": img.id, "image": img.image.url} for img in item.product.product_images_set.all()]
            },
            "quantity": item.quantity,
            "subtotal": float(item.subtotal),
        }
        for item in items
    ]
    return {
        "cart_items": cart_items,
        "cart_count": len(cart_items),
        "total_price": float(cart.total_price),
    }


# --- Add product to cart ---
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def add_to_cart(request, product_id):
    product = get_object_or_404(Products, id=product_id)
    cart, _ = Cart.objects.get_or_create(user=request.user)

    cart_item, created = CartItem.objects.get_or_create(cart=cart, product=product)
    if not created:
        cart_item.quantity += 1
        cart_item.save()

    return JsonResponse(serialize_cart(cart))


# --- Remove product from cart ---
@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def remove_from_cart(request, product_id):
    cart = get_object_or_404(Cart, user=request.user)
    cart_item = get_object_or_404(CartItem, cart=cart, product_id=product_id)
    cart_item.delete()

    return JsonResponse(serialize_cart(cart))


# --- Get current user's cart ---
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def cart_view(request):
    cart, _ = Cart.objects.get_or_create(user=request.user)
    return JsonResponse(serialize_cart(cart))


@api_view(["GET"])
def current_user(request):
    if request.user.is_authenticated:
        return JsonResponse({
            "id": request.user.id,
            "username": request.user.username,
            "email": request.user.email,
            })
    else:
        # If the user is not logged in, return a default response
        return JsonResponse({
            "id": None,
            "username": "Guest",
            "email": None,
        })
    

# polls/views.py
import os
from django.conf import settings
from django.http import FileResponse, Http404

def frontend(request):
    index_path = os.path.join(settings.BASE_DIR, 'polls', 'static', 'dist', 'index.html')
    if not os.path.exists(index_path):
        raise Http404("index.html not found")
    return FileResponse(open(index_path, 'rb'), content_type='text/html')
