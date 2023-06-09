from django.shortcuts import render
from .models import Detection, Alarm
from .serializers import DetectionSerializer, AlarmSerializer
from rest_framework import viewsets
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt  # CSRF 보안 임시 해제
from django.utils.decorators import method_decorator
from .stringToRGB import stringToRGB
from django.http import JsonResponse
import os
from .gazetracking import GazeAnalyzer
import cv2
import numpy as np
from PIL import Image
from django.conf import settings
from datetime import datetime
import pygame
from django.views import View
from django.utils import timezone
from tkinter import messagebox
# Create your views here.
class DetectionViewSet(viewsets.ModelViewSet):
    queryset = Detection.objects.all()
    serializer_class = DetectionSerializer

    def get(self, request):
        dummy = Detection.objects.all()
        serializer = DetectionSerializer(dummy, many=True)
        return Response(serializer.data)
    
# Create your views here.
class AlarmViewSet(viewsets.ModelViewSet):
    queryset = Alarm.objects.all()
    serializer_class = AlarmSerializer

@method_decorator(csrf_exempt, name='dispatch')
class LatestDetectionView(View):
    queryset = Detection.objects.all()
    serializer_class = DetectionSerializer

    def get(self, request):
        latest_detection = Detection.objects.latest('start_time')
        serializer = DetectionSerializer(latest_detection)
        return JsonResponse(serializer.data)


@method_decorator(csrf_exempt, name='dispatch')
def upload_image(request):
    if request.method == 'POST':
        image_url = request.POST.get('data')
        person_result = request.POST.get('result')
        print(person_result)
        rgb = stringToRGB(image_url.split(',')[1])
        rgb.save("static/image.jpg")

        gaze_analyzer = GazeAnalyzer()
        result = gaze_analyzer.analyze("static/image.jpg")
        
        # active detection이 있으면
        active_detection = Detection.objects.filter(end_time__isnull=True).latest('start_time')
        if not active_detection:
            # active detection 없으면 create a new one
            detection = Detection.objects.create()
        else:
            detection = active_detection

        # active alarm이 있으면
        active_alarm = Alarm.objects.filter(end_time__isnull=True).latest('start_time')
        if not active_alarm:
            # active detection 없으면 create a new one
            alarm = Alarm.objects.create()
        else:
            alarm = active_alarm            

        if person_result == "person":
            if result == "Looking right" or result == "Looking left":
                detection.lookingOther += 1
            elif result == "Looking center":
                detection.lookingCenter += 1
            elif result == "Sleeping":
                detection.sleeping += 1
                alarm.sleeping += 1
            elif result == "Detection error":
                detection.detectionError += 1
        else:
            detection.noPerson += 1
            alarm.noPerson += 1

        if alarm.noPerson >= 5:
            pygame.mixer.init()
            pygame.mixer.music.load('static/alert_sound.mp3')
            pygame.mixer.music.play()
            # messagebox.showinfo("경고!", "자리에 앉아 주세요!")
            if person_result != "no person":
                #model update to 0
                alarm.noPerson = 0
                alarm.save()

        if alarm.sleeping >= 5:
            pygame.mixer.init()
            pygame.mixer.music.load('static/alert_sound.mp3')
            pygame.mixer.music.play()
            # messagebox.showinfo("경고!", "졸지 마세요!")
            if result == "Looking center": #졸다가 looking center 되면 알람 없애기
                #model update to 0
                alarm.sleeping = 0
                alarm.save()

        detection.save()
        alarm.save()

        if os.path.exists("static/image.jpg"):
            os.remove("static/image.jpg")
        
        return JsonResponse({'message': 'success'})
    else:
        return JsonResponse({'message': 'POST error.'}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
def end_detection(request):
    if request.method == 'POST':
        # Check if there is an active detection
        active_detection = Detection.objects.filter(end_time__isnull=True).latest('start_time')
        active_alarm = Alarm.objects.filter(end_time__isnull=True).latest('start_time')

        if active_detection:
            # Set the end time of the active detection
            active_detection.end_time = timezone.now()
            active_detection.save()
        else:
            # Create a new detection object
            detection = Detection.objects.create(start_time=timezone.now())
            detection.save()

        if active_alarm:
            # Set the end time of the active detection
            active_alarm.end_time = timezone.now()
            active_alarm.save()
        else:
            # Create a new detection object
            alarm = Alarm.objects.create(start_time=timezone.now())
            alarm.save()

        return JsonResponse({'message': 'success'})
    else:
        return JsonResponse({'message': 'POST error.'}, status=400)

@method_decorator(csrf_exempt, name='dispatch')
def start_detection(request):
    if request.method == 'POST':
        
        # Create a new detection object
        detection = Detection.objects.create(start_time=timezone.now())
        detection.save()

        alarm = Alarm.objects.create(start_time=timezone.now())
        alarm.save()

        return JsonResponse({'message': 'Detection started'})
    else:
        return JsonResponse({'message': 'POST error.'}, status=400)
