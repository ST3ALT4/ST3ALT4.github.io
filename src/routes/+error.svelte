<script lang="ts">
	import { page } from '$app/state';
	import { ROUTES } from '$lib/routes';
</script>

<svelte:head>
	<title>{page.status} — command not found</title>
</svelte:head>

<div class="terminal-window error-window">
	<!-- Terminal Error Titlebar -->
	<div class="terminal-titlebar-wrapper">
		<div class="terminal-titlebar">
			<div class="buffer-info">
				<span class="buffer-tag">[SIGNAL: SIGERR]</span>
				<span class="terminal-title">exit code {page.status}</span>
			</div>
		</div>
	</div>

	<!-- Terminal Body -->
	<div class="terminal-body error-body">
		<!-- Failed Command Line -->
		<div class="cmd-line">
			<span class="prompt-user">st3alt4</span><span class="prompt-colon">:</span><span
				class="prompt-path">~</span
			><span class="prompt-char">$</span>
			<span class="cmd-text">cd {page.url.pathname}</span>
		</div>

		<!-- Error Output -->
		<div class="error-output">
			<p class="err-msg">
				<span class="err-prefix">bash: cd:</span>
				<span class="err-target">{page.url.pathname}</span>: No such file or directory
			</p>
			<p class="status-msg">
				[process exited with status {page.status}: {page.error?.message || 'NOT FOUND'}]
			</p>

			<div class="suggestions-box">
				<span class="sugg-header">// available directory targets:</span>
				<ul class="sugg-list">
					<li>
						<span class="prompt-char">$</span>
						<a href={ROUTES.home.index} class="sugg-link">cd ~</a>
						<span class="sugg-desc">return to home session</span>
					</li>
					<li>
						<span class="prompt-char">$</span>
						<a href={ROUTES.home.blogList} class="sugg-link">cd ~/blog</a>
						<span class="sugg-desc">browse articles & notes</span>
					</li>
					<li>
						<span class="prompt-char">$</span>
						<a href="/#contact" class="sugg-link">cd ~/.contact</a>
						<span class="sugg-desc">view communication channels</span>
					</li>
				</ul>
			</div>
		</div>

		<!-- Active cursor -->
		<div class="terminal-active-line" aria-hidden="true">
			<span class="prompt-user">st3alt4</span><span class="prompt-colon">:</span><span
				class="prompt-path">~</span
			><span class="prompt-char">$</span>
			<span class="cursor">█</span>
		</div>
	</div>
</div>

<style>
	.error-window {
		width: 100%;
		border-radius: 0;
	}

	.buffer-info {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
	}

	.buffer-tag {
		color: #ef4444;
		font-weight: 700;
		font-size: 0.72rem;
		letter-spacing: 0.05em;
	}

	.error-body {
		max-width: 800px;
		margin: 0 auto;
		width: 100%;
		box-sizing: border-box;
		padding: 2rem 1.5rem;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	@media (min-width: 640px) {
		.error-body {
			padding: 2.5rem 2rem;
		}
	}

	.error-output {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		padding-left: 0.5rem;
	}

	.err-msg {
		color: #ef4444;
		font-weight: 600;
		font-size: 0.95rem;
		margin: 0;
	}

	.err-prefix {
		color: var(--text-muted);
	}

	.err-target {
		color: var(--primary-color);
	}

	.status-msg {
		color: var(--text-muted);
		font-size: 0.82rem;
		margin: 0;
	}

	.suggestions-box {
		margin-top: 1rem;
		background-color: var(--bg-raised);
		border: 1px solid var(--line-color);
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.sugg-header {
		color: var(--primary-color);
		font-size: 0.8rem;
		font-weight: 600;
	}

	.sugg-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		font-size: 0.85rem;
	}

	.sugg-list li {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.5rem;
	}

	.sugg-link {
		color: var(--primary-color);
		font-weight: 700;
		text-decoration: none;
	}

	.sugg-link:hover {
		text-decoration: underline;
	}

	.sugg-desc {
		color: var(--text-muted);
		font-size: 0.78rem;
	}

	.terminal-active-line {
		display: flex;
		align-items: baseline;
		gap: 0.25rem;
		font-size: 0.95rem;
		font-weight: 600;
		padding-top: 0.5rem;
	}
</style>
