from rest_framework import serializers
from .models import Reservation, MonthlyPass, YearlyPass,Employee

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = "__all__"


class MonthlyPassSerializer(serializers.ModelSerializer):
    class Meta:
        model = MonthlyPass
        fields = "__all__"


class YearlyPassSerializer(serializers.ModelSerializer):
    class Meta:
        model = YearlyPass
        fields = "__all__"

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = "__all__"

