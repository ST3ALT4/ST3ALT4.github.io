<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Toolbar from '$lib/components/Toolbar.svelte';
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<title>st3alt4</title>
	<link rel="icon" href={favicon} />
	<meta
		name="description"
		content="Personal portfolio and systems programming notes"
	/>
</svelte:head>

<div class="site-wrapper">
	<Toolbar />
	<main class="main-content">
		{@render children()}
	</main>
	<Footer />
</div>

<style>
	.site-wrapper {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.main-content {
		flex: 1;
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 2.5rem 1.5rem 5rem;
		box-sizing: border-box;
	}

	@media (min-width: 768px) {
		.main-content {
			padding: 3rem 2.5rem 6rem;
		}
	}

	@media (min-width: 1280px) {
		.main-content {
			padding: 3.5rem 3rem 7rem;
		}
	}
</style>
