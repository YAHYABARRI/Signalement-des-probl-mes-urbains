from rest_framework import serializers
from .models import User, ProblemReport, ProblemCategory, ClientPoints
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'user_type', 'password', 'password2')
        extra_kwargs = {
            'user_type': {'required': False, 'default': 'CLIENT'}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user_type = validated_data.get('user_type', 'CLIENT')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            user_type=user_type,
            password=validated_data['password']
        )
        return user


# Token Serializer for JWT
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data['user_type'] = user.user_type
        return data


# Problem Category Serializer
class ProblemCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProblemCategory
        fields = ['id', 'name', 'point_value']


# Problem Report Serializer
class ProblemReportSerializer(serializers.ModelSerializer):
    reporter = serializers.StringRelatedField(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    category = serializers.PrimaryKeyRelatedField(queryset=ProblemCategory.objects.all())
    image = serializers.ImageField(required=False, allow_null=True)
    thumbnail = serializers.ImageField(read_only=True)
    status_display = serializers.SerializerMethodField()

    class Meta:
        model = ProblemReport
        fields = [
            'id',
            'reporter',
            'category',
            'category_name',
            'description',
            'location_address',
            'latitude',
            'longitude',
            'image',
            'thumbnail',
            'date_reported',
            'status',
            'status_display',
        ]
        read_only_fields = ['reporter', 'date_reported', 'thumbnail', 'status']

    def get_status_display(self, obj):
        return obj.get_status_display()

    def create(self, validated_data):
        user = self.context['request'].user
        return ProblemReport.objects.create(reporter=user, **validated_data)


# Client Points Serializer
class ClientPointsSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()

    class Meta:
        model = ClientPoints
        fields = ['user', 'balance']


# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'user_type']
