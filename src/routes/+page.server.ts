import type { PageServerLoad } from './$types';
import type { BlogPostMeta, BlogCategory } from '$lib/types';

export const prerender = true;

export const load: PageServerLoad = async () => {
	const paths = import.meta.glob<{ metadata?: Partial<BlogPostMeta> }>('/src/blogs/*.md', {
		eager: true
	});

	const posts: BlogPostMeta[] = Object.entries(paths).map(([path, file]) => {
		const slug = path.split('/').pop()?.replace('.md', '') ?? '';
		const meta = file.metadata;
		return {
			slug,
			title: meta?.title ?? slug,
			date: meta?.date ?? '',
			description: meta?.description ?? '',
			tags: meta?.tags ?? [],
			author: meta?.author ?? 'Anikait',
			category: (meta?.category as BlogCategory) ?? 'tech-blog'
		};
	});

	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	const projectPosts = posts.filter((post) =>
		post.tags.some((tag) => tag.toLowerCase() === 'project')
	);

	return {
		projectPosts
	};
};
