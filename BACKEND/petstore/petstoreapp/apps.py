from django.apps import AppConfig


class PetstoreappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'petstoreapp'

    def ready(self):
        import petstoreapp.signals
