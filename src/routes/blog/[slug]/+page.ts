import type { PageLoad, EntryGenerator } from './$types';
import { error } from '@sveltejs/kit';
import type { Component } from 'svelte';
import type { BlogPostMeta } from '$lib/types';

interface PostModule {
	default: Component;
	metadata: BlogPostMeta;
}

const posts = import.meta.glob<PostModule>('/src/blogs/*.md');

export const load: PageLoad = async ({ params }) => {
	const path = `/src/blogs/${params.slug}.md`;
	const loader = posts[path];

	if (!loader) {
		throw error(404, 'Post not found');
	}

	const post = await loader();

	return {
		Content: post.default,
		meta: post.metadata
	};
};

export const prerender = true;

export const entries: EntryGenerator = () => {
	return Object.keys(posts).map((path) => {
		const slug = path.split('/').pop()?.replace('.md', '') ?? '';
		return { slug };
	});
};
