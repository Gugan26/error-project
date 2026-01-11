# qr.py
import qrcode
import os
from django.conf import settings

def generate_qr(spot_id):
    # Media/qr folder check
    qr_dir = os.path.join(settings.MEDIA_ROOT, "qr")
    os.makedirs(qr_dir, exist_ok=True)
    
    file_name = f"cancel_{spot_id}.png"
    file_path = os.path.join(qr_dir, file_name)

    # UNGA UBUNTU IP: 10.154.53.101
    # Mobile-la scan panna intha link thaan open aagum
    api_link = f"http://10.154.53.101:8000/api/mark_as_scanned/{spot_id}/"
    
    qr = qrcode.make(api_link)
    qr.save(file_path)

    # Frontend use panna path-a return pannuthu
    return f"media/qr/{file_name}"