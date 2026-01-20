from django.contrib import admin
from .models import Reservation, MonthlyPass, YearlyPass # Unga models-ah import pannunga

admin.site.register(Reservation)
admin.site.register(MonthlyPass)
admin.site.register(YearlyPass)