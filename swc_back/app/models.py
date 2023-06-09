from django.db import models

# Create your models here.


class Detection(models.Model):
    # className = models.CharField(max_length=30)
    lookingOther = models.IntegerField(default=0)
    lookingCenter = models.IntegerField(default=1)
    sleeping = models.IntegerField(default=0)
    detectionError = models.IntegerField(default=0)
    noPerson = models.IntegerField(default=0)
    score = models.IntegerField(default=100)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        self.score = int(
            (((1 * self.lookingCenter) + (0.7 * self.lookingOther) + (0.5 * self.sleeping) + (0.3 * self.noPerson))
             / (self.lookingCenter+self.lookingOther+self.sleeping+self.noPerson)) * 100
            #  +
            # ((0.3 * self.lookingOther) / (self.lookingCenter+self.lookingOther+self.sleeping+self.noPerson)) * 100 +
            # ((0.5 * self.sleeping) / (self.lookingCenter+self.lookingOther+self.sleeping+self.noPerson)) * 100 +
            # ((0.7 * self.noPerson) / (self.lookingCenter +
            #  self.lookingOther+self.sleeping+self.noPerson)) * 100
        )
        super().save(*args, **kwargs)


class Alarm(models.Model):
    noPerson = models.IntegerField(default=0)
    sleeping = models.IntegerField(default=0)
    start_time = models.DateTimeField(null=True, blank=True)
    end_time = models.DateTimeField(null=True, blank=True)
