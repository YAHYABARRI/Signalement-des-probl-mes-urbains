from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import AllowAny  # 👈 à ajouter
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics
from .models import ProblemReport
from .serializers import ProblemReportSerializer
from rest_framework import generics
from .models import ProblemCategory
from .serializers import ProblemCategorySerializer
from rest_framework import viewsets
from .models import User
from .serializers import UserSerializer
from rest_framework.permissions import IsAdminUser
class RegisterView(APIView):
    permission_classes = [AllowAny] 

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({"message": "Utilisateur créé avec succès", "user": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class SomeProtectedView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        user_role = request.user.user_type  # Récupérer le rôle de l'utilisateur
        return Response({
            "message": "Tu es authentifié !",
            "user_role": user_role  # Renvoie également le rôle de l'utilisateur
        })



class ProblemCategoryListView(generics.ListAPIView):
    queryset = ProblemCategory.objects.all()
    serializer_class = ProblemCategorySerializer
    permission_classes = [AllowAny]


class ProblemReportCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = ProblemReportSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# views.py


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]  # Seul l'admin peut gérer les users
from rest_framework import status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .models import ProblemReport
from .serializers import ProblemReportSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pending_reports_for_constateur(request):
    if request.user.user_type != 'CONSTATEUR':
        return Response({'detail': 'Unauthorized'}, status=403)

    reports = ProblemReport.objects.filter(status='PENDING')
    serializer = ProblemReportSerializer(reports, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_report_status(request, report_id):
    if request.user.user_type != 'CONSTATEUR':
        return Response({'detail': 'Unauthorized'}, status=403)

    try:
        report = ProblemReport.objects.get(id=report_id, status='PENDING')
    except ProblemReport.DoesNotExist:
        return Response({'detail': 'Report not found or already processed'}, status=404)

    new_status = request.data.get('status')
    if new_status not in ['VALIDATED', 'REJECTED']:
        return Response({'detail': 'Invalid status'}, status=400)

    report.status = new_status
    report.save()
    return Response({'detail': f'Report {new_status.lower()} successfully'})
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ProblemCategory
from .serializers import ProblemCategorySerializer

class CategoryCreateView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        serializer = ProblemCategorySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


from rest_framework.generics import ListAPIView
from .models import ProblemCategory
from .serializers import ProblemCategorySerializer

class CategoryListView(ListAPIView):
    queryset = ProblemCategory.objects.all()
    serializer_class = ProblemCategorySerializer
    permission_classes = [AllowAny]  
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated, IsAdminUser

from .models import ProblemReport, ClientPoints
from .serializers import ProblemReportSerializer

class ProblemReportViewSet(viewsets.ModelViewSet):
    queryset = ProblemReport.objects.all()
    serializer_class = ProblemReportSerializer
    permission_classes = [IsAuthenticated]  # Tous les utilisateurs authentifiés peuvent voir les signalements

    # Ajouter des points à l'utilisateur qui a soumis un signalement
    @action(detail=True, methods=['post'], permission_classes=[IsAdminUser])  # Seul l'admin peut ajouter des points
    def add_points(self, request, pk=None):
        # Récupérer le signalement par ID
        report = self.get_object()
        points = report.category.point_value  # Points associés à la catégorie du signalement

        # Ajouter des points à l'utilisateur ayant soumis ce signalement
        client_points, created = ClientPoints.objects.get_or_create(user=report.reporter)
        new_balance = client_points.add_points(points)

        return Response({'message': f'{points} points ont été ajoutés à l\'utilisateur {report.reporter.username}. Nouveau solde: {new_balance}.'})

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import ClientPoints, User
import logging

logger = logging.getLogger(__name__)

@action(detail=True, methods=['post'], permission_classes=[IsAdminUser])
def add_points(self, request, pk=None):
    report = self.get_object()
    points = report.category.point_value
    logger.info(f"Ajout de {points} points à l'utilisateur {report.reporter.username}")

    client_points, created = ClientPoints.objects.get_or_create(user=report.reporter)
    logger.info(f"Ancien solde : {client_points.balance}, Nouveau solde : {client_points.balance + points}")
    new_balance = client_points.add_points(points)

    return Response({'message': f'{points} points ont été ajoutés à l\'utilisateur {report.reporter.username}. Nouveau solde: {new_balance}.'})
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ClientPoints
from django.contrib.auth.models import User

class AddPointsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, report_id):
        user_id = request.data.get('user_id')  # Assurez-vous que le `user_id` est bien envoyé
        points_to_add = request.data.get('points', 10)  # Si pas de points spécifiés, on ajoute 10 points par défaut

        if not user_id:
            return Response({"error": "L'ID de l'utilisateur est requis."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Récupérer l'utilisateur
            user = User.objects.get(id=user_id)
            
            # Ajouter les points dans la table ClientPoints
            client_points, created = ClientPoints.objects.get_or_create(user=user)
            client_points.add_points(points_to_add)  # Appeler la méthode add_points ici

            return Response({
                "message": f"{points_to_add} points ont été ajoutés à l'utilisateur {user.username}.",
                "new_balance": client_points.balance
            }, status=status.HTTP_200_OK)

        except User.DoesNotExist:
            return Response({"error": "Utilisateur non trouvé."}, status=status.HTTP_404_NOT_FOUND)
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import ProblemReport
from .serializers import ProblemReportSerializer

# Liste des signalements en attente pour le constateur
class ConstateurReportListView(generics.ListAPIView):
    serializer_class = ProblemReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.user_type == 'CONSTATEUR':
            return ProblemReport.objects.filter(status='PENDING')
        return ProblemReport.objects.none()
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import ProblemReport
from rest_framework.permissions import IsAuthenticated
import logging

logger = logging.getLogger(__name__)
class UpdateReportStatusView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if request.user.user_type != 'CONSTATEUR':
            return Response({'detail': 'Unauthorized'}, status=status.HTTP_403_FORBIDDEN)

        try:
            report = ProblemReport.objects.get(id=pk, status='PENDING')
        except ProblemReport.DoesNotExist:
            return Response({'detail': 'Signalement introuvable ou déjà traité'}, status=status.HTTP_404_NOT_FOUND)

        new_status = request.data.get('status')
        if new_status not in ['VALIDATED', 'REJECTED']:
            return Response({'detail': 'Statut invalide'}, status=status.HTTP_400_BAD_REQUEST)

        report.status = new_status
        report.save()
        return Response({'message': f'Signalement {new_status.lower()} avec succès.'}, status=status.HTTP_200_OK)
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ClientPoints, ProblemReport

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_client_points(request):
    user = request.user
    points = ClientPoints.objects.filter(user=user).first()
    if points:
        return Response({'balance': points.balance})
    return Response({'balance': 0})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_reports(request):
    user = request.user
    reports = ProblemReport.objects.filter(reporter=user)
    serializer = ProblemReportSerializer(reports, many=True)
    return Response(serializer.data)
