import { notFound } from 'next/navigation';

import { apiFetch } from '@/lib/api-client';

interface PageContent {
  title: string;
  content: string;
}

async function getPage(slug: string): Promise<PageContent | null> {
  try {
    const data = await apiFetch<{ page: PageContent }>(`/pages/${slug}`);
    return data.page;
  } catch (error) {
    console.error(error);
    return null;
  }
}

interface PageProps {
  params: { slug: string };
}

export default async function CmsPage({ params }: PageProps) {
  const page = await getPage(params.slug);
  if (!page) notFound();
  return (
    <article className="prose prose-invert max-w-none">
      <h1>{page.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: page.content }} />
    </article>
  );
}
