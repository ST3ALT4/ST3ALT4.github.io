export type Project = {
	slug: string;
	name: string;
	tagline: string;
	description: string;
	stack: string[];
	href: string;
};

export type BlogCategory = 'tech-blog' | 'life-skills' | 'random-stuff';

export interface CategoryInfo {
	slug: BlogCategory;
	title: string;
	description: string;
}

export const BLOG_CATEGORIES: CategoryInfo[] = [
	{
		slug: 'tech-blog',
		title: 'Tech blog',
		description: 'Low-level systems, compilers, GPU internals, and hardware'
	},
	{
		slug: 'life-skills',
		title: 'Life skills',
		description: 'Productivity, learning habits, engineering mindset, and workflow'
	},
	{
		slug: 'random-stuff',
		title: 'random stuff',
		description: 'Curiosities, experiments, and interesting finds'
	}
];

export interface BlogPostMeta {
	slug: string;
	title: string;
	date: string;
	description: string;
	tags: string[];
	author?: string;
	category?: BlogCategory;
}
