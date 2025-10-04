from django import forms
from .models import Products

class ProductForm(forms.ModelForm):
    class Meta:
        model = Products
        fields = '__all__' 
        # Estos son los campos de tu modelo que se mostrarán en el formulario