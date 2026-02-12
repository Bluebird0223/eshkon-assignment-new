'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/editor/RichTextEditor';
import { hasPermission, type Role } from '@/lib/auth/permissions';

export default function PageEditorClient({ initialPage, userRole }: { initialPage: any; userRole: Role }) {
    const [page, setPage] = useState(initialPage);
    const [content, setContent] = useState(initialPage.content);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    const save = async (status: string) => {
        setSaving(true);
        try {
            const res = await fetch(`/api/pages/${page.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, status, version: page.version + 1 })
            });
            if (res.ok) {
                const updated = await res.json();
                setPage(updated);
                router.refresh();
                alert('Success!');
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-black">{page.title}</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => save('draft')}
                        disabled={saving}
                        className="px-4 py-2 text-black bg-gray-100 rounded hover:bg-gray-200"
                    >
                        Save Draft
                    </button>
                    {hasPermission(userRole, 'page:preview') && (
                        <button
                            onClick={() => save('preview')}
                            disabled={saving}
                            className="px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                        >
                            Preview
                        </button>
                    )}
                    {hasPermission(userRole, 'page:publish') && (
                        <button
                            onClick={() => save('published')}
                            disabled={saving}
                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                            Publish
                        </button>
                    )}
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <RichTextEditor content={content} onChange={setContent} />
            </div>
        </div>
    );
}
