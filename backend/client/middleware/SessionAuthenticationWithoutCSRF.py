from rest_framework.authentication import SessionAuthentication

class SessionAuthenticationWithoutCSRF(SessionAuthentication):
    """
    Used just for the purpose of disabling CSRF validation.
    Don't use this in production.
    """
    def enforce_csrf(self, request):
        pass