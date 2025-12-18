export const ROUTES = {
  home: {
    index: '/',
    projects: '/projects',
    blogList: '/blog',
    blog: (id: number | string) => `/blog/${id}`
  }
} as const;

