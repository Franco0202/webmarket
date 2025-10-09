from django.urls import path
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views
from django.http import FileResponse, Http404
import os
from django.urls import path
from .views import create_admin

app_name = 'polls'  # URL patterns for the polls app


urlpatterns = [
    # User Info
    path("auth/user/", views.current_user, name="current_user"),
    # 🔑 AUTH (from dj-rest-auth + allauth)
    path("auth/", include("dj_rest_auth.urls")),                  
    path("auth/registration/", include("dj_rest_auth.registration.urls")),
    path("auth/create-admin/", create_admin),


    # PRODUCTS
    path("auth/Home/", views.index, name="product_list"),
    path("auth/products/search/", views.search, name="Search_products"),
    path("auth/products/<int:product_id>/", views.product_detail, name="product_detail"),

    # LIKES
    path("auth/products/<int:product_id>/like/", views.toggle_like, name="toggle_like"),
    path("auth/likes/", views.likes_view, name="likes_view"),

    # CART
    path("auth/cart/", views.cart_view),
    path("auth/cart/add/<int:product_id>/", views.add_to_cart),
    path("auth/cart/remove/<int:product_id>/", views.remove_from_cart),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)