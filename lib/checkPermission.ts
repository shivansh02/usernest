export function CheckPermissions(permissions: string[], userPermissions: string[]) {
    return permissions.every(permission => userPermissions.includes(permission));
}