<script lang="ts">
	import type { BlogPostMeta } from '$lib/types';

	let { title, date, tags = [], slug, description, category }: BlogPostMeta = $props();

	let formattedDate = $derived.by(() => {
		if (!date) return '';
		const parsed = new Date(date);
		return isNaN(parsed.getTime())
			? date
			: parsed.toLocaleDateString('en-US', {
					year: 'numeric',
					month: 'short',
					day: 'numeric'
				});
	});
</script>

<article class="blog-entry-card">
	<div class="entry-status-bar">
		<span class="file-perm">-rw-r--r--</span>
		<span class="file-slug">{slug}.md</span>
		{#if category}
			<span class="file-cat">[{category}]</span>
		{/if}
		{#if formattedDate}
			<time datetime={date} class="entry-date">{formattedDate}</time>
		{/if}
	</div>

	<div class="entry-main-body">
		<a href={`/blog/${slug}`} class="entry-title-link">
			<span class="prompt-arrow">></span>
			<h2 class="entry-title">{title}</h2>
		</a>

		{#if description}
			<p class="entry-desc">{description}</p>
		{/if}

		{#if tags && tags.length > 0}
			<div class="tags-container">
				<span class="tags-label">tags:</span>
				<div class="tags-list">
					{#each tags as tag (tag)}
						<span class="tag-item">#{tag}</span>
					{/each}
				</div>
			</div>
		{/if}
	</div>
</article>

<style>
	.blog-entry-card {
		background-color: var(--bg-surface);
		border: 1px solid var(--line-color);
		display: flex;
		flex-direction: column;
		transition: all 0.15s ease;
	}

	.blog-entry-card:hover {
		border-color: var(--primary-color);
		transform: translateY(-1px);
	}

	.entry-status-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.6rem;
		padding: 0.45rem 1rem;
		background-color: var(--bg-raised);
		border-bottom: 1px solid var(--line-color);
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.file-perm {
		color: var(--line-bright);
		letter-spacing: 0.05em;
	}

	.file-slug {
		color: var(--text-color);
		font-weight: 600;
	}

	.file-cat {
		color: var(--primary-color);
	}

	.entry-date {
		margin-left: auto;
		color: var(--text-muted);
	}

	.entry-main-body {
		padding: 1.25rem 1rem;
		display: flex;
		flex-direction: column;
		gap: 0.65rem;
	}

	@media (min-width: 640px) {
		.entry-main-body {
			padding: 1.5rem 1.25rem;
		}
	}

	.entry-title-link {
		display: inline-flex;
		align-items: baseline;
		gap: 0.5rem;
		text-decoration: none;
		color: var(--text-color);
		align-self: flex-start;
	}

	.prompt-arrow {
		color: var(--primary-color);
		font-weight: 700;
	}

	.entry-title {
		font-size: 1.15rem;
		font-weight: 700;
		margin: 0;
		color: var(--text-color);
		line-height: 1.3;
		transition: color 0.15s ease;
	}

	.entry-title-link:hover .entry-title {
		color: var(--primary-color);
		text-decoration: underline;
	}

	.entry-desc {
		font-size: 0.88rem;
		color: var(--text-color);
		line-height: 1.6;
		margin: 0;
	}

	.tags-container {
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
		font-size: 0.75rem;
		margin-top: 0.25rem;
	}

	.tags-label {
		color: var(--text-muted);
	}

	.tags-list {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.tag-item {
		color: var(--primary-color);
		background-color: var(--primary-muted);
		padding: 0.05rem 0.35rem;
		border-radius: 2px;
	}
</style>
