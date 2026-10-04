<script lang="ts">
	import { onMount } from 'svelte';
	import { ROUTES } from '$lib/routes';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	// ── Vim-style modal editing ──────────────────────────────────────────────
	// VISUAL = navigate/keyboard-nav mode (default)
	// INSERT = typing into an input / terminal
	type VimMode = 'VISUAL' | 'INSERT';
	let vimMode = $state<VimMode>('VISUAL');

	let currentTheme = $state<'dark' | 'light'>('dark');
	let showHelp = $state(false);
	let showNotifs = $state(false);

	let currentTime = $state('');
	let cpuUsage = $state(14);
	const memUsage = '2.1G';

	const systemLogs = [
		{
			time: '18:30:15',
			tag: 'SESSION',
			level: 'sys',
			text: 'Continuous terminal stream active [TTY: /dev/pts/1]'
		},
		{
			time: '17:35:50',
			tag: 'BUILD',
			level: 'ok',
			text: 'Static bundle prerendered into build/ (0 errors)'
		},
		{
			time: '17:21:30',
			tag: 'THEME',
			level: 'info',
			text: 'Terminal palette detector loaded'
		},
		{
			time: '16:48:02',
			tag: 'GIT',
			level: 'info',
			text: 'HEAD synchronized at origin/main [clean]'
		},
		{
			time: '16:44:51',
			tag: 'HOST',
			level: 'sys',
			text: 'Session established: st3alt4 (Arch Linux x86_64)'
		}
	];

	/** Enter INSERT mode – focus the most relevant input on the page. */
	function enterInsertMode() {
		const termInput = document.querySelector<HTMLInputElement>(
			'.cli-real-input, .cli-interactive-input'
		);
		const grepInput = document.getElementById('grep-input') as HTMLInputElement | null;
		const target = termInput || grepInput;
		if (target) {
			target.focus();
			vimMode = 'INSERT';
		}
	}

	/** Return to VISUAL mode – blur whatever is focused. */
	function enterVisualMode() {
		if (document.activeElement instanceof HTMLElement) {
			document.activeElement.blur();
		}
		vimMode = 'VISUAL';
	}

	onMount(() => {
		// ── Theme init ───────────────────────────────────────────────────────
		const docTheme = document.documentElement.getAttribute('data-theme');
		if (docTheme === 'light' || docTheme === 'dark') {
			currentTheme = docTheme;
		} else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
			currentTheme = 'light';
		} else {
			currentTheme = 'dark';
		}

		// ── Sync vimMode whenever focus moves in/out of inputs ───────────────
		function syncMode() {
			const el = document.activeElement;
			const isInput =
				el instanceof HTMLInputElement ||
				el instanceof HTMLTextAreaElement ||
				(el instanceof HTMLElement && el.isContentEditable);
			vimMode = isInput ? 'INSERT' : 'VISUAL';
		}
		window.addEventListener('focusin', syncMode);
		window.addEventListener('focusout', () => setTimeout(syncMode, 15));

		// ── Clock ────────────────────────────────────────────────────────────
		function updateTime() {
			const now = new Date();
			currentTime = now.toLocaleTimeString('en-US', { hour12: false });
		}
		updateTime();
		const clockInterval = setInterval(updateTime, 1000);

		// ── Fake CPU telemetry ───────────────────────────────────────────────
		const resInterval = setInterval(() => {
			cpuUsage = Math.floor(11 + Math.random() * 16);
		}, 3500);

		// ── Global keyboard handler ──────────────────────────────────────────
		function handleKeyDown(e: KeyboardEvent) {
			const inInput =
				e.target instanceof HTMLInputElement ||
				e.target instanceof HTMLTextAreaElement ||
				e.target instanceof HTMLSelectElement ||
				(e.target instanceof HTMLElement && e.target.isContentEditable);

			// ── INSERT mode keys ─────────────────────────────────────────────
			if (inInput) {
				if (e.key === 'Escape') {
					e.preventDefault();
					enterVisualMode();
				}
				// Alt+0/1/2 tab switching from INSERT mode
				if (e.altKey && (e.key === '0' || e.key === '1' || e.key === '2')) {
					e.preventDefault();
					if (e.key === '0') goto(ROUTES.home.index);
					if (e.key === '1') goto(ROUTES.home.blogList);
					if (e.key === '2') {
						if (page.url.pathname === '/') {
							window.dispatchEvent(new CustomEvent('terminal-run', { detail: 'contact' }));
						} else {
							goto('/?cmd=contact');
						}
					}
				}
				return; // don't process VISUAL shortcuts in INSERT mode
			}

			// ── VISUAL mode keys ─────────────────────────────────────────────
			switch (e.key) {
				// Enter INSERT mode
				case 'i':
				case 'I':
				case 'a':
				case 'A':
					e.preventDefault();
					enterInsertMode();
					break;

				// Scrolling – j/k / J/K (page step)
				case 'j':
					e.preventDefault();
					window.scrollBy({ top: 80, behavior: 'smooth' });
					break;
				case 'k':
					e.preventDefault();
					window.scrollBy({ top: -80, behavior: 'smooth' });
					break;
				case 'J':
					e.preventDefault();
					window.scrollBy({ top: window.innerHeight * 0.6, behavior: 'smooth' });
					break;
				case 'K':
					e.preventDefault();
					window.scrollBy({ top: -window.innerHeight * 0.6, behavior: 'smooth' });
					break;

				// Go to top / bottom (gg / G)
				case 'g':
					if (!e.shiftKey) {
						e.preventDefault();
						window.scrollTo({ top: 0, behavior: 'smooth' });
					}
					break;
				case 'G':
					e.preventDefault();
					window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
					break;

				// Window tabs
				case '0':
				case 'h':
				case 'H':
					e.preventDefault();
					goto(ROUTES.home.index);
					break;
				case '1':
				case 'b':
				case 'B':
					e.preventDefault();
					goto(ROUTES.home.blogList);
					break;
				case '2':
				case 'c':
				case 'C':
					e.preventDefault();
					if (page.url.pathname === '/') {
						window.dispatchEvent(new CustomEvent('terminal-run', { detail: 'contact' }));
					} else {
						goto('/?cmd=contact');
					}
					break;

				// Theme toggle
				case 't':
				case 'T':
					e.preventDefault();
					toggleTheme();
					break;

				// Help / notifications
				case '?':
					e.preventDefault();
					showHelp = !showHelp;
					break;
				case 'n':
				case 'N':
					e.preventDefault();
					showNotifs = !showNotifs;
					break;

				// Close modals
				case 'Escape':
					showHelp = false;
					showNotifs = false;
					break;
				case 'q':
				case 'Q':
					if (showHelp) showHelp = false;
					else if (showNotifs) showNotifs = false;
					break;

				// Grep/search focus
				case '/': {
					const grepInput = document.getElementById('grep-input');
					if (grepInput) {
						e.preventDefault();
						grepInput.focus();
					}
					break;
				}

				// Activate focused link / button with Enter
				case 'Enter': {
					const el = document.activeElement;
					if (el instanceof HTMLAnchorElement || el instanceof HTMLButtonElement) {
						el.click();
					}
					break;
				}

				// Focus-cycle through interactive elements with Tab / Shift-Tab
				// (browser default Tab already does this; no override needed)
			}
		}

		window.addEventListener('keydown', handleKeyDown);
		return () => {
			window.removeEventListener('focusin', syncMode);
			window.removeEventListener('focusout', syncMode);
			window.removeEventListener('keydown', handleKeyDown);
			clearInterval(clockInterval);
			clearInterval(resInterval);
		};
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

<!-- Bottom Tmux Statusline -->
<footer class="tmux-bar" role="status" aria-label="Terminal status line">
	<div class="tmux-inner">
		<!-- Left: Session Badge, Mode Indicator & Window Tabs -->
		<div class="tmux-left">
			<span class="session-badge" title="tmux session">
				<span class="session-prefix">[</span>st3alt4<span class="session-suffix">]</span>
			</span>

			<!-- Vim mode pill: VISUAL (default) / INSERT -->
			<span
				class="vim-mode-badge"
				class:mode-visual={vimMode === 'VISUAL'}
				class:mode-insert={vimMode === 'INSERT'}
				title={vimMode === 'VISUAL'
					? 'VISUAL mode – press i to enter INSERT'
					: 'INSERT mode – press Esc to return to VISUAL'}
				aria-label="Current editor mode: {vimMode}"
			>
				-- {vimMode} --
			</span>

			<nav class="tmux-windows" aria-label="Terminal windows">
				<a
					href={ROUTES.home.index}
					class="tmux-tab"
					class:active={page.url.pathname === '/'}
					title="Navigate to Home (0 or h)"
				>
					<span class="tab-bracket">[</span><span class="tab-idx">0:</span>home<span
						class="tab-flag">{page.url.pathname === '/' ? '*' : ''}</span
					><span class="tab-bracket">]</span>
				</a>

				<a
					href={ROUTES.home.blogList}
					class="tmux-tab"
					class:active={page.url.pathname.startsWith('/blog')}
					title="Navigate to Blog (1 or b)"
				>
					<span class="tab-bracket">[</span><span class="tab-idx">1:</span>blog<span
						class="tab-flag">{page.url.pathname.startsWith('/blog') ? '*' : ''}</span
					><span class="tab-bracket">]</span>
				</a>

				<a
					href="/"
					class="tmux-tab"
					title="Jump to Contact (2 or c)"
					onclick={(e) => {
						e.preventDefault();
						if (page.url.pathname === '/') {
							window.dispatchEvent(new CustomEvent('terminal-run', { detail: 'contact' }));
						} else {
							goto('/?cmd=contact');
						}
					}}
				>
					<span class="tab-bracket">[</span><span class="tab-idx">2:</span>contact<span
						class="tab-bracket">]</span
					>
				</a>
			</nav>
		</div>

		<!-- Center: Telemetry, Clock & Notifications -->
		<div class="tmux-center">
			<div class="tmux-telemetry" title="Simulated Resource Telemetry">
				<span class="meta-bracket">[</span>
				<span class="meta-k">cpu:</span><span class="meta-v">{cpuUsage}%</span>
				<span class="meta-sep">·</span>
				<span class="meta-k">mem:</span><span class="meta-v">{memUsage}</span>
				<span class="meta-bracket">]</span>
			</div>

			{#if currentTime}
				<div class="tmux-clock" title="System Local Time">
					<span class="meta-bracket">[</span>
					<span class="clock-val">{currentTime}</span>
					<span class="meta-bracket">]</span>
				</div>
			{/if}

			<button
				type="button"
				class="tmux-btn notif-btn"
				class:active={showNotifs}
				onclick={() => (showNotifs = !showNotifs)}
				title="System Notification Center (Shortcut: n)"
				aria-label="Toggle system notification drawer"
			>
				<span class="meta-bracket">[</span>
				<span class="notif-dot">●</span>
				<span class="notif-txt">sys:ok</span>
				<span class="meta-bracket">]</span>
			</button>
		</div>

		<!-- Right: Flow Hints & Controls -->
		<div class="tmux-right">
			<button
				type="button"
				class="tmux-btn"
				onclick={() => (showHelp = !showHelp)}
				title="Terminal Manual & Keybindings (Shortcut: ?)"
				aria-label="Toggle terminal manual"
			>
				<span class="meta-bracket">[</span><span class="btn-k">?</span>:help<span
					class="meta-bracket">]</span
				>
			</button>

			<button
				type="button"
				class="tmux-btn"
				onclick={toggleTheme}
				title="Toggle Theme (Shortcut: t)"
				aria-label="Toggle light and dark mode"
			>
				<span class="meta-bracket">[</span><span class="btn-k">t</span>:<span class="theme-val"
					>{currentTheme}</span
				><span class="meta-bracket">]</span>
			</button>
		</div>
	</div>
</footer>

<!-- Notification Center Drawer Modal -->
{#if showNotifs}
	<div
		class="drawer-backdrop"
		onclick={() => (showNotifs = false)}
		onkeydown={(e) => e.key === 'Escape' && (showNotifs = false)}
		role="presentation"
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="drawer-window"
			onclick={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			aria-labelledby="notif-title"
			tabindex="-1"
		>
			<div class="drawer-titlebar">
				<span id="notif-title" class="drawer-title">dmesg: notification center</span>
				<button
					type="button"
					class="drawer-close-btn"
					onclick={() => (showNotifs = false)}
					aria-label="Close notification drawer"
				>
					[q: exit]
				</button>
			</div>

			<div class="drawer-body">
				<div class="log-entries">
					{#each systemLogs as log (log.time)}
						<div class="log-row">
							<span class="log-time">[{log.time}]</span>
							<span class="log-tag tag-{log.level}">&lt;{log.tag}&gt;</span>
							<span class="log-msg">{log.text}</span>
						</div>
					{/each}
				</div>

				<div class="drawer-footer">
					<span class="footer-hint">status: all systems operational</span>
					<button type="button" class="footer-close-btn" onclick={() => (showNotifs = false)}>
						[close (Esc)]
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<!-- Terminal Manual Modal: man st3alt4(1) -->
{#if showHelp}
	<div
		class="modal-backdrop"
		onclick={() => (showHelp = false)}
		onkeydown={(e) => e.key === 'Escape' && (showHelp = false)}
		role="presentation"
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="modal-window"
			onclick={(e) => e.stopPropagation()}
			role="dialog"
			aria-modal="true"
			aria-labelledby="man-title"
			tabindex="-1"
		>
			<div class="modal-titlebar">
				<span id="man-title" class="modal-title">man st3alt4(1)</span>
				<button
					type="button"
					class="modal-close-btn"
					onclick={() => (showHelp = false)}
					aria-label="Close manual"
				>
					[q: exit]
				</button>
			</div>

			<div class="modal-body">
				<div class="man-section">
					<h3 class="man-heading">NAME</h3>
					<p class="man-content">
						st3alt4 — personal portfolio, systems notes & terminal interface
					</p>
				</div>

				<div class="man-section">
					<h3 class="man-heading">SYNOPSIS</h3>
					<p class="man-content">
						<span class="cmd-highlight">st3alt4</span> [OPTIONS...] [COMMAND]
					</p>
				</div>

				<div class="man-section">
					<h3 class="man-heading">MODE SWITCHING</h3>
					<div class="shortcuts-grid">
						<div class="shortcut-item">
							<span class="key-col"><kbd>i</kbd> or <kbd>a</kbd></span>
							<span class="desc-col">enter <code>INSERT</code> mode – focus terminal input</span>
						</div>
						<div class="shortcut-item">
							<span class="key-col"><kbd>Esc</kbd></span>
							<span class="desc-col">return to <code>VISUAL</code> mode – release focus</span>
						</div>
					</div>
				</div>

				<div class="man-section">
					<h3 class="man-heading">VISUAL MODE – NAVIGATION</h3>
					<div class="shortcuts-grid">
						<div class="shortcut-item">
							<span class="key-col"><kbd>j</kbd> / <kbd>k</kbd></span>
							<span class="desc-col">scroll down / up (line step)</span>
						</div>
						<div class="shortcut-item">
							<span class="key-col"><kbd>J</kbd> / <kbd>K</kbd></span>
							<span class="desc-col">scroll down / up (half page)</span>
						</div>
						<div class="shortcut-item">
							<span class="key-col"><kbd>g</kbd></span>
							<span class="desc-col">jump to top of page</span>
						</div>
						<div class="shortcut-item">
							<span class="key-col"><kbd>G</kbd></span>
							<span class="desc-col">jump to bottom of page</span>
						</div>
						<div class="shortcut-item">
							<span class="key-col"><kbd>0</kbd> or <kbd>h</kbd></span>
							<span class="desc-col">navigate to home directory (<code>/</code>)</span>
						</div>
						<div class="shortcut-item">
							<span class="key-col"><kbd>1</kbd> or <kbd>b</kbd></span>
							<span class="desc-col">navigate to blog directory (<code>/blog</code>)</span>
						</div>
						<div class="shortcut-item">
							<span class="key-col"><kbd>2</kbd> or <kbd>c</kbd></span>
							<span class="desc-col">jump to contact section (<code>#contact</code>)</span>
						</div>
						<div class="shortcut-item">
							<span class="key-col"><kbd>n</kbd></span>
							<span class="desc-col">toggle system notification center</span>
						</div>
						<div class="shortcut-item">
							<span class="key-col"><kbd>t</kbd></span>
							<span class="desc-col">toggle color theme (dark ↔ light)</span>
						</div>
						<div class="shortcut-item">
							<span class="key-col"><kbd>/</kbd></span>
							<span class="desc-col">focus grep pattern search on blog page</span>
						</div>
						<div class="shortcut-item">
							<span class="key-col"><kbd>?</kbd></span>
							<span class="desc-col">toggle this terminal manual page</span>
						</div>
						<div class="shortcut-item">
							<span class="key-col"><kbd>Esc</kbd> or <kbd>q</kbd></span>
							<span class="desc-col">close open modal / drawer</span>
						</div>
					</div>
				</div>

				<div class="man-section">
					<h3 class="man-heading">SYSTEM INFO</h3>
					<p class="man-content">
						Environment: Arch Linux x86_64 · Tmux v3.4 · Stack: SvelteKit 5 · Font: JetBrains Mono
					</p>
				</div>

				<div class="modal-footer">
					<span class="footer-hint">:q to exit buffer</span>
					<button type="button" class="footer-close-btn" onclick={() => (showHelp = false)}>
						[close (Esc)]
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	/* Tmux Fixed Bottom Bar */
	.tmux-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		height: 1.85rem;
		z-index: 40;
		border-top: 1px solid var(--line-color);
		background-color: color-mix(in srgb, var(--bg-raised), transparent 5%);
		backdrop-filter: blur(8px);
		user-select: none;
		display: flex;
		align-items: center;
	}

	.tmux-inner {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 0.75rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.5rem;
		font-size: 0.78rem;
		font-family: var(--font-mono);
	}

	@media (min-width: 640px) {
		.tmux-inner {
			padding: 0 1.25rem;
			gap: 1rem;
		}
	}

	/* Left segment */
	.tmux-left {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.session-badge {
		color: var(--primary-color);
		font-weight: 700;
		display: inline-flex;
		align-items: baseline;
	}

	.session-prefix,
	.session-suffix {
		color: var(--line-bright);
	}

	.tmux-windows {
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.tmux-tab {
		color: var(--text-muted);
		text-decoration: none;
		padding: 0.1rem 0.15rem;
		font-size: 0.78rem;
		transition: color 0.15s ease;
		display: inline-flex;
		align-items: baseline;
	}

	.tab-bracket {
		color: var(--line-bright);
	}

	.tab-idx {
		color: var(--text-muted);
	}

	.tab-flag {
		color: var(--primary-color);
		font-weight: 700;
	}

	.tmux-tab:hover {
		color: var(--primary-color);
	}

	.tmux-tab:hover .tab-bracket,
	.tmux-tab:hover .tab-idx {
		color: var(--primary-color);
	}

	.tmux-tab.active {
		color: var(--primary-color);
		font-weight: 700;
	}

	.tmux-tab.active .tab-bracket {
		color: var(--primary-color);
	}

	/* Center segment */
	.tmux-center {
		display: none;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.75rem;
	}

	@media (min-width: 720px) {
		.tmux-center {
			display: flex;
		}
	}

	.meta-bracket {
		color: var(--line-bright);
	}

	.tmux-telemetry {
		display: none;
		align-items: baseline;
		color: var(--text-muted);
	}

	@media (min-width: 960px) {
		.tmux-telemetry {
			display: inline-flex;
		}
	}

	.meta-k {
		color: var(--text-muted);
		margin-right: 2px;
	}

	.meta-v {
		color: var(--text-color);
	}

	.meta-sep {
		color: var(--line-bright);
		margin: 0 3px;
	}

	.tmux-clock {
		color: var(--text-muted);
	}

	.clock-val {
		color: var(--primary-color);
		font-weight: 600;
	}

	/* Buttons in tmux bar */
	.tmux-btn {
		background: none;
		border: none;
		padding: 0.1rem 0.15rem;
		font-family: var(--font-mono);
		font-size: 0.78rem;
		color: var(--text-muted);
		cursor: pointer;
		display: inline-flex;
		align-items: baseline;
		transition: color 0.15s ease;
	}

	.tmux-btn:hover {
		color: var(--primary-color);
	}

	.tmux-btn:hover .meta-bracket {
		color: var(--primary-color);
	}

	.btn-k {
		color: var(--primary-color);
		font-weight: 700;
	}

	.theme-val {
		color: var(--text-color);
	}

	.notif-dot {
		color: #10b981;
		font-size: 0.65rem;
		margin-right: 2px;
	}

	.notif-btn.active .notif-dot {
		animation: blink 1s step-end infinite;
	}

	.notif-txt {
		color: var(--text-color);
	}

	/* Right segment */
	.tmux-right {
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	/* Vim mode indicator pill */
	.vim-mode-badge {
		font-family: var(--font-mono);
		font-size: 0.76rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		padding: 0 0.15rem;
		white-space: nowrap;
		transition:
			color 0.15s ease,
			background-color 0.15s ease;
	}

	.vim-mode-badge.mode-visual {
		color: var(--primary-color);
	}

	.vim-mode-badge.mode-insert {
		color: #10b981; /* terminal green – INSERT active */
	}

	/* Modals styling (Drawer & Man page) */
	.drawer-backdrop,
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 1.85rem;
		background-color: rgba(0, 0, 0, 0.65);
		backdrop-filter: blur(4px);
		z-index: 50;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 2.5rem 1.5rem 1.5rem;
	}

	.drawer-window,
	.modal-window {
		width: 100%;
		max-width: 680px;
		background-color: var(--bg-surface);
		border: 1px solid var(--line-color);
		box-shadow: 0 10px 40px -5px rgba(0, 0, 0, 0.6);
		border-radius: 4px;
		overflow: hidden;
		display: flex;
		flex-direction: column;
	}

	.drawer-titlebar,
	.modal-titlebar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.6rem 1rem;
		background-color: var(--bg-raised);
		border-bottom: 1px solid var(--line-color);
		font-size: 0.8rem;
	}

	.drawer-title,
	.modal-title {
		color: var(--text-color);
		font-weight: 600;
	}

	.drawer-close-btn,
	.modal-close-btn {
		background: none;
		border: none;
		color: var(--text-muted);
		font-family: var(--font-mono);
		font-size: 0.78rem;
		cursor: pointer;
		padding: 0;
	}

	.drawer-close-btn:hover,
	.modal-close-btn:hover {
		color: var(--primary-color);
	}

	.drawer-body,
	.modal-body {
		padding: 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
		font-size: 0.825rem;
		max-height: 75vh;
		overflow-y: auto;
	}

	.log-entries,
	.shortcuts-grid {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		padding: 0.75rem;
		background-color: var(--bg-raised);
		border: 1px solid var(--line-color);
	}

	.log-row {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.5rem;
		line-height: 1.5;
	}

	.log-time {
		color: var(--text-muted);
		font-size: 0.75rem;
	}

	.log-tag {
		font-weight: 700;
		font-size: 0.75rem;
	}

	.tag-ok {
		color: #10b981;
	}

	.tag-info {
		color: #3b82f6;
	}

	.tag-sys {
		color: var(--primary-color);
	}

	.log-msg {
		color: var(--text-color);
		flex: 1;
	}

	.drawer-footer,
	.modal-footer {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-top: 0.75rem;
		border-top: 1px dashed var(--line-color);
		font-size: 0.78rem;
	}

	.footer-hint {
		color: var(--text-muted);
		font-style: italic;
	}

	.footer-close-btn {
		background: none;
		border: 1px solid var(--line-color);
		padding: 0.2rem 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.75rem;
		color: var(--primary-color);
		cursor: pointer;
	}

	.footer-close-btn:hover {
		background-color: var(--bg-raised);
		border-color: var(--primary-color);
	}

	/* Man page typography */
	.man-section {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.man-heading {
		font-size: 0.82rem;
		font-weight: 700;
		color: var(--primary-color);
		margin: 0;
		letter-spacing: 0.05em;
	}

	.man-content {
		color: var(--text-color);
		margin: 0;
		line-height: 1.6;
	}

	.cmd-highlight {
		color: var(--primary-color);
		font-weight: 700;
	}

	.shortcut-item {
		display: grid;
		grid-template-columns: 130px 1fr;
		gap: 0.75rem;
		align-items: baseline;
	}

	.key-col {
		font-size: 0.78rem;
	}

	.desc-col {
		color: var(--text-muted);
		font-size: 0.8rem;
	}

	.desc-col code {
		color: var(--primary-color);
	}
</style>
