export type Project = {
	slug: string;
	name: string;
	tagline: string;
	description: string;
	stack: string[];
	href: string;
};

// PLACEHOLDER DATA — replace with your real projects
export const projects: Project[] = [
	{
		slug: 'example-project',
		name: 'Example Project',
		tagline: 'A short one-line description goes here.',
		description:
			'Swap this out with a couple of sentences on what the project does, why you built it, and anything interesting you ran into along the way.',
		stack: ['C', 'x86'],
		href: 'https://github.com/ST3ALT4/example-project'
	},
	{
		slug: 'another-project',
		name: 'Another Project',
		tagline: 'A short one-line description goes here.',
		description: 'Same idea — replace with real project details. Two or three sentences is plenty.',
		stack: ['Rust'],
		href: 'https://github.com/ST3ALT4/another-project'
	}
];
