from django.urls import path
from .views import (
    create_reservation,
    create_monthly_pass,
    create_yearly_pass,
    cancel_reservation, 
    create_employee,
)

urlpatterns = [
    path("reserve/", create_reservation, name="reserve"),
    path("create_monthly_pass/", create_monthly_pass, name="monthly-pass"),
    path("yearly-pass/", create_yearly_pass, name="yearly-pass"),
    path("cancel-reservation/", cancel_reservation, name="cancel-reservation"),
    path("new-employee/", create_employee,name='create_employee'),
]
