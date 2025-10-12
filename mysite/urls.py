"""
URL configuration for mysite project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from django.http import FileResponse, Http404
from django.urls import re_path
import os


def frontend(request):
    index_path = os.path.join(settings.BASE_DIR, 'polls/static/index.html')
    if not os.path.exists(index_path):
        raise Http404("index.html not found")
    return FileResponse(open(index_path, 'rb'), content_type='text/html')

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("polls.urls")), 
    path("accounts/", include("allauth.urls")),
    re_path(r"^(?!api|admin|accounts).*$", frontend, name='frontend'),
]
if settings.DEBUG: #sirve para servir archivos multimedia en modo debug 
                # se usa el debug en true porque django no debe servir archivos estaticos
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)