export const ROUTES = {
	home: {
		index: '/',
		blogList: '/blog',
		blog: (slug: string) => `/blog/${slug}`
	}
} as const;
