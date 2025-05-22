from django.contrib.auth.models import AbstractUser
from django.db import models
from django.core.validators import MinValueValidator

class User(AbstractUser):
    USER_TYPES = (
        ('CONSTATEUR', 'Constateur'),
        ('ADMIN', 'Administrateur'),
        ('CLIENT', 'Client'),
    )
    
    user_type = models.CharField(max_length=10, choices=USER_TYPES, default='CLIENT')
    phone = models.CharField(max_length=20, blank=True, null=True)
    
    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"

class ProblemCategory(models.Model):
    name = models.CharField(max_length=100)
    point_value = models.PositiveIntegerField(default=10)
    
    def __str__(self):
        return f"{self.name} ({self.point_value} pts)"

class ProblemReport(models.Model):
    STATUS_CHOICES = (
        ('PENDING', 'Pending'),
        ('VALIDATED', 'Validated'),
        ('REJECTED', 'Rejected'),
    )
    
    reporter = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.ForeignKey(ProblemCategory, on_delete=models.CASCADE)
    description = models.TextField()
    location_address = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()

    image = models.ImageField(
        upload_to='reports/%Y/%m/%d/', 
        help_text="Upload photo of the problem"
    )
    thumbnail = models.ImageField(
        upload_to='thumbnails/%Y/%m/%d/',
        null=True,
        blank=True
    )
    
    date_reported = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='PENDING')
    
    class Meta:
        ordering = ['-date_reported']
        
    def __str__(self):
        return f"{self.category.name} reported by {self.reporter.username}"

class ClientPoints(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    balance = models.PositiveIntegerField(default=0)
    
    def add_points(self, points):
        self.balance += points
        self.save()
        return self.balance



