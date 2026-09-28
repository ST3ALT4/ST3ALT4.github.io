<footer id="contact" class="site-footer">
	<div class="footer-inner">
		<!-- Statusline / Info Panel -->
		<div class="terminal-statusline">
			<div class="status-left">
				<span class="status-badge">READY</span>
				<span class="status-item"><span class="muted">host:</span> thapar-inst</span>
				<span class="status-item"><span class="muted">role:</span> ece-student</span>
				<span class="status-item"><span class="muted">target:</span> systems/gpu/embedded</span>
			</div>
			<div class="status-right">
				<span class="status-item"><span class="muted">branch:</span> [main]</span>
				<span class="status-item"><span class="muted">encoding:</span> UTF-8</span>
			</div>
		</div>

		<!-- Main Footer Content Grid -->
		<div class="footer-content-grid">
			<div class="footer-col bio-col">
				<div class="prompt-header">
					<span class="prompt">$</span>
					<span class="header-cmd">cat ~/.contact</span>
				</div>
				<p class="status-bio">
					Electronics & Computer Engineering @ Thapar Institute. Focused on compiler internals,
					low-level tooling, custom CUDA kernels, and real-time embedded devices. Always open to
					conversations, experiments, and technical collaborations.
				</p>
			</div>

			<div class="footer-col links-col">
				<div class="prompt-header">
					<span class="prompt">$</span>
					<span class="header-cmd">echo $CHANNELS</span>
				</div>
				<ul class="channel-list">
					<li>
						<span class="channel-arrow">→</span>
						<span class="channel-label">email:</span>
						<a href="mailto:anikait749@email.com" class="terminal-link">anikait749@email.com</a>
					</li>
					<li>
						<span class="channel-arrow">→</span>
						<span class="channel-label">github:</span>
						<a
							href="https://github.com/ST3ALT4"
							target="_blank"
							rel="noopener noreferrer"
							class="terminal-link">github.com/ST3ALT4</a
						>
					</li>
					<li>
						<span class="channel-arrow">→</span>
						<span class="channel-label">pgp:</span>
						<span class="channel-val muted">available on request</span>
					</li>
				</ul>
			</div>
		</div>

		<!-- Bottom Colophon Bar -->
		<div class="colophon-bar">
			<span class="colophon-text"
				>built with sveltekit & mdsvex · hosted on github pages · 2026</span
			>
			<span class="colophon-shortcut">press <kbd>t</kbd> to toggle theme</span>
		</div>
	</div>
</footer>

<style>
	.site-footer {
		width: 100%;
		border-top: 1px solid var(--line-color);
		margin-top: 6rem;
		background-color: var(--bg-surface);
		padding: 2.5rem 1.5rem 2rem;
		font-size: 0.85rem;
	}

	@media (min-width: 768px) {
		.site-footer {
			padding: 3rem 2.5rem 2.5rem;
		}
	}

	.footer-inner {
		max-width: 1200px;
		margin: 0 auto;
		display: flex;
		flex-direction: column;
		gap: 2rem;
	}

	/* Terminal statusline */
	.terminal-statusline {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
		padding: 0.5rem 0.75rem;
		background-color: var(--bg-raised);
		border: 1px solid var(--line-color);
		font-size: 0.75rem;
	}

	.status-left,
	.status-right {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 1rem;
	}

	.status-badge {
		background-color: var(--primary-color);
		color: var(--bg-color);
		font-weight: 700;
		padding: 0.1rem 0.4rem;
		letter-spacing: 0.05em;
	}

	.status-item {
		color: var(--text-color);
	}

	.muted {
		color: var(--text-muted);
	}

	/* Main grid */
	.footer-content-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
	}

	@media (min-width: 768px) {
		.footer-content-grid {
			grid-template-columns: 3fr 2fr;
			gap: 3rem;
		}
	}

	.footer-col {
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.prompt-header {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		font-size: 0.9rem;
	}

	.prompt {
		color: var(--primary-color);
		font-weight: 700;
	}

	.header-cmd {
		color: var(--text-color);
		font-weight: 600;
	}

	.status-bio {
		color: var(--text-color);
		line-height: 1.65;
		margin: 0;
	}

	.channel-list {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.channel-list li {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.5rem;
	}

	.channel-arrow {
		color: var(--primary-color);
		font-weight: 700;
	}

	.channel-label {
		color: var(--text-muted);
		width: 60px;
	}

	.terminal-link {
		color: var(--primary-color);
		text-decoration: none;
	}

	.terminal-link:hover {
		text-decoration: underline;
	}

	.channel-val {
		font-size: 0.8rem;
	}

	/* Colophon bar */
	.colophon-bar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		border-top: 1px dashed var(--line-color);
		padding-top: 1.25rem;
		color: var(--text-muted);
		font-size: 0.78rem;
	}

	kbd {
		background-color: var(--bg-raised);
		border: 1px solid var(--line-bright);
		padding: 0.1rem 0.35rem;
		font-size: 0.75rem;
		color: var(--primary-color);
	}

	@media (max-width: 640px) {
		.colophon-shortcut {
			display: none;
		}
	}
</style>
