<script lang="ts">
	let { data } = $props();
</script>

{#if !data}
	<p style="color: red;">Error: No data received.</p>
{:else}
	<article class="blog-content">
		<h1>{data.meta.title}</h1>

		<svelte:component this={data.Content}/>
	</article>
{/if}
