from rest_framework import status
from rest_framework.response import Response

# Create your views here.
from rest_framework.views import APIView

from .predictor import predict_risk
from .serializers import RiskPredictionSerializer


class PredictRiskView(APIView):

    def post(self, request):

        serializer = RiskPredictionSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        prediction = predict_risk(serializer.validated_data)

        return Response(prediction, status=status.HTTP_200_OK)
