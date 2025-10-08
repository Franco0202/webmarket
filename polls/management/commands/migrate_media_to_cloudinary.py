# polls/management/commands/migrate_media_to_cloudinary.py
from django.core.management.base import BaseCommand
from django.core.files import File
from polls.models import product_images
import os

class Command(BaseCommand):
    help = "Re-upload local media files to the current DEFAULT_FILE_STORAGE (Cloudinary)"

    def handle(self, *args, **options):
        qs = product_images.objects.all()
        self.stdout.write(f"Found {qs.count()} product_images")
        for img in qs:
            if not img.image:
                self.stdout.write(f"[SKIP] id={img.pk} no image")
                continue
            # Only proceed if file exists locally
            try:
                local_path = img.image.path
            except Exception as e:
                self.stdout.write(self.style.WARNING(f"[WARN] id={img.pk} image has no local path: {e}"))
                continue

            if not os.path.exists(local_path):
                self.stdout.write(self.style.WARNING(f"[MISSING] id={img.pk} local file not found: {local_path}"))
                continue

            with open(local_path, "rb") as f:
                filename = os.path.basename(img.image.name)
                img.image.save(filename, File(f), save=True)
                self.stdout.write(self.style.SUCCESS(f"[UPLOADED] id={img.pk} -> {img.image.url}"))
