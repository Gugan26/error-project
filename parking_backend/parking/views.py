from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Reservation, MonthlyPass, YearlyPass
from .serializers import ReservationSerializer, MonthlyPassSerializer, YearlyPassSerializer, EmployeeSerializer
from django.contrib.auth.hashers import check_password
from .qr import generate_qr

@api_view(['POST'])
def create_reservation(request):
    serializer = ReservationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_monthly_pass(request):
    serializer = MonthlyPassSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def create_yearly_pass(request):
    serializer = YearlyPassSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# -----------------------------
# CANCEL RESERVATION (safe version)
# -----------------------------
@api_view(['POST'])
def cancel_reservation(request):
    try:
        spot_id = request.data.get('spot_id')
        email = request.data.get('email', '').lower().strip()
        password = request.data.get('password', '')

        if not spot_id or not email or not password:
            return Response(
                {"error": "All fields are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        res_query = Reservation.objects.filter(
            spot_id=spot_id,
            email__iexact=email
        )

        if not res_query.exists():
            return Response(
                {"error": "No reservation found for this email at this spot."},
                status=status.HTTP_404_NOT_FOUND
            )

        target_res = res_query.filter(password=password).first()

        if not target_res:
            return Response(
                {"error": "Incorrect password. Cancellation denied."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        is_monthly = MonthlyPass.objects.filter(email__iexact=email).exists()
        is_yearly = YearlyPass.objects.filter(email__iexact=email).exists()

        target_res.delete()

        if is_yearly:
            message = "Reservation cancelled. Thanks for being a Yearly Pass holder!"
            qr_file = None

        elif is_monthly:
            message = "Reservation cancelled. Thanks for being a Monthly Pass holder!"
            qr_file = None

        else:
            message = "Reservation cancelled successfully!"
            qr_file = generate_qr(
                data=message,
                file_name="reservation_cancelled.png"
            )

        return Response(
            {
                "success": message,
                "qr": qr_file
            },
            status=status.HTTP_200_OK
        )

    except Exception as e:
        print("Error:", e)
        return Response(
            {"error": "Internal Server Error"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@api_view(['POST'])
def create_employee(request):
    serializer = EmployeeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)