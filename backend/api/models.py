# backend/api/models.py

from django.db import models
from django.contrib.auth.models import AbstractUser
from allauth.account.signals import user_signed_up
from django.dispatch import receiver
import uuid

# Your CustomUser model is already here...
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email


# This is the new signal receiver function
@receiver(user_signed_up)
def populate_username(sender, request, user, **kwargs):
    """
    When a user signs up (e.g., via Google), this function is triggered.
    It populates the username field with a unique value derived from the email.
    """
    # Check if the username is already set (it usually won't be for social auth)
    if not user.username:
        # Generate a username from the local part of the email
        username_part = user.email.split('@')[0]
        # To ensure uniqueness, append a short unique ID
        unique_id = str(uuid.uuid4()).split('-')[0][:4]
        user.username = f"{username_part}_{unique_id}"
        user.save()
