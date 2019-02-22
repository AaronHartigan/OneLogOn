from django.shortcuts import get_object_or_404, render
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from backend.server.serializers import UserSerializer
from django.contrib.auth.models import User
from backend.server.models import Student
from backend.server.models import Company
from backend.server.models import Visitors
from backend.server.models import CheckIns
from backend.server.models import TimeSheet
from backend.server.models import ListReasons
from backend.server.models import VisitorReason
from backend.server.models import CheckInVisitorReason
from backend.server.serializers import StudentSerializer
from backend.server.serializers import CompanySerializer
from backend.server.serializers import CheckInsSerializer
from backend.server.serializers import TimeSheetSerializer
from backend.server.serializers import ListReasonsSerializer
from backend.server.serializers import VisitorsSerializer
from backend.server.serializers import VisitorReasonSerializer
from backend.server.serializers import CheckInVisitorReasonSerializer

def index(request):
    return render(request, 'index.html')

# /api/student
class StudentListCreate(generics.ListCreateAPIView):
    """
    Test student API endpoint
    """
    permission_classes = (IsAuthenticated,)
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    # test get
    def get(self, request):
        content = { 'message': 'mitch says hello' }
        return Response(content)

class CompanyListCreate(generics.ListCreateAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

class CheckInsListCreate(generics.ListCreateAPIView):
    queryset = CheckIns.objects.all()
    serializer_class = CheckInsSerializer

class TimeSheetListCreate(generics.ListCreateAPIView):
    queryset = TimeSheet.objects.all()
    serializer_class = CheckInsSerializer

class VisitorsListCreate(generics.ListCreateAPIView):
    queryset = Visitors.objects.all()
    serializer_class = VisitorsSerializer

class VisitorReasonListCreate(generics.ListCreateAPIView):
    queryset = VisitorReason.objects.all()
    serializer_class = VisitorReasonSerializer

class CheckInVisitorReasonListCreate(generics.ListCreateAPIView):
    queryset = CheckInVisitorReason.objects.all()
    serializer_class = CheckInVisitorReasonSerializer

class ListReasonsListCreate(generics.ListCreateAPIView):
    queryset = ListReasons.objects.all()
    serializer_class = ListReasonsSerializer

class UserCreate(APIView):
    permission_classes = []
    """
    Creates the user.
    """
    def post(self, request, format='json'):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        