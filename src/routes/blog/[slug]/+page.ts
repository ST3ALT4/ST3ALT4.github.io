import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

const posts = import.meta.glob('../../../blogs/*.md');

export const load: PageLoad = async ({ params }) => {
	const path = `../../../blogs/${params.slug}.md`;
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

export function entries() {
	return Object.keys(posts).map((path) => ({
		slug: path.split('/').pop()?.replace('.md', '')
	}));
}

