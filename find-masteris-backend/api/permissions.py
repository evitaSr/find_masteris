from rest_framework.permissions import BasePermission


class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        token = request.auth
        if token is None:
            return False

        role = token.get('role', '')
        return role == 'admin'