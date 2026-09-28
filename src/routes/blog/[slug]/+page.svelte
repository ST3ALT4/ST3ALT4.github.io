<script lang="ts">
	import type { Component } from 'svelte';
	import type { BlogPostMeta } from '$lib/types';

	let { data }: { data: { Content: Component; meta: BlogPostMeta } } = $props();
</script>

<svelte:head>
	<title>{data.meta?.title ? `${data.meta.title} — st3alt4` : 'Blog — st3alt4'}</title>
	{#if data.meta?.description}
		<meta name="description" content={data.meta.description} />
	{/if}
</svelte:head>

{#if data.Content}
	<data.Content />
{/if}
