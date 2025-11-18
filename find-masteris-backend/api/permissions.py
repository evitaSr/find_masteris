from rest_framework.permissions import BasePermission

from api.models import FindMasterisUser


class IsAdminUser(BasePermission):
    def has_permission(self, request, view):
        token = request.auth
        if token is None:
            return False

        role = token.get('role', '')
        return role == FindMasterisUser.ROLE_ADMIN


class IsHandymanOrAdmin(BasePermission):
    def has_permission(self, request, view):
        token = request.auth
        if token is None:
            return False
        role = token.get('role', '')
        return role == FindMasterisUser.ROLE_HANDYMAN or role == FindMasterisUser.ROLE_HANDYMAN