# qr.py
import qrcode
import os
from django.conf import settings

# qr.py
def generate_qr(spot_id):
    qr_dir = os.path.join(settings.MEDIA_ROOT, "qr")
    os.makedirs(qr_dir, exist_ok=True)
    
    file_name = f"cancel_{spot_id}.png"
    file_path = os.path.join(qr_dir, file_name)

    # Typo fixed (42S -> 42) and URL aligned with urls.py
    # Unga main urls.py-la 'api/' prefix iruntha ithu correct
    api_link = f"http://10.154.53.42:8000/api/mark_as_scanned/{spot_id}/"
    
    qr = qrcode.make(api_link)
    qr.save(file_path)
    return f"media/qr/{file_name}"