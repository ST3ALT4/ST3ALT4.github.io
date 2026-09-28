<script lang="ts">
	import { BLOG_CATEGORIES, type BlogPostMeta } from '$lib/types';
	import { ROUTES } from '$lib/routes';

	let { data }: { data: { projectPosts: BlogPostMeta[] } } = $props();

	const skills = [
		{ label: 'languages', value: 'C, C++, Rust, Python' },
		{ label: 'systems', value: 'Linux, LLVM, Clang, GDB, Make, Git, Docker, Kubernetes' },
		{ label: 'embedded', value: 'Jetson Nano, ESP-32, Arduino, Verilog' },
		{ label: 'gpu', value: 'CUDA, CUDA Python, Numba, CuPy, TensorRT, Vulkan' },
		{ label: 'data / ml', value: 'DALI, NumPy, pandas, OpenCV, PyTorch' }
	];
</script>

<div class="workspace-container">
	<!-- TOP SECTION: Split Hero & Neofetch Terminal Console -->
	<section class="hero-split-grid">
		<!-- Left: Whoami, Bio & Prompt Actions -->
		<div class="hero-main-card">
			<div class="panel-header">
				<span class="panel-tag">SESSION: LOCAL</span>
				<span class="panel-cmd">$ whoami --verbose</span>
			</div>

			<div class="hero-body">
				<h1 class="hero-name">Anikait</h1>
				<p class="hero-tagline">
					<span class="tagline-prompt">></span> explorer 
				</p>

				<div class="bio-text">
					<p>
            I enjoy exploring wether it's software, hardware, architecture, slop stories
            whatever catches my fancy other than that recently the sportsman inside me
            came back and i am 
					</p>
					<p>
					</p>
				</div>

				<div class="quick-terminal-nav">
					<div class="nav-entry">
						<span class="prompt">$</span>
						<a href="#projects" class="cmd-link">cd projects/</a>
					</div>
					<div class="nav-entry">
						<span class="prompt">$</span>
						<a href={ROUTES.home.blogList} class="cmd-link">cat blog/</a>
					</div>
					<div class="nav-entry">
						<span class="prompt">$</span>
						<a href="#contact" class="cmd-link">cat contact.txt</a>
					</div>
				</div>
			</div>
		</div>

		<!-- Right: Neofetch Hardware & System Spec Box -->
		<div class="neofetch-card">
			<div class="panel-header">
				<span class="panel-dots" aria-hidden="true">
					<span class="p-dot"></span>
					<span class="p-dot"></span>
					<span class="p-dot"></span>
				</span>
				<span class="panel-cmd">sysinfo --target</span>
			</div>

			<div class="neofetch-content">
				<!-- Monospace ASCII Logo -->
				<pre class="ascii-art" aria-hidden="true">
  ___ _____ ____   _    _  _____ _  _   
 / __|_   _|__ /  /_\  | ||_   _| || |  
 \__ \ | |  |_ \ / _ \ | |__| | | || |_ 
 |___/ |_| |___//_/ \_\|____|_| |__   _|
                                   |_|  </pre>

				<div class="sys-specs-list">
					<div class="spec-row">
						<span class="spec-k">user:</span>
						<span class="spec-v highlight">st3alt4</span>
					</div>
					<div class="spec-row">
						<span class="spec-k">institute:</span>
						<span class="spec-v">Thapar Institute (ECE)</span>
					</div>
					<div class="spec-row">
						<span class="spec-k">focus:</span>
						<span class="spec-v">Compilers · CUDA · Embedded</span>
					</div>
					<div class="spec-row">
						<span class="spec-k">env:</span>
						<span class="spec-v">Linux x86_64 / aarch64</span>
					</div>
					<div class="spec-row">
						<span class="spec-k">tooling:</span>
						<span class="spec-v">LLVM · Clang · GDB · Neovim</span>
					</div>
					<div class="spec-row">
						<span class="spec-k">status:</span>
						<span class="spec-v status-online">● tinkering & building</span>
					</div>
				</div>

				<!-- Terminal color blocks test -->
				<div class="color-blocks" aria-hidden="true">
					<span class="c-block cb-black"></span>
					<span class="c-block cb-red"></span>
					<span class="c-block cb-green"></span>
					<span class="c-block cb-yellow"></span>
					<span class="c-block cb-blue"></span>
					<span class="c-block cb-magenta"></span>
					<span class="c-block cb-cyan"></span>
					<span class="c-block cb-white"></span>
				</div>
			</div>
		</div>
	</section>

	<!-- MIDDLE SECTION: Dual-Panel Grid (Skills Buffer & Projects Tree) -->
	<section class="dual-panel-grid" id="projects">
		<!-- Left Panel: $ cat skills.txt -->
		<div class="terminal-panel">
			<div class="panel-header">
				<span class="prompt">$</span>
				<span class="panel-cmd">cat skills.txt</span>
				<span class="panel-meta">[RO · 5 lines]</span>
			</div>

			<div class="panel-buffer">
				<div class="code-lines">
					{#each skills as skill, i (skill.label)}
						<div class="code-line">
							<span class="line-num">{i + 1}</span>
							<span class="code-content">
								<span class="skill-name">{skill.label.padEnd(10, ' ')}</span>
								<span class="operator">:=</span>
								<span class="skill-value">{skill.value}</span>
							</span>
						</div>
					{/each}
				</div>
			</div>

			<div class="panel-status-bar">
				<span>skills.txt 100% 5/5</span>
				<span>[ascii]</span>
			</div>
		</div>

		<!-- Right Panel: $ ls projects/ (dynamic from tag: 'project') -->
		<div class="terminal-panel">
			<div class="panel-header">
				<span class="prompt">$</span>
				<span class="panel-cmd">ls -l projects/</span>
				<span class="panel-meta">[{data.projectPosts.length} tracked]</span>
			</div>

			<div class="panel-buffer">
				{#if data.projectPosts.length > 0}
					<div class="projects-tree-view">
						{#each data.projectPosts as project, index (project.slug)}
							{@const techStack = project.tags.filter((t) => t.toLowerCase() !== 'project')}
							<div class="tree-node">
								<div class="tree-header-row">
									<span class="tree-branch"
										>{index === data.projectPosts.length - 1 ? '└──' : '├──'}</span
									>
									<a href={ROUTES.home.blog(project.slug)} class="node-title">
										{project.title}
									</a>
									{#if techStack.length > 0}
										<span class="node-tags">[{techStack.join(' · ')}]</span>
									{/if}
								</div>
								{#if project.description}
									<div class="tree-body-row">
										<span class="tree-pipe"
											>{index === data.projectPosts.length - 1 ? '   ' : '│  '}</span
										>
										<p class="node-desc">{project.description}</p>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{:else}
					<div class="empty-notice">
						<p class="comment">// no projects published yet — tag any blog post with 'project'</p>
					</div>
				{/if}
			</div>

			<div class="panel-status-bar">
				<span>dir: projects/</span>
				<span class="status-action">
					<a href={ROUTES.home.blogList} class="panel-link">all entries →</a>
				</span>
			</div>
		</div>
	</section>

	<!-- BOTTOM SECTION: $ ls blog/ Directory -->
	<section class="terminal-panel full-width-panel">
		<div class="panel-header">
			<span class="prompt">$</span>
			<span class="panel-cmd">ls -la blog/</span>
			<span class="panel-meta">[categories & topics]</span>
		</div>

		<div class="panel-buffer blog-category-layout">
			<div class="categories-grid">
				{#each BLOG_CATEGORIES as category, index (category.slug)}
					<a href="{ROUTES.home.blogList}#{category.slug}" class="category-block">
						<div class="cat-line-top">
							<span class="cat-prefix">{index === BLOG_CATEGORIES.length - 1 ? '└──' : '├──'}</span>
							<span class="cat-slug">{category.slug}/</span>
						</div>
						<p class="cat-desc">{category.description}</p>
						<span class="cat-action">open folder →</span>
					</a>
				{/each}
			</div>
		</div>

		<div class="panel-status-bar">
			<span class="comment">// articles, project logs & notes</span>
			<a href={ROUTES.home.blogList} class="panel-link">view all blog posts →</a>
		</div>
	</section>
</div>

<style>
	.workspace-container {
		display: flex;
		flex-direction: column;
		gap: 3.5rem;
		width: 100%;
	}

	/* TOP SECTION: Split Grid */
	.hero-split-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.75rem;
	}

	@media (min-width: 960px) {
		.hero-split-grid {
			grid-template-columns: 1.25fr 1fr;
			align-items: stretch;
		}
	}

	/* Panel Cards Shared */
	.hero-main-card,
	.neofetch-card,
	.terminal-panel {
		background-color: var(--bg-surface);
		border: 1px solid var(--line-color);
		display: flex;
		flex-direction: column;
		position: relative;
	}

	.panel-header {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem;
		padding: 0.6rem 1rem;
		border-bottom: 1px solid var(--line-color);
		background-color: var(--bg-raised);
		font-size: 0.8rem;
	}

	.panel-tag {
		background-color: color-mix(in srgb, var(--primary-color), transparent 85%);
		color: var(--primary-color);
		padding: 0.1rem 0.35rem;
		font-weight: 700;
		font-size: 0.7rem;
		letter-spacing: 0.05em;
	}

	.panel-dots {
		display: flex;
		gap: 0.3rem;
	}

	.p-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: var(--line-bright);
	}

	.panel-cmd {
		color: var(--text-color);
		font-weight: 600;
	}

	.panel-meta {
		margin-left: auto;
		color: var(--text-muted);
		font-size: 0.75rem;
	}

	.prompt {
		color: var(--primary-color);
		font-weight: 700;
	}

	/* Hero Main Card Content */
	.hero-body {
		padding: 1.5rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		flex: 1;
	}

	@media (min-width: 640px) {
		.hero-body {
			padding: 2rem 1.75rem;
		}
	}

	.hero-name {
		font-size: clamp(1.8rem, 3.5vw, 2.6rem);
		font-weight: 700;
		color: var(--text-color);
		margin: 0;
		letter-spacing: -0.02em;
		line-height: 1.15;
	}

	.hero-tagline {
		font-size: 0.95rem;
		color: var(--primary-color);
		margin: 0;
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
	}

	.tagline-prompt {
		color: var(--text-muted);
	}

	.bio-text {
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		color: var(--text-color);
		font-size: 0.95rem;
		line-height: 1.7;
	}

	.bio-text p {
		margin: 0;
	}

	.quick-terminal-nav {
		display: flex;
		flex-wrap: wrap;
		gap: 1.25rem;
		padding-top: 1rem;
		border-top: 1px dashed var(--line-color);
		font-size: 0.875rem;
	}

	.nav-entry {
		display: flex;
		align-items: baseline;
		gap: 0.35rem;
	}

	.cmd-link {
		color: var(--primary-color);
		text-decoration: none;
		font-weight: 600;
	}

	.cmd-link:hover {
		text-decoration: underline;
	}

	/* Neofetch Card Content */
	.neofetch-content {
		padding: 1.25rem 1.25rem;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		justify-content: space-between;
		flex: 1;
	}

	.ascii-art {
		color: var(--primary-color);
		font-size: clamp(0.55rem, 1.2vw, 0.72rem);
		line-height: 1.2;
		white-space: pre;
		margin: 0;
		overflow-x: auto;
		user-select: none;
	}

	.sys-specs-list {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
		font-size: 0.825rem;
	}

	.spec-row {
		display: grid;
		grid-template-columns: 85px 1fr;
		gap: 0.5rem;
		align-items: baseline;
	}

	.spec-k {
		color: var(--text-muted);
		text-align: right;
	}

	.spec-v {
		color: var(--text-color);
	}

	.spec-v.highlight {
		color: var(--primary-color);
		font-weight: 700;
	}

	.status-online {
		color: #10b981;
		font-size: 0.8rem;
	}

	.color-blocks {
		display: flex;
		gap: 0.35rem;
		padding-top: 0.5rem;
		border-top: 1px dashed var(--line-color);
	}

	.c-block {
		width: 14px;
		height: 14px;
		display: inline-block;
	}

	.cb-black {
		background-color: #242019;
	}
	.cb-red {
		background-color: #ef4444;
	}
	.cb-green {
		background-color: #10b981;
	}
	.cb-yellow {
		background-color: #f59e0b;
	}
	.cb-blue {
		background-color: #3b82f6;
	}
	.cb-magenta {
		background-color: #ec4899;
	}
	.cb-cyan {
		background-color: #06b6d4;
	}
	.cb-white {
		background-color: #f1eae0;
	}

	/* MIDDLE SECTION: Dual Panel Grid */
	.dual-panel-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.75rem;
	}

	@media (min-width: 960px) {
		.dual-panel-grid {
			grid-template-columns: 1fr 1fr;
		}
	}

	.panel-buffer {
		padding: 1.25rem 1.25rem;
		flex: 1;
	}

	.panel-status-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.4rem 1rem;
		background-color: var(--bg-raised);
		border-top: 1px solid var(--line-color);
		font-size: 0.75rem;
		color: var(--text-muted);
	}

	.panel-link {
		color: var(--primary-color);
		text-decoration: none;
	}

	.panel-link:hover {
		text-decoration: underline;
	}

	/* Code Lines in Skills Buffer */
	.code-lines {
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
		font-size: 0.85rem;
	}

	.code-line {
		display: flex;
		align-items: baseline;
		gap: 0.85rem;
	}

	.line-num {
		color: var(--line-bright);
		width: 15px;
		text-align: right;
		user-select: none;
		font-size: 0.78rem;
	}

	.code-content {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.4rem;
	}

	.skill-name {
		color: var(--primary-color);
		font-weight: 600;
	}

	.operator {
		color: var(--text-muted);
		user-select: none;
	}

	.skill-value {
		color: var(--text-color);
		line-height: 1.5;
	}

	/* Projects Tree View */
	.projects-tree-view {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		font-size: 0.875rem;
	}

	.tree-node {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.tree-header-row {
		display: flex;
		flex-wrap: wrap;
		align-items: baseline;
		gap: 0.5rem;
	}

	.tree-branch,
	.tree-pipe {
		color: var(--line-bright);
		font-family: var(--font-mono);
		user-select: none;
		white-space: pre;
	}

	.node-title {
		color: var(--primary-color);
		font-weight: 700;
		text-decoration: none;
	}

	.node-title:hover {
		text-decoration: underline;
	}

	.node-tags {
		color: var(--text-muted);
		font-size: 0.78rem;
	}

	.tree-body-row {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
	}

	.node-desc {
		color: var(--text-color);
		font-size: 0.825rem;
		line-height: 1.6;
		margin: 0;
	}

	.empty-notice {
		padding: 2rem 0;
		text-align: center;
	}

	.comment {
		color: var(--text-muted);
		font-style: italic;
		font-size: 0.85rem;
		margin: 0;
	}

	/* BOTTOM SECTION: Categories Grid */
	.full-width-panel {
		width: 100%;
	}

	.categories-grid {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.25rem;
	}

	@media (min-width: 640px) {
		.categories-grid {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	.category-block {
		border: 1px solid var(--line-color);
		padding: 1.25rem 1rem;
		text-decoration: none;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		background-color: var(--bg-raised);
		transition: all 0.15s ease;
	}

	.category-block:hover {
		border-color: var(--primary-color);
		transform: translateY(-1px);
	}

	.cat-line-top {
		display: flex;
		align-items: baseline;
		gap: 0.4rem;
	}

	.cat-prefix {
		color: var(--line-bright);
		user-select: none;
	}

	.cat-slug {
		color: var(--primary-color);
		font-weight: 700;
		font-size: 0.95rem;
	}

	.cat-desc {
		color: var(--text-color);
		font-size: 0.825rem;
		line-height: 1.5;
		margin: 0;
		flex: 1;
	}

	.cat-action {
		color: var(--text-muted);
		font-size: 0.78rem;
		align-self: flex-start;
	}

	.category-block:hover .cat-action {
		color: var(--primary-color);
	}
</style>
