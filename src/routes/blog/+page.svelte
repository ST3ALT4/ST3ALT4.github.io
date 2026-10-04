<script lang="ts">
	import { onMount } from 'svelte';
	import BlogCard from '$lib/components/BlogCard.svelte';
	import { BLOG_CATEGORIES, type BlogPostMeta } from '$lib/types';

	let { data }: { data: { posts: BlogPostMeta[] } } = $props();

	let selectedCategory = $state('all');
	let searchQuery = $state('');

	onMount(() => {
		const hash = window.location.hash.replace('#', '');
		const params = new URLSearchParams(window.location.search);
		const catParam = params.get('cat') || hash;
		if (catParam && (catParam === 'all' || BLOG_CATEGORIES.some((c) => c.slug === catParam))) {
			selectedCategory = catParam;
		}
	});

	function selectCategory(slug: string) {
		selectedCategory = slug;
		if (slug === 'all') {
			window.history.replaceState({}, '', '/blog');
		} else {
			window.history.replaceState(
				{},
				'',
				`/blog?cat=${encodeURIComponent(slug)}#${encodeURIComponent(slug)}`
			);
		}
	}

	let filteredPosts = $derived.by(() => {
		let list = data.posts;
		if (selectedCategory !== 'all') {
			list = list.filter((p) => p.category === selectedCategory);
		}
		if (searchQuery.trim() !== '') {
			const q = searchQuery.toLowerCase().trim();
			list = list.filter(
				(p) =>
					p.title.toLowerCase().includes(q) ||
					p.description.toLowerCase().includes(q) ||
					p.tags.some((t) => t.toLowerCase().includes(q))
			);
		}
		return list;
	});
</script>

<div class="terminal-window">
	<!-- Terminal Body -->
	<div class="terminal-body">
		<!-- Main Command Header -->
		<header class="blog-cmd-header">
			<div class="cmd-line">
				<span class="prompt-user">st3alt4</span><span class="prompt-colon">:</span><span
					class="prompt-path">~/blog</span
				><span class="prompt-char">$</span>
				<h1 class="cmd-text">ls -la</h1>
				<span class="cmd-meta">[{data.posts.length} entries indexed]</span>
			</div>
			<p class="cmd-desc">
				// technical explorations, compiler logs, GPU benchmarks, and engineering thoughts
			</p>
		</header>

		<!-- Main Split Layout -->
		<div class="blog-layout-split">
			<!-- Left Sidebar: Directory Tree & Grep Search -->
			<aside class="blog-sidebar">
				<!-- Directory Tree Pane -->
				<div class="sidebar-panel">
					<div class="panel-header">
						<span class="prompt-char">$</span>
						<span class="header-text">tree -d categories/</span>
					</div>

					<nav class="category-nav" aria-label="Blog categories">
						<button
							id="all"
							type="button"
							class="cat-nav-btn"
							class:active={selectedCategory === 'all'}
							onclick={() => selectCategory('all')}
						>
							<span class="tree-char">├──</span>
							<span class="cat-slug">all/</span>
							<span class="cat-count">({data.posts.length})</span>
						</button>

						{#each BLOG_CATEGORIES as category, index (category.slug)}
							{@const count = data.posts.filter((p) => p.category === category.slug).length}
							<button
								id={category.slug}
								type="button"
								class="cat-nav-btn"
								class:active={selectedCategory === category.slug}
								onclick={() => selectCategory(category.slug)}
							>
								<span class="tree-char">{index === BLOG_CATEGORIES.length - 1 ? '└──' : '├──'}</span
								>
								<span class="cat-slug">{category.slug}/</span>
								<span class="cat-count">({count})</span>
							</button>
						{/each}
					</nav>
				</div>

				<!-- Live Grep Filter Box -->
				<div class="sidebar-panel">
					<div class="panel-header">
						<span class="prompt-char">$</span>
						<label for="grep-input" class="header-text">grep -i pattern</label>
						<span class="shortcut-tip"><kbd>/</kbd></span>
					</div>
					<div class="grep-input-wrap">
						<input
							id="grep-input"
							type="text"
							bind:value={searchQuery}
							placeholder="filter title, tags..."
							class="terminal-input"
						/>
						{#if searchQuery}
							<button
								type="button"
								class="clear-btn"
								onclick={() => (searchQuery = '')}
								title="Clear search"
							>
								[✕]
							</button>
						{/if}
					</div>
				</div>

				<!-- Quick Info Box -->
				<div class="sidebar-info-box">
					<span class="info-title">// publication status</span>
					<p class="info-text">
						Articles are written in Markdown with MDSveX. Posts tagged with <code class="code-tag"
							>project</code
						>
						appear under <code>$ ls projects/</code> on the home page.
					</p>
				</div>
			</aside>

			<!-- Right Column: Articles Feed -->
			<main class="blog-feed-section">
				<div class="feed-header-bar">
					<span class="feed-status">
						<span class="status-dot">●</span>
						filter: <span class="highlight">{selectedCategory}</span>
						{#if searchQuery}
							<span class="search-badge">grep: "{searchQuery}"</span>
						{/if}
					</span>
					<span class="feed-count">
						{filteredPosts.length} file{filteredPosts.length === 1 ? '' : 's'}
					</span>
				</div>

				{#if filteredPosts.length > 0}
					<div class="cards-grid">
						{#each filteredPosts as post (post.slug)}
							<BlogCard {...post} />
						{/each}
					</div>
				{:else}
					<div class="empty-feed-card">
						<span class="empty-prompt">exit 1: no matching files found</span>
						<p class="empty-hint">Try adjusting your category filter or search query.</p>
						<button
							type="button"
							class="reset-btn"
							onclick={() => {
								selectedCategory = 'all';
								searchQuery = '';
							}}
						>
							[reset filters]
						</button>
					</div>
				{/if}
			</main>
		</div>

		<!-- Active bottom prompt line -->
		<div class="terminal-active-line" aria-hidden="true">
			<span class="prompt-user">st3alt4</span><span class="prompt-colon">:</span><span
				class="prompt-path">~/blog</span
			><span class="prompt-char">$</span>
			<span class="cursor">█</span>
		</div>
	</div>
</div>

<style>
	.terminal-body {
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
		box-sizing: border-box;
		padding: 1.5rem 1.25rem 2rem;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	@media (min-width: 768px) {
		.terminal-body {
			padding: 2.25rem 2rem 2.5rem;
			gap: 2.5rem;
		}
	}

	.blog-cmd-header {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		border-bottom: 1px dashed var(--line-color);
		padding-bottom: 1.25rem;
	}

	.cmd-desc {
		color: var(--text-muted);
		font-size: 0.85rem;
		margin: 0;
		font-style: italic;
	}

	/* Split Layout */
	.blog-layout-split {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	@media (min-width: 860px) {
		.blog-layout-split {
			grid-template-columns: 280px 1fr;
			align-items: start;
		}
	}

	/* Sidebar */
	.blog-sidebar {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.sidebar-panel {
		background-color: var(--bg-raised);
		border: 1px solid var(--line-color);
		display: flex;
		flex-direction: column;
	}

	.panel-header {
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
		padding: 0.5rem 0.75rem;
		background-color: var(--bg-surface);
		border-bottom: 1px solid var(--line-color);
		font-size: 0.8rem;
	}

	.header-text {
		color: var(--text-color);
		font-weight: 600;
	}

	.shortcut-tip {
		margin-left: auto;
	}

	.category-nav {
		display: flex;
		flex-direction: column;
		padding: 0.5rem 0;
	}

	.cat-nav-btn {
		background: none;
		border: none;
		padding: 0.4rem 0.75rem;
		text-align: left;
		font-family: var(--font-mono);
		font-size: 0.825rem;
		color: var(--text-muted);
		cursor: pointer;
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		transition: all 0.15s ease;
	}

	.cat-nav-btn:hover {
		color: var(--primary-color);
		background-color: var(--bg-surface);
	}

	.cat-nav-btn.active {
		color: var(--primary-color);
		font-weight: 700;
		background-color: color-mix(in srgb, var(--primary-color), transparent 90%);
	}

	.tree-char {
		color: var(--line-bright);
		user-select: none;
	}

	.cat-slug {
		flex: 1;
	}

	.cat-count {
		color: var(--text-muted);
		font-size: 0.75rem;
	}

	.grep-input-wrap {
		padding: 0.65rem 0.75rem;
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.terminal-input {
		width: 100%;
		background: var(--bg-surface);
		border: 1px solid var(--line-color);
		padding: 0.35rem 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--text-color);
		outline: none;
	}

	.terminal-input:focus {
		border-color: var(--primary-color);
	}

	.clear-btn {
		background: none;
		border: none;
		color: var(--text-muted);
		cursor: pointer;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		padding: 0;
	}

	.clear-btn:hover {
		color: var(--primary-color);
	}

	.sidebar-info-box {
		padding: 1rem;
		background-color: var(--bg-raised);
		border: 1px dashed var(--line-color);
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.info-title {
		color: var(--primary-color);
		font-size: 0.75rem;
		font-weight: 600;
	}

	.info-text {
		color: var(--text-muted);
		font-size: 0.78rem;
		line-height: 1.5;
		margin: 0;
	}

	.code-tag {
		color: var(--primary-color);
		background-color: var(--bg-surface);
		padding: 0.05rem 0.25rem;
		border: 1px solid var(--line-color);
	}

	/* Right Feed Section */
	.blog-feed-section {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.feed-header-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		padding: 0.5rem 0.75rem;
		background-color: var(--bg-raised);
		border: 1px solid var(--line-color);
		font-size: 0.78rem;
	}

	.feed-status {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		color: var(--text-muted);
	}

	.status-dot {
		color: #10b981;
		font-size: 0.7rem;
	}

	.highlight {
		color: var(--primary-color);
		font-weight: 700;
	}

	.search-badge {
		color: var(--text-color);
		background-color: var(--bg-surface);
		padding: 0.1rem 0.35rem;
		border: 1px solid var(--line-color);
	}

	.feed-count {
		color: var(--text-muted);
	}

	.cards-grid {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
	}

	.empty-feed-card {
		padding: 3.5rem 1.5rem;
		background-color: var(--bg-raised);
		border: 1px dashed var(--line-color);
		text-align: center;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	.empty-prompt {
		color: #ef4444;
		font-weight: 600;
		font-size: 0.9rem;
	}

	.empty-hint {
		color: var(--text-muted);
		font-size: 0.825rem;
		margin: 0;
	}

	.reset-btn {
		background: none;
		border: 1px solid var(--line-color);
		padding: 0.3rem 0.75rem;
		font-family: var(--font-mono);
		font-size: 0.8rem;
		color: var(--primary-color);
		cursor: pointer;
		margin-top: 0.5rem;
	}

	.reset-btn:hover {
		border-color: var(--primary-color);
		background-color: var(--bg-surface);
	}

	/* Active blinking cursor prompt at bottom */
	.terminal-active-line {
		display: flex;
		align-items: baseline;
		gap: 0.25rem;
		font-size: 0.95rem;
		font-weight: 600;
		padding-top: 0.5rem;
	}
</style>
