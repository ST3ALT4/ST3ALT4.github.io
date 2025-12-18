<script lang="ts">
  import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

  import Toolbar from "$lib/components/Toolbar.svelte";

  let {children} = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<Toolbar/>

{@render children()}


