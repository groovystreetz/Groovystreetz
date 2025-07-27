# backend/api/serializers.py

from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers
from dj_rest_auth.serializers import UserDetailsSerializer

# Get the custom user model ('api.CustomUser') that we defined in settings.py
User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration. It creates a new CustomUser.
    """
    class Meta:
        model = User
        # We will register using email and password. 'username' is included because
        # it is still part of the underlying AbstractUser model.
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # This will now correctly create an instance of our CustomUser model
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user


class LoginSerializer(serializers.Serializer):
    """
    Serializer for user login. It authenticates using email and password.
    """
    # We now expect an 'email' field for login, not a 'username'.
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        # The authenticate function needs the request context to work properly
        request = self.context.get('request')
        
        # Since our CustomUser model has USERNAME_FIELD = 'email', Django's
        # authenticate function knows to treat the 'username' parameter as an email.
        user = authenticate(request=request, username=data.get('email'), password=data.get('password'))

        if user and user.is_active:
            return user
        raise serializers.ValidationError("Unable to log in with provided credentials.")


class CustomUserDetailsSerializer(UserDetailsSerializer):
    """
    Custom serializer for the user details endpoint.
    This controls the data returned when fetching user info (e.g., after login).
    """
    class Meta(UserDetailsSerializer.Meta):
        model = User
        # Define the specific fields to include in the API response.
        # This gives us full control over what user data is exposed.
        fields = ('pk', 'email', 'username', 'first_name', 'last_name')
        # You can add any custom fields from your CustomUser model here, e.g.:
        # fields = ('pk', 'email', 'first_name', 'last_name', 'profile_picture_url')
