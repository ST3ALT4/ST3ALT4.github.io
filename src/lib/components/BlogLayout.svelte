<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		title?: string;
		date?: string;
		tags?: string[];
		category?: string;
		author?: string;
		children?: Snippet;
	}

	let { title, date, tags = [], category, author, children }: Props = $props();

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

<article class="post-terminal-card">
	<!-- Terminal Window Titlebar -->
	<div class="window-bar">
		<div class="window-dots" aria-hidden="true">
			<span class="dot d-r"></span>
			<span class="dot d-y"></span>
			<span class="dot d-g"></span>
		</div>
		<span class="window-title">viewing: {title || 'post.md'}</span>
		<a href="/blog" class="window-back-link">← cd .. (/blog)</a>
	</div>

	<!-- Post Content Wrapper -->
	<div class="post-inner">
		<header class="post-header">
			{#if title}
				<h1 class="post-title">{title}</h1>
			{/if}

			<div class="post-meta-row">
				{#if formattedDate}
					<span class="meta-item">
						<span class="meta-k">date:</span>
						<time datetime={date} class="meta-v">{formattedDate}</time>
					</span>
				{/if}
				{#if author}
					<span class="meta-item">
						<span class="meta-k">author:</span>
						<span class="meta-v">{author}</span>
					</span>
				{/if}
				{#if category}
					<span class="meta-item">
						<span class="meta-k">category:</span>
						<span class="meta-v highlight">/{category}</span>
					</span>
				{/if}
				{#if tags && tags.length > 0}
					<div class="meta-tags">
						{#each tags as tag (tag)}
							<span class="tag-chip">#{tag}</span>
						{/each}
					</div>
				{/if}
			</div>
		</header>

		<div class="post-body">
			{#if children}
				{@render children()}
			{/if}
		</div>

		<footer class="post-footer">
			<div class="footer-actions">
				<a href="/blog" class="back-link">← return to blog directory</a>
				<span class="footer-note">// end of buffer</span>
			</div>
		</footer>
	</div>
</article>

<style>
	.post-terminal-card {
		width: 100%;
		max-width: 960px;
		margin: 0 auto;
		background-color: var(--bg-surface);
		border: 1px solid var(--line-color);
		display: flex;
		flex-direction: column;
	}

	.window-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.6rem 1rem;
		background-color: var(--bg-raised);
		border-bottom: 1px solid var(--line-color);
		font-size: 0.8rem;
		gap: 1rem;
	}

	.window-dots {
		display: flex;
		gap: 0.35rem;
		align-items: center;
	}

	.dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
	}

	.d-r {
		background-color: #ef4444;
	}
	.d-y {
		background-color: #f59e0b;
	}
	.d-g {
		background-color: #10b981;
	}

	.window-title {
		color: var(--text-color);
		font-weight: 600;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.window-back-link {
		color: var(--primary-color);
		text-decoration: none;
		font-size: 0.78rem;
		white-space: nowrap;
	}

	.window-back-link:hover {
		text-decoration: underline;
	}

	.post-inner {
		padding: 2rem 1.25rem 3rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	@media (min-width: 640px) {
		.post-inner {
			padding: 3rem 2.5rem 4rem;
		}
	}

	.post-header {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		border-bottom: 1px solid var(--line-color);
		padding-bottom: 1.5rem;
	}

	.post-title {
		font-size: clamp(1.8rem, 4vw, 2.5rem);
		font-weight: 700;
		color: var(--text-color);
		line-height: 1.2;
		margin: 0;
		letter-spacing: -0.01em;
	}

	.post-meta-row {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 1rem;
		font-size: 0.825rem;
		color: var(--text-muted);
	}

	.meta-item {
		display: inline-flex;
		align-items: baseline;
		gap: 0.3rem;
	}

	.meta-k {
		color: var(--text-muted);
	}

	.meta-v {
		color: var(--text-color);
	}

	.meta-v.highlight {
		color: var(--primary-color);
		font-weight: 600;
	}

	.meta-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.tag-chip {
		color: var(--primary-color);
		background-color: var(--primary-muted);
		padding: 0.05rem 0.35rem;
		font-size: 0.75rem;
		border-radius: 2px;
	}

	.post-body {
		font-size: 1rem;
		line-height: 1.8;
		color: var(--text-color);
		max-width: 78ch;
	}

	.post-body :global(h1),
	.post-body :global(h2),
	.post-body :global(h3),
	.post-body :global(h4) {
		color: var(--text-color);
		font-weight: 700;
		margin-top: 2.25rem;
		margin-bottom: 0.85rem;
		line-height: 1.3;
	}

	.post-body :global(h2) {
		font-size: 1.45rem;
		border-bottom: 1px dashed var(--line-color);
		padding-bottom: 0.4rem;
	}

	.post-body :global(h3) {
		font-size: 1.2rem;
	}

	.post-body :global(p) {
		margin-top: 0;
		margin-bottom: 1.35rem;
	}

	.post-body :global(ul),
	.post-body :global(ol) {
		margin-top: 0;
		margin-bottom: 1.35rem;
		padding-left: 1.75rem;
	}

	.post-body :global(li) {
		margin-bottom: 0.4rem;
	}

	.post-body :global(a) {
		color: var(--primary-color);
		text-decoration: underline;
		text-underline-offset: 3px;
	}

	.post-body :global(blockquote) {
		border-left: 2px solid var(--primary-color);
		background-color: var(--bg-raised);
		padding: 0.75rem 1.25rem;
		margin: 1.75rem 0;
		color: var(--text-muted);
		font-style: italic;
	}

	.post-body :global(code) {
		font-family: var(--font-mono);
		background-color: var(--bg-raised);
		border: 1px solid var(--line-color);
		padding: 0.15rem 0.35rem;
		font-size: 0.88em;
		color: var(--primary-color);
	}

	.post-body :global(pre) {
		background-color: var(--bg-surface);
		border: 1px solid var(--line-color);
		padding: 1.25rem;
		overflow-x: auto;
		margin: 1.75rem 0;
		font-size: 0.88rem;
		line-height: 1.55;
	}

	.post-body :global(pre code) {
		background: none;
		border: none;
		padding: 0;
		color: var(--text-color);
	}

	.post-body :global(hr) {
		border: none;
		border-top: 1px dashed var(--line-color);
		margin: 2.5rem 0;
	}

	.post-footer {
		border-top: 1px solid var(--line-color);
		padding-top: 1.5rem;
		font-size: 0.85rem;
	}

	.footer-actions {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.back-link {
		color: var(--primary-color);
		text-decoration: none;
	}

	.back-link:hover {
		text-decoration: underline;
	}

	.footer-note {
		color: var(--text-muted);
		font-size: 0.78rem;
	}
</style>
