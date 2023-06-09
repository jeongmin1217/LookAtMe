from django.urls import path, include
from .views import *
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('detection', DetectionViewSet, basename='detection')
router.register('alarm', AlarmViewSet, basename='alarm')

urlpatterns = [
    path('', include(router.urls)),
    path('upload/', upload_image, name='upload_image'),
    path('start_detection/', start_detection, name='start_detection'),
    path('end_detection/', end_detection, name='end_detection'),
    path('api/detection/latest/', LatestDetectionView.as_view(),
         name='latest_detection'),
]
