from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import CategoryCreateView, CategoryListView
from .views import AddPointsView
from django.urls import path
from .views import ConstateurReportListView, UpdateReportStatusView
from django.conf import settings
from .views import get_client_points
from django.conf.urls.static import static
from myapp.views import (
    RegisterView, 
    LoginView, 
    SomeProtectedView, 
    ProblemCategoryListView, 
    ProblemReportCreateView,
    UserViewSet,
    ProblemReportViewSet  # <-- Import de ton viewset pour les signalements
)

from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenObtainPairView
)

# Crée un routeur pour les ViewSets
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'reports', ProblemReportViewSet, basename='report')  # <-- Ajout de la route pour les signalements

urlpatterns = [
    # Authentication
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', LoginView.as_view(), name='login'),  # login returns tokens
    path('api/protected/', SomeProtectedView.as_view(), name='protected'),

    # Problem reports and categories
    path('api/problem-reports/', ProblemReportCreateView.as_view(), name='problem-report-create'),
    path('api/problem-categories/', ProblemCategoryListView.as_view(), name='problem-category-list'),

    # JWT Token
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Inclus toutes les routes du router (comme /api/users/ et /api/reports/)
    path('api/', include(router.urls)),
    
    # Routes pour les constateurs

    path('api/categories/add/', CategoryCreateView.as_view(), name='add-category'),
    path('api/categories/', CategoryListView.as_view(), name='list-categories'),
    path('api/user-reports/', views.get_user_reports, name='user-reports'),
    path('api/add-points/', AddPointsView.as_view(), name='add-points'),
    path('reports/<int:report_id>/add_points/', AddPointsView.as_view(), name='add_points'),
    path('api/constateur/reports/', ConstateurReportListView.as_view(), name='constateur-reports'),
    path('api/client/points/', get_client_points, name='get_client_points'),
    path('api/constateur/reports/<int:pk>/update_status/', UpdateReportStatusView.as_view(), name='update_report_status'),
    ] 
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
