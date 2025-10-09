from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

class Command(BaseCommand):
    help = "Create a default superuser if it doesn’t exist"

    def handle(self, *args, **options):
        User = get_user_model()
        username = "franc"
        email = "francocollares@gmail.com"
        password = "kirby12"

        if not User.objects.filter(username=username).exists():
            User.objects.create_superuser(username, email, password)
            self.stdout.write(self.style.SUCCESS("Superuser created!"))
        else:
            self.stdout.write("Superuser already exists.")
