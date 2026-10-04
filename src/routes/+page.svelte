<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { goto } from '$app/navigation';
	import type { BlogPostMeta } from '$lib/types';
	import {
		executeCommand,
		getMotd,
		getTabCompletion,
		type CommandResult
	} from '$lib/terminal/commands';

	let { data }: { data: { projectPosts: BlogPostMeta[] } } = $props();

	interface TerminalEntry {
		id: number;
		type: 'motd' | 'command' | 'output' | 'error';
		command?: string;
		content?: string;
		html?: string;
	}

	let entries = $state<TerminalEntry[]>([
		{
			id: 0,
			type: 'motd',
			html: getMotd()
		}
	]);
	let currentInput = $state('');
	let historyLog = $state<string[]>([]);
	let historyCursor = $state(-1);
	let inputRef = $state<HTMLInputElement | null>(null);
	let terminalContainer = $state<HTMLDivElement | null>(null);
	let renderedLineRef = $state<HTMLDivElement | null>(null);

	let cursorPosition = $state(0);
	let selectionEnd = $state(0);
	let isInputFocused = $state(false);

	const suggestionCommands = ['help', 'whoami', 'sysinfo', 'skills', 'projects', 'blog', 'contact'];

	function syncCursor() {
		if (!inputRef) return;
		cursorPosition = inputRef.selectionStart ?? currentInput.length;
		selectionEnd = inputRef.selectionEnd ?? cursorPosition;
		if (renderedLineRef && inputRef) {
			renderedLineRef.scrollLeft = inputRef.scrollLeft;
		}
	}

	onMount(() => {
		if (entries.length === 0) {
			entries = [
				{
					id: Date.now(),
					type: 'motd',
					html: getMotd()
				}
			];
		}
		syncCursor();

		const params = new URLSearchParams(window.location.search);
		const initialCmd =
			params.get('cmd') || (window.location.hash ? window.location.hash.replace('#', '') : null);
		if (initialCmd) {
			runCommand(initialCmd);
		}

		function handleExternalRun(e: Event) {
			const customEvent = e as CustomEvent<string>;
			if (customEvent.detail) {
				runCommand(customEvent.detail);
			}
		}

		window.addEventListener('terminal-run', handleExternalRun);
		return () => {
			window.removeEventListener('terminal-run', handleExternalRun);
		};
	});

	async function scrollToBottom() {
		await tick();
		if (terminalContainer) {
			window.scrollTo({
				top: document.body.scrollHeight,
				behavior: 'smooth'
			});
		}
	}

	function runCommand(cmdString: string) {
		const raw = cmdString.trim();
		if (!raw) return;

		historyLog = [...historyLog, raw];
		historyCursor = -1;
		currentInput = '';
		cursorPosition = 0;
		selectionEnd = 0;

		const recordId = Date.now();
		const result: CommandResult = executeCommand(raw, {
			projectPosts: data.projectPosts,
			commandHistory: historyLog
		});

		if (result.type === 'action') {
			if (result.action === 'clear') {
				entries = [
					{
						id: recordId,
						type: 'motd',
						html: getMotd()
					}
				];
				scrollToBottom();
				inputRef?.focus();
				syncCursor();
				return;
			}
			if (result.action === 'theme') {
				const docTheme = document.documentElement.getAttribute('data-theme');
				const next = docTheme === 'light' ? 'dark' : 'light';
				document.documentElement.setAttribute('data-theme', next);
				try {
					localStorage.setItem('theme', next);
				} catch {
					// Local storage unavailable
				}
				entries = [
					...entries,
					{
						id: recordId,
						type: 'command',
						command: raw
					},
					{
						id: recordId + 1,
						type: 'output',
						content: `Theme profile switched to: [${next}]`
					}
				];
				scrollToBottom();
				inputRef?.focus();
				syncCursor();
				return;
			}
			if (result.action === 'man') {
				entries = [
					...entries,
					{
						id: recordId,
						type: 'command',
						command: raw
					},
					{
						id: recordId + 1,
						type: 'output',
						content: `Tip: Press '?' or click [?:help] in the bottom tmux bar for the full manual.`
					}
				];
				scrollToBottom();
				inputRef?.focus();
				syncCursor();
				return;
			}
		}

		if (result.type === 'navigate') {
			entries = [
				...entries,
				{
					id: recordId,
					type: 'command',
					command: raw
				},
				{
					id: recordId + 1,
					type: 'output',
					content: result.content || 'Navigating...'
				}
			];
			scrollToBottom();
			if (result.navigateTo) {
				setTimeout(() => {
					goto(result.navigateTo!);
				}, 250);
			}
			return;
		}

		if (result.type === 'error') {
			entries = [
				...entries,
				{
					id: recordId,
					type: 'command',
					command: raw
				},
				{
					id: recordId + 1,
					type: 'error',
					content: result.content
				}
			];
			scrollToBottom();
			inputRef?.focus();
			syncCursor();
			return;
		}

		// Regular output
		entries = [
			...entries,
			{
				id: recordId,
				type: 'command',
				command: raw
			},
			{
				id: recordId + 1,
				type: 'output',
				content: result.content,
				html: result.html
			}
		];
		scrollToBottom();
		inputRef?.focus();
		syncCursor();
	}

	function handleFormSubmit(e?: Event) {
		if (e) e.preventDefault();
		runCommand(currentInput);
	}

	async function handleInputKeyDown(e: KeyboardEvent) {
		if (e.key === 'ArrowUp') {
			e.preventDefault();
			if (historyLog.length === 0) return;
			if (historyCursor === -1) {
				historyCursor = historyLog.length - 1;
			} else if (historyCursor > 0) {
				historyCursor--;
			}
			currentInput = historyLog[historyCursor] ?? '';
			await tick();
			if (inputRef) {
				inputRef.selectionStart = inputRef.selectionEnd = currentInput.length;
				syncCursor();
			}
		} else if (e.key === 'ArrowDown') {
			e.preventDefault();
			if (historyCursor === -1) return;
			if (historyCursor < historyLog.length - 1) {
				historyCursor++;
				currentInput = historyLog[historyCursor] ?? '';
			} else {
				historyCursor = -1;
				currentInput = '';
			}
			await tick();
			if (inputRef) {
				inputRef.selectionStart = inputRef.selectionEnd = currentInput.length;
				syncCursor();
			}
		} else if (e.key === 'Tab') {
			e.preventDefault();
			const match = getTabCompletion(currentInput);
			if (match) {
				currentInput = match;
				await tick();
				if (inputRef) {
					inputRef.selectionStart = inputRef.selectionEnd = currentInput.length;
					syncCursor();
				}
			}
		} else if (e.key === 'Escape') {
			inputRef?.blur();
			isInputFocused = false;
		} else {
			tick().then(syncCursor);
		}
	}
</script>

<svelte:head>
	<title>st3alt4: ~</title>
</svelte:head>

<div
	class="terminal-window terminal-interactive-root"
	role="region"
	aria-label="Interactive Terminal"
	tabindex="-1"
>
	<div class="terminal-body" bind:this={terminalContainer}>
		{#each entries as entry (entry.id)}
			{#if entry.type === 'motd'}
				<div class="motd-block">
					<!-- eslint-disable-next-line svelte/no-at-html-tags -->
					{@html entry.html}
					<div class="command-suggestions" aria-label="Suggested commands">
						<span class="suggestions-label">// quick commands:</span>
						{#each suggestionCommands as cmd (cmd)}
							<button
								type="button"
								class="suggestion-chip"
								onclick={(e) => {
									e.stopPropagation();
									runCommand(cmd);
								}}
							>
								$ {cmd}
							</button>
						{/each}
					</div>
				</div>
			{:else if entry.type === 'command'}
				<div class="terminal-entry">
					<div class="terminal-entry-cmd">
						<span class="prompt-user">st3alt4</span><span class="prompt-colon">:</span><span
							class="prompt-path">~</span
						><span class="prompt-char">$</span>
						<span class="cmd-text">{entry.command}</span>
					</div>
				</div>
			{:else if entry.type === 'output'}
				<div class="terminal-output">
					{#if entry.html}
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html entry.html}
					{:else if entry.content}
						<pre class="cli-pre">{entry.content}</pre>
					{/if}
				</div>
			{:else if entry.type === 'error'}
				<div class="terminal-output err-output">
					<pre class="cli-pre">{entry.content}</pre>
				</div>
			{/if}
		{/each}

		<!-- Active Interactive Prompt Line -->
		<form class="terminal-active-line" onsubmit={handleFormSubmit} role="presentation">
			<span class="prompt-user">st3alt4</span><span class="prompt-colon">:</span><span
				class="prompt-path">~</span
			><span class="prompt-char">$</span>

			<div class="cli-input-wrapper">
				<input
					bind:this={inputRef}
					type="text"
					bind:value={currentInput}
					onkeydown={handleInputKeyDown}
					oninput={syncCursor}
					onclick={syncCursor}
					onkeyup={syncCursor}
					onselect={syncCursor}
					onscroll={syncCursor}
					onfocus={() => {
						isInputFocused = true;
						syncCursor();
					}}
					onblur={() => {
						isInputFocused = false;
					}}
					class="cli-real-input"
					spellcheck="false"
					autocomplete="off"
					autocapitalize="off"
					aria-label="Terminal command input"
				/>

				<div class="cli-rendered-line" bind:this={renderedLineRef} aria-hidden="true">
					{#if currentInput.length === 0}
						<span class="cursor-block cursor-end" class:focused={isInputFocused}>&nbsp;</span>
						<span class="placeholder-text">
							type 'help' or command...{#if !isInputFocused}
								· [VISUAL] press i to type, Esc to return{/if}
						</span>
					{:else}
						{@const selStart = Math.min(cursorPosition, selectionEnd)}
						{@const selEnd = Math.max(cursorPosition, selectionEnd)}
						{#if selStart !== selEnd}
							<span>{currentInput.slice(0, selStart)}</span>
							<span class="selected-text">{currentInput.slice(selStart, selEnd)}</span>
							<span>{currentInput.slice(selEnd)}</span>
						{:else}
							<span>{currentInput.slice(0, cursorPosition)}</span>
							{#if cursorPosition < currentInput.length}
								<span class="cursor-block cursor-char" class:focused={isInputFocused}>
									{currentInput[cursorPosition] === ' ' ? '\u00A0' : currentInput[cursorPosition]}
								</span>
								<span>{currentInput.slice(cursorPosition + 1)}</span>
							{:else}
								<span class="cursor-block cursor-end" class:focused={isInputFocused}>&nbsp;</span>
							{/if}
						{/if}
					{/if}
				</div>
			</div>
		</form>
	</div>
</div>

<style>
	.terminal-interactive-root {
		cursor: default;
		display: flex;
		flex-direction: column;
		flex: 1;
		width: 100%;
		min-height: calc(100vh - 1.85rem);
		background-color: var(--bg-surface);
	}

	.terminal-body {
		max-width: 1200px;
		margin: 0 auto;
		width: 100%;
		box-sizing: border-box;
		padding: 1.5rem 1.25rem 3rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		flex: 1;
	}

	@media (min-width: 768px) {
		.terminal-body {
			padding: 2rem 2rem 3.5rem;
			gap: 1.5rem;
		}
	}

	.motd-block {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.suggestions-label {
		color: var(--text-muted);
		font-size: 0.78rem;
		font-style: italic;
		align-self: center;
	}

	.terminal-active-line {
		display: flex;
		align-items: center;
		flex-wrap: nowrap;
		gap: 0.35rem;
		padding-top: 0.5rem;
	}

	.cli-input-wrapper {
		position: relative;
		flex: 1;
		display: flex;
		align-items: center;
		min-height: 1.5rem;
		min-width: 80px;
	}

	.cli-real-input {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		opacity: 0;
		color: transparent;
		caret-color: transparent;
		background: transparent;
		border: none;
		outline: none;
		font-family: var(--font-mono);
		font-size: 0.95rem;
		font-weight: 600;
		letter-spacing: normal;
		padding: 0;
		margin: 0;
		z-index: 2;
		cursor: text;
	}

	.cli-rendered-line {
		display: flex;
		align-items: center;
		white-space: pre;
		pointer-events: none;
		user-select: none;
		color: var(--text-color);
		font-family: var(--font-mono);
		font-size: 0.95rem;
		font-weight: 600;
		line-height: 1.5;
		overflow: hidden;
		width: 100%;
	}

	.cursor-block {
		display: inline-block;
		width: 1ch;
		height: 1.3em;
		line-height: 1.3em;
		text-align: center;
		vertical-align: middle;
		font-family: var(--font-mono);
		font-size: 0.95rem;
		font-weight: 700;
	}

	.cursor-block.cursor-char.focused {
		animation: cursor-blink-char 1s step-end infinite;
	}

	.cursor-block.cursor-end.focused {
		animation: cursor-blink-block 1s step-end infinite;
	}

	.cursor-block:not(.focused) {
		border: 1px solid var(--primary-color);
		box-sizing: border-box;
		background-color: transparent;
		color: var(--text-color);
		animation: none;
	}

	.placeholder-text {
		color: var(--text-muted);
		font-weight: 400;
		font-size: 0.85rem;
		opacity: 0.55;
		margin-left: 0.35rem;
	}

	.selected-text {
		background-color: var(--primary-color);
		color: var(--bg-surface);
	}
</style>
