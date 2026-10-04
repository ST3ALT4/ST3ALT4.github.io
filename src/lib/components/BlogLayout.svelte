<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { goto } from '$app/navigation';
	import { ROUTES } from '$lib/routes';

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

	let fileSlug = $derived.by(() => {
		if (!title) return 'post';
		return title
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, '-')
			.replace(/^-|-$/g, '');
	});

	onMount(() => {
		function handleKeyDown(e: KeyboardEvent) {
			if (
				e.target instanceof HTMLInputElement ||
				e.target instanceof HTMLTextAreaElement ||
				e.target instanceof HTMLSelectElement
			) {
				return;
			}
			if (e.key === 'q' || e.key === 'Q') {
				goto(ROUTES.home.blogList);
			}
		}
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	});
</script>

<div class="terminal-window post-window">
	<!-- Neovim Buffer Body -->
	<div class="terminal-body post-buffer">
		<!-- Top command invocation -->
		<div class="cmd-line post-cmd">
			<span class="prompt-user">st3alt4</span><span class="prompt-colon">:</span><span
				class="prompt-path">~/blog</span
			><span class="prompt-char">$</span>
			<span class="cmd-text">nvim {fileSlug}.md</span>
			<span class="cmd-meta">[buffer: readonly]</span>
		</div>

		<!-- Post Header metadata -->
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

		<!-- Rendered Markdown Body -->
		<div class="post-body">
			{#if children}
				{@render children()}
			{/if}
		</div>

		<!-- Vim Statusline -->
		<div class="vim-statusline">
			<div class="vim-left">
				<span class="vim-mode">NORMAL</span>
				<span class="vim-filename">"{fileSlug}.md"</span>
				<span class="vim-flag">[RO]</span>
			</div>
			<div class="vim-right">
				<span class="vim-item">utf-8</span>
				<span class="vim-item">markdown</span>
				<span class="vim-item">100%</span>
				<a href={ROUTES.home.blogList} class="vim-exit-action" title="Exit buffer"> :q (exit) </a>
			</div>
		</div>
	</div>
</div>

<style>
	.post-window {
		width: 100%;
		border-radius: 0;
	}

	.post-buffer {
		max-width: 960px;
		margin: 0 auto;
		width: 100%;
		box-sizing: border-box;
		padding: 1.5rem 1.25rem 2rem;
		display: flex;
		flex-direction: column;
		gap: 1.75rem;
	}

	@media (min-width: 640px) {
		.post-buffer {
			padding: 2.25rem 2.25rem 2.5rem;
			gap: 2rem;
		}
	}

	.post-cmd {
		border-bottom: 1px dashed var(--line-color);
		padding-bottom: 1rem;
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

	/* Markdown Content Typography */
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
		background-color: var(--bg-raised);
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

	/* Vim Statusline */
	.vim-statusline {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.4rem 0.75rem;
		background-color: var(--bg-raised);
		border: 1px solid var(--line-color);
		font-size: 0.75rem;
		margin-top: 1.5rem;
		font-family: var(--font-mono);
	}

	.vim-left,
	.vim-right {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
	}

	.vim-mode {
		background-color: var(--primary-color);
		color: var(--bg-color);
		font-weight: 700;
		padding: 0.05rem 0.4rem;
		letter-spacing: 0.05em;
	}

	.vim-filename {
		color: var(--text-color);
		font-weight: 600;
	}

	.vim-flag {
		color: var(--text-muted);
	}

	.vim-item {
		color: var(--text-muted);
	}

	.vim-exit-action {
		color: var(--primary-color);
		text-decoration: none;
		font-weight: 600;
	}

	.vim-exit-action:hover {
		text-decoration: underline;
	}
</style>
