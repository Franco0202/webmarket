import os
from pathlib import Path
import environ
from dotenv import load_dotenv

# ✅ BASE DIR
BASE_DIR = Path(__file__).resolve().parent.parent

# ✅ Load environment variables
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))
load_dotenv()

# ✅ Security
SECRET_KEY = os.getenv("SECRET_KEY")
DEBUG = os.getenv("DEBUG", "False") == "True"

ALLOWED_HOSTS = [
    "webmarket-q1am.onrender.com",  # ✅ your Render domain
    "localhost",
    "127.0.0.1",
]

# ✅ Installed apps
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    "django.contrib.sites",
    'polls.apps.PollsConfig',
    'widget_tweaks',
    'corsheaders',
    "django_extensions",
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',
    "rest_framework",
    "rest_framework.authtoken",
    "dj_rest_auth",
    "dj_rest_auth.registration",
    "cloudinary",
    "cloudinary_storage",
]

SITE_ID = 2

# ✅ Middleware
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    "whitenoise.middleware.WhiteNoiseMiddleware",  # ✅ for serving React + static
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
]

ROOT_URLCONF = 'mysite.urls'

# ✅ Templates — include React index.html
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'polls' / 'static'],  # ✅ React build folder
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

print("🔍 CLOUDINARY DEBUG:", {
    "CLOUD_NAME": os.getenv("CLOUDINARY_CLOUD_NAME"),
    "API_KEY": os.getenv("CLOUDINARY_API_KEY"),
    "API_SECRET": os.getenv("CLOUDINARY_API_SECRET"),
})
DEFAULT_FILE_STORAGE = "cloudinary_storage.storage.MediaCloudinaryStorage"

CLOUDINARY_SECURE = True

WSGI_APPLICATION = 'mysite.wsgi.application'

import dj_database_url
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATABASES = {
    'default': dj_database_url.config(
        default=os.getenv("DATABASE_URL"),
        conn_max_age=600,  # optional, keeps connections open
        ssl_require=True   # Render Postgres requires SSL
    )
}

# ✅ Authentication backends
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]

# ✅ Google login
SOCIALACCOUNT_PROVIDERS = {
    "google": {
        "SCOPE": ["profile", "email"],
        "AUTH_PARAMS": {"access_type": "online"},
    }
}
SOCIALACCOUNT_PROVIDERS["google"]["APP"] = {
    "client_id": os.getenv("SOCIAL_AUTH_GOOGLE_OAUTH2_KEY"),
    "secret": os.getenv("SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET"),
    "key": ""
}

LOGIN_REDIRECT_URL = "/"  # ✅ let Django serve React root
LOGOUT_REDIRECT_URL = "/"




# ✅ Email
ACCOUNT_EMAIL_VERIFICATION = "none"
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = env("EMAIL_HOST_USER", default=None)
EMAIL_HOST_PASSWORD = env("EMAIL_HOST_PASSWORD", default=None)
DEFAULT_FROM_EMAIL = f"WebMarket <{EMAIL_HOST_USER}>"

# ✅ REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ],
}


CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOW_CREDENTIALS = True

# ✅ Security (only enable in production)
SECURE_SSL_REDIRECT = not DEBUG
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG

# ✅ i18n
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ✅ Static files (React build)
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'polls' / 'static']
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# Allauth / dj-rest-auth settings
ACCOUNT_USERNAME_REQUIRED = False          # don't require username
ACCOUNT_EMAIL_REQUIRED = True              # require email
ACCOUNT_AUTHENTICATION_METHOD = "email"   # login using email
ACCOUNT_USER_MODEL_USERNAME_FIELD = None

