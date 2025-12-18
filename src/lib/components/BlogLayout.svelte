<script lang="ts">
	let { title, date, tags, children } = $props();
</script>

<article class="blog-container">
	<nav class="nav-top">
		<a href="/blog" class="back-link">← All posts</a>
	</nav>

	<header class="article-header">
		<h1 class="article-title">{title}</h1>

		<div class="meta-container">
			<time datetime={date}>
				{new Date(date).toLocaleDateString('en-US', { dateStyle: 'long' })}
			</time>

			{#if tags?.length}
				<span class="separator">•</span>
				<ul class="tags-wrapper">
					{#each tags as tag}
						<li class="tag">#{tag}</li>
					{/each}
				</ul>
			{/if}
		</div>
	</header>

	<section class="content-body prose prose-lg prose-invert">
		{@render children()}
	</section>

	<footer class="article-footer">
		<a href="/blog" class="back-link">← Back to all posts</a>
	</footer>
</article>

<style>
	@reference "tailwindcss";

	.blog-container {
		@apply mx-auto max-w-[70ch] px-6 py-24;
	}

	/* --- Navigation --- */
	.nav-top {
		@apply mb-16;
	}

	.back-link {
		@apply inline-flex items-center font-mono text-sm transition-colors;
		color: color-mix(in srgb, var(--text-color), transparent 50%);
	}

	.back-link:hover {
		color: var(--primary-color);
	}

	/* --- Header --- */
	.article-header {
		@apply mb-20;
	}

	.article-title {
		@apply mb-6 text-4xl leading-tight font-bold tracking-tight md:text-5xl;
		color: var(--text-color);
	}

	.meta-container {
		@apply flex flex-wrap items-center gap-3 font-mono text-sm;
		color: color-mix(in srgb, var(--text-color), transparent 45%);
	}

	.separator {
		@apply select-none;
	}

	.tags-wrapper {
		@apply flex flex-wrap gap-2;
	}

	.tag {
		@apply rounded-md px-2 py-0.5 text-xs;
		background-color: color-mix(in srgb, var(--primary-color), transparent 85%);
		color: var(--primary-color);
	}

	/* --- Content --- */
	.content-body {
		@apply mt-12;
	}

	.content-body :global(h2) {
		@apply mt-16 mb-4;
	}

	.content-body :global(h3) {
		@apply mt-12 mb-3;
	}

	.content-body :global(p),
	.content-body :global(li) {
		color: color-mix(in srgb, var(--text-color), transparent 20%);
	}

	.content-body :global(a) {
		color: var(--primary-color);
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
	}

	.content-body :global(pre) {
		@apply my-8 rounded-lg border p-4;
		background-color: #0f0f0f;
		border-color: color-mix(in srgb, var(--text-color), transparent 85%);
	}

	.content-body :global(code) {
		color: var(--primary-color);
	}

	/* --- Footer --- */
	.article-footer {
		@apply mt-32 border-t pt-12;
		border-color: color-mix(in srgb, var(--text-color), transparent 85%);
	}
</style>
