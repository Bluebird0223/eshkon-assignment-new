'use client';

import { useState } from 'react';

export default function UserRoleManager({ userId, currentRole }: any) {
    const [role, setRole] = useState(currentRole);
    const [status, setStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    const updateRole = async () => {
        setStatus('saving');
        try {
            const res = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role })
            });

            if (res.ok) {
                setStatus('success');
                setTimeout(() => setStatus('idle'), 3000);
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        }
    };

    return (
        <div className="flex items-center gap-2">
            <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="border rounded-lg px-3 py-1.5 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                disabled={status === 'saving'}
            >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
                <option value="admin">Admin</option>
                <option value="super_admin">Super Admin</option>
            </select>
            <button
                onClick={updateRole}
                disabled={status === 'saving' || role === currentRole}
                className={`px-4 py-1.5 rounded-lg font-medium transition-all ${status === 'saving' ? 'bg-gray-100 text-black' :
                    status === 'success' ? 'bg-green-500 text-white' :
                        status === 'error' ? 'bg-red-500 text-white' :
                            'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                    }`}
            >
                {status === 'saving' ? 'Saving...' :
                    status === 'success' ? '✓ Saved' :
                        status === 'error' ? 'Error' :
                            'Update'}
            </button>
        </div>
    );
}
