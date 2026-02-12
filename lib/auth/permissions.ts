export const rolePermissions = {
    viewer: ['page:view'],
    editor: ['page:view', 'page:create', 'page:edit', 'page:preview'],
    admin: ['page:view', 'page:create', 'page:edit', 'page:preview', 'page:publish', 'page:delete', 'user:manage'],
    super_admin: ['*']
} as const;

export type Role = keyof typeof rolePermissions;
export type Permission = typeof rolePermissions[Role][number];

export const hasPermission = (role: Role, permission: string): boolean => {
    if (role === 'super_admin') return true;
    return rolePermissions[role]?.includes(permission as any) || false;
};
