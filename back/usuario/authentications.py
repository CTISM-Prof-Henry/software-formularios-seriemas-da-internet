from rest_framework.authentication import SessionAuthentication
from rest_framework import permissions

class CsrfExemptSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return


class IsAuditorPermission(permissions.BasePermission):
    def has_permission(self, request, view):

        return request.user.is_authenticated and \
               str(request.user.perfil_acesso).lower() == 'auditor'