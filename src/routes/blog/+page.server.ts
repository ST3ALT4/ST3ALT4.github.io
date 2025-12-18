import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    // 1. Grab all markdown files from the posts directory
    const paths = import.meta.glob('/src/blogs/*.md', { eager: true });

    const posts = Object.entries(paths).map(([path, file]: [string, any]) => {
        // Extract filename to use as slug
        const slug = path.split('/').pop()?.replace('.md', '');
        return {
            slug,
            ...file.metadata // Title, date, etc.
        };
    });

    // 2. Sort by date (newest first)
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return { posts };
};
