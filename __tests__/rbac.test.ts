import { describe, it, expect } from 'vitest';
import { hasPermission, rolePermissions, Role } from '../lib/auth';

describe('RBAC Permissions', () => {
    it('should grant all permissions to super_admin', () => {
        expect(hasPermission('super_admin', 'page:view')).toBe(true);
        expect(hasPermission('super_admin', 'page:publish')).toBe(true);
        expect(hasPermission('super_admin', 'user:manage')).toBe(true);
        expect(hasPermission('super_admin', 'random:permission')).toBe(true);
    });

    it('should grant view only to viewer', () => {
        expect(hasPermission('viewer', 'page:view')).toBe(true);
        expect(hasPermission('viewer', 'page:create')).toBe(false);
        expect(hasPermission('viewer', 'page:publish')).toBe(false);
    });

    it('should grant specific permissions to editor', () => {
        expect(hasPermission('editor', 'page:view')).toBe(true);
        expect(hasPermission('editor', 'page:create')).toBe(true);
        expect(hasPermission('editor', 'page:edit')).toBe(true);
        expect(hasPermission('editor', 'page:publish')).toBe(false);
    });

    it('should grant administrative permissions to admin', () => {
        expect(hasPermission('admin', 'page:publish')).toBe(true);
        expect(hasPermission('admin', 'user:manage')).toBe(true);
        expect(hasPermission('admin', 'page:delete')).toBe(true);
    });

    it('should return false for unknown roles or permissions', () => {
        // @ts-ignore
        expect(hasPermission('guest', 'page:view')).toBe(false);
        expect(hasPermission('viewer', 'non-existent')).toBe(false);
    });
});
