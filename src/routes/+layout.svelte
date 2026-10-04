<script lang="ts">
	import '../app.css';
	import TmuxBar from '$lib/components/TmuxBar.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>st3alt4</title>
	<link rel="icon" href="/favicon.svg" />
	<meta name="description" content="Personal portfolio and systems programming notes" />
</svelte:head>

<div class="site-wrapper">
	<main class="main-content">
		{@render children()}
	</main>
	<TmuxBar />
</div>

<style>
	.site-wrapper {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		position: relative;
		background-color: var(--bg-surface);
	}

	.main-content {
		flex: 1;
		width: 100%;
		margin: 0;
		padding: 0 0 1.85rem 0;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
	}
</style>
