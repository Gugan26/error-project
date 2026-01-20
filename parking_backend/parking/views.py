from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Reservation, MonthlyPass, YearlyPass
from .serializers import ReservationSerializer, MonthlyPassSerializer, YearlyPassSerializer, EmployeeSerializer
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
# CANCEL RESERVATION (Step 1: Generate QR)
# -----------------------------
@api_view(['POST'])
def cancel_reservation(request):
    try:
        spot_id = request.data.get('spot_id')
        email = request.data.get('email', '').lower().strip()
        password = request.data.get('password', '')

        if not spot_id or not email or not password:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        res_query = Reservation.objects.filter(spot_id=spot_id, email__iexact=email)

        if not res_query.exists():
            return Response({"error": "No reservation found."}, status=status.HTTP_404_NOT_FOUND)

        target_res = res_query.filter(password=password).first()
        if not target_res:
            return Response({"error": "Incorrect password."}, status=status.HTTP_401_UNAUTHORIZED)

        # PASS HOLDER CHECK (No QR needed for them as per your old logic)
        is_monthly = MonthlyPass.objects.filter(email__iexact=email).exists()
        is_yearly = YearlyPass.objects.filter(email__iexact=email).exists()

        if is_yearly or is_monthly:
            target_res.delete() # Pass holders-ku direct delete
            return Response({"success": "Cancelled. Pass holder verified!", "qr": None})

        # NORMAL USER: Generate QR for confirmation
        qr_file_path = generate_qr(spot_id) # qr.py function call
        
        return Response({
            "success": "Please scan the QR code to confirm cancellation.",
            "qr": qr_file_path
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

# -----------------------------
# SCANNER ENDPOINT (Step 2: Mobile Scanner hits this)
# -----------------------------
@api_view(['GET']) # POST thevaiyillai
def mark_as_scanned(request, spot_id):
    try:
        # Latest active reservation-ah eduthu is_scanned update panrom
        res = Reservation.objects.filter(spot_id=spot_id, is_scanned=False).last()
        
        if res:
            res.is_scanned = True
            res.save()
            # Mobile-la scan pannavangaluku intha message mattum theriyum
            return Response("<h1>Scan Success! Reservation marked for cancellation.</h1>")
        
        return Response("<h1>Already scanned or No active reservation found.</h1>")
    except Exception as e:
        return Response(f"<h1>Error: {str(e)}</h1>", status=500)
# -----------------------------
# POLLING ENDPOINT (Step 3: Frontend keeps asking this)
# -----------------------------
# views.py
@api_view(['GET'])
def check_scan_status(request, spot_id):
    # active-ah irukura record, mobile-la scan aanatha mattum edukkurom
    res = Reservation.objects.filter(spot_id=spot_id, is_scanned=True).first()
    
    if res:
        # Success message-ah variable-la vechikonga
        data = {"is_scanned": True}
        
        # Database-la irunthu antha record-ah delete pannidunga (Very Important)
        res.delete()
        
        # Ippo Response anupunga
        return Response(data)
    
    return Response({"is_scanned": False})

@api_view(['POST'])
def create_employee(request):
    serializer = EmployeeSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)