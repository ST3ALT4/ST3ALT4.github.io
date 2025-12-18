<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	const heading = 'Hi, I am Anikait.';
	const speed = 100;

	let displayedText = $state('');
	let isTyping = $state(true);

	onMount(() => {
		let i = 0;
		function type() {
			if (i < heading.length) {
				displayedText += heading.charAt(i);
				i++;
				setTimeout(type, speed);
			} else {
				isTyping = false;
			}
		}
		setTimeout(type, 500);
	});
</script>

<div class="min-h-screen flex flex-col justify-center items-center pt-16 px-6 font-[var(--font-main)] text-[var(--text-color)]">
	
	<div class="mb-12 text-center min-h-[80px]">
		<h1 class="text-5xl md:text-7xl font-bold tracking-tight">
			{displayedText}<span class="cursor"></span>
		</h1>
	</div>

	{#if !isTyping}
		<section 
			class="max-w-2xl flex flex-col gap-6 text-lg md:text-xl leading-relaxed opacity-90" 
			transition:fade={{ duration: 800, delay: 200 }}
		>
			<p>
				I’m a student who builds things because I enjoy it. This blog exists simply because I want to
				write, experiment, and document what I’m working on, mostly around 
				<span class="text-[var(--primary-color)] font-semibold">systems programming</span>,
				<span class="text-[var(--primary-color)] font-semibold">graphics</span>, 
				<span class="text-[var(--primary-color)] font-semibold">compilers</span>, and 
				<span class="text-[var(--primary-color)] font-semibold">hardware</span>.
			</p>

			<p>
				A lot of it is C/C++, Vulkan, RISC-V, and small tools I build to understand how things work
				under the hood. I’m not trying to teach formally or present polished tutorials. Most posts
				are informal notes, project logs, and thoughts written while I’m learning or trying
				something new. &larr; (This is given by Gemini)
			</p>

			<p class="italic opacity-60 mt-4 text-base">
				This blog is pressure-free, curiosity-driven, and mostly for me. If it helps someone else
				along the way, that’s a bonus.
			</p>
		</section>
	{/if}
</div>

<style>
    /* Keep cursor animation here as standard Tailwind 'animate-pulse' 
       is a fade, but you likely want a hard blink.
    */
	.cursor {
		display: inline-block;
		width: 10px;
		height: 1em; /* Scales with font size automatically */
		background-color: var(--primary-color); /* Uses your global variable */
		margin-left: 4px;
        vertical-align: text-bottom;
		animation: blink 0.9s step-end infinite;
	}

	@keyframes blink {
		0%, 50% { opacity: 1; }
		51%, 100% { opacity: 0; }
	}
</style>
