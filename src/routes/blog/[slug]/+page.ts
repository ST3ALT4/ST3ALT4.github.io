export async function load({ params }) {
	const post = await import(`../../../content/blog/${params.slug}.md`);
	return {
		Content: post.default,
		meta: post.metadata
	};
}

export async function entries() {
	const modules = import.meta.glob('../../../content/blog/*.md');

	return Object.keys(modules).map((path) => ({
		slug: path.split('/').pop()?.replace('.md', '')
	}));
}

export const prerender = true;
;
