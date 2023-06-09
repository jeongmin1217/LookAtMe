from rest_framework import serializers
from .models import *


class DetectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Detection
        fields = ["lookingOther", "lookingCenter",
                  "sleeping", "detectionError", "noPerson", "score", "start_time", "end_time"]


class AlarmSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alarm
        fields = ["noPerson", "sleeping", "start_time", "end_time"]
