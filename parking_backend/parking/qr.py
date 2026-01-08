# qr.py
import qrcode
import os
from django.conf import settings

def generate_qr(data, file_name="cancel_qr.png"):
    # Ensure media/qr folder exists
    qr_dir = os.path.join(settings.MEDIA_ROOT, "qr")
    os.makedirs(qr_dir, exist_ok=True)

    file_path = os.path.join(qr_dir, file_name)

    qr = qrcode.make(data)
    qr.save(file_path)

    # This path is what frontend will use
    return f"media/qr/{file_name}"
