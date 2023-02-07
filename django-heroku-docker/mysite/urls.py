
from django.urls import path,include
from . import views
from django.conf import settings
from django.conf.urls.static import static
from .views import TopView

urlpatterns = [
    path('', TopView.as_view(), name='top'),
    path('resindex/', views.ResIndex, name='resindex'),
    path('ajax-number/', views.ajax_number, name='ajax_number'),
]