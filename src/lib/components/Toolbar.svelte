<script lang="ts">
	import { onMount } from 'svelte';
	import { ROUTES } from '$lib/routes';
	import { page } from '$app/state';

	let currentTheme = $state<'dark' | 'light'>('dark');

	onMount(() => {
		const docTheme = document.documentElement.getAttribute('data-theme');
		if (docTheme === 'light' || docTheme === 'dark') {
			currentTheme = docTheme;
		} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
			currentTheme = 'light';
		} else {
			currentTheme = 'dark';
		}

		// Keyboard shortcut 't' to toggle theme
		function handleKeyDown(e: KeyboardEvent) {
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
			if (e.key === 't' || e.key === 'T') {
				toggleTheme();
			}
		}
		window.addEventListener('keydown', handleKeyDown);
		return () => window.removeEventListener('keydown', handleKeyDown);
	});

	function toggleTheme() {
		const next = currentTheme === 'dark' ? 'light' : 'dark';
		currentTheme = next;
		document.documentElement.setAttribute('data-theme', next);
		try {
			localStorage.setItem('theme', next);
		} catch {
			// Storage unavailable or disabled
		}
	}
</script>

<header class="site-header">
	<div class="header-inner">
		<!-- Left: Terminal window dots & host session -->
		<div class="header-left">
			<div class="terminal-dots" aria-hidden="true">
				<span class="dot dot-red"></span>
				<span class="dot dot-yellow"></span>
				<span class="dot dot-green"></span>
			</div>
			<a href={ROUTES.home.index} class="brand">
				<span class="brand-user">st3alt4</span><span class="brand-at">@</span><span
					class="brand-host">thapar</span
				><span class="brand-colon">:</span><span class="brand-path">~</span><span
					class="prompt-char">$</span
				>
				<span class="cursor" aria-hidden="true">█</span>
			</a>
		</div>

		<!-- Right: Navigation tabs & theme toggle -->
		<nav class="nav-links" aria-label="Main Navigation">
			<a href={ROUTES.home.index} class="nav-tab" class:active={page.url.pathname === '/'}>
				<span class="tab-index">0:</span>home
			</a>
			<a
				href={ROUTES.home.blogList}
				class="nav-tab"
				class:active={page.url.pathname.startsWith('/blog')}
			>
				<span class="tab-index">1:</span>blog
			</a>
			<a href="#contact" class="nav-tab">
				<span class="tab-index">2:</span>contact
			</a>

			<div class="nav-divider" aria-hidden="true">|</div>

			<button
				type="button"
				class="theme-btn"
				onclick={toggleTheme}
				title="Toggle theme (Shortcut: press 't')"
				aria-label="Toggle light and dark mode"
			>
				<span class="theme-label">theme:</span><span class="theme-value">[{currentTheme}]</span>
			</button>
		</nav>
	</div>
</header>

<style>
	.site-header {
		position: sticky;
		top: 0;
		z-index: 40;
		width: 100%;
		border-bottom: 1px solid var(--line-color);
		background-color: color-mix(in srgb, var(--bg-color), transparent 8%);
		backdrop-filter: blur(12px);
	}

	.header-inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0.75rem 1.5rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		font-size: 0.85rem;
	}

	@media (min-width: 768px) {
		.header-inner {
			padding: 0.85rem 2.5rem;
		}
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 0.85rem;
	}

	.terminal-dots {
		display: none;
		align-items: center;
		gap: 0.35rem;
	}

	@media (min-width: 640px) {
		.terminal-dots {
			display: flex;
		}
	}

	.dot {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		opacity: 0.75;
	}

	.dot-red {
		background-color: #ef4444;
	}

	.dot-yellow {
		background-color: #f59e0b;
	}

	.dot-green {
		background-color: #10b981;
	}

	.brand {
		font-weight: 600;
		color: var(--text-color);
		text-decoration: none;
		display: inline-flex;
		align-items: center;
		gap: 1px;
		letter-spacing: -0.01em;
	}

	.brand-user {
		color: var(--primary-color);
		font-weight: 700;
	}

	.brand-at {
		color: var(--text-muted);
	}

	.brand-host {
		color: var(--text-color);
	}

	.brand-colon {
		color: var(--text-muted);
	}

	.brand-path {
		color: var(--primary-color);
	}

	.prompt-char {
		color: var(--text-muted);
		margin-left: 2px;
	}

	.cursor {
		color: var(--primary-color);
		font-size: 0.75em;
		margin-left: 3px;
		animation: blink 1s step-end infinite;
		vertical-align: middle;
	}

	@keyframes blink {
		0%,
		50% {
			opacity: 1;
		}
		51%,
		100% {
			opacity: 0;
		}
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 0.85rem;
		font-size: 0.825rem;
	}

	@media (min-width: 640px) {
		.nav-links {
			gap: 1.25rem;
		}
	}

	.nav-tab {
		color: var(--text-muted);
		text-decoration: none;
		padding: 0.2rem 0.4rem;
		border-radius: 2px;
		transition: all 0.15s ease;
	}

	.tab-index {
		color: var(--line-bright);
		margin-right: 2px;
		font-size: 0.75rem;
	}

	.nav-tab:hover {
		color: var(--primary-color);
		background-color: color-mix(in srgb, var(--primary-color), transparent 92%);
	}

	.nav-tab.active {
		color: var(--primary-color);
		font-weight: 600;
		background-color: color-mix(in srgb, var(--primary-color), transparent 88%);
		border: 1px solid color-mix(in srgb, var(--primary-color), transparent 75%);
	}

	.nav-divider {
		color: var(--line-bright);
		user-select: none;
		display: none;
	}

	@media (min-width: 640px) {
		.nav-divider {
			display: block;
		}
	}

	.theme-btn {
		background: none;
		border: 1px solid var(--line-color);
		padding: 0.25rem 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--text-muted);
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		gap: 0.3rem;
		transition: all 0.15s ease;
		background-color: var(--bg-surface);
	}

	.theme-btn:hover {
		border-color: var(--primary-color);
		color: var(--primary-color);
	}

	.theme-label {
		display: none;
	}

	@media (min-width: 640px) {
		.theme-label {
			display: inline;
		}
	}

	.theme-value {
		color: var(--primary-color);
		font-weight: 600;
	}

	@media (prefers-reduced-motion: reduce) {
		.cursor {
			animation: none;
			opacity: 1;
		}
	}
</style>
