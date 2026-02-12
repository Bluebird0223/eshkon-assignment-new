import { db } from '@/lib/db';
import { pages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import RichTextEditor from '@/components/editor/RichTextEditor';

export default async function PublicPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const page = await db.query.pages.findFirst({
        where: eq(pages.slug, slug),
    });

    if (!page) notFound();

    // Check if published - but if we want to allow viewing drafts for now we can skip this check
    // or eventually add logic for preview.
    // if (page.status !== 'published') notFound();

    return (
        <main className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
                        {page.title}
                    </h1>
                    <div className="flex items-center justify-center gap-4 text-sm text-gray-500 font-medium">
                        <span>Updated {new Date(page.updatedAt).toLocaleDateString()}</span>
                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                        <span className="capitalize px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold">
                            {page.status}
                        </span>
                    </div>
                </header>

                <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
                    <RichTextEditor
                        content={page.content}
                        editable={false}
                    />
                </div>
            </div>
        </main>
    );
}
