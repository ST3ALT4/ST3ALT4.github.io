import { ROUTES } from '$lib/routes';
import type { BlogPostMeta } from '$lib/types';

export function renderMotd(): string {
	const dateStr = new Date().toLocaleString('en-US', {
		weekday: 'short',
		month: 'short',
		day: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
		second: '2-digit',
		hour12: false
	});
	return `
<div class="motd-output">
	<pre class="ascii-art" aria-hidden="true">
  ___ _____ ____   _    _  _____ _  _   
 / __|_   _|__ /  /_\\  | ||_   _| || |  
 \\__ \\ | |  |_ \\ / _ \\ | |__| | | || |_ 
 |___/ |_| |___//_/ \\_\\|____|_| |__   _|
                                   |_|  </pre>
	<p>welcome to st3alt4's terminal.</p>
	<p>type <span class="highlight">'help'</span> for available commands.</p>
	<p class="comment">last login: ${dateStr} from 127.0.0.1</p>
</div>
`;
}

export function renderHelp(): string {
	return `GNU bash, version 5.2.26(1)-release (x86_64-pc-linux-gnu)
Available interactive commands:

  whoami           print bio & summary
  sysinfo          display system & hardware specs
  skills           view technical skills
  projects         view tracked projects
  blog             navigate to blog directory (/blog)
  contact          view contact channels
  theme            toggle dark / light color scheme
  history          show command history
  date             display current date & time
  pwd              print working directory
  uname -a         print system architecture & kernel version
  clear            clear terminal
  echo [text]      print text arguments`;
}

export function renderWhoami(): string {
	return `
<div class="whoami-output">
	<h1 class="hero-name">Anikait</h1>
	<p class="hero-tagline">
		<span class="tagline-prompt">></span> explorer
	</p>
	<div class="bio-text">
		<p>
			hello, dear human(hopefully) recently i have found tech blogs to be the internet gem and
			it motivated me to start my own blog. although i am not a big fan of webdev but hey we
			can all vibe these days.
		</p>
		<p>
			Well i like most of tech, most of the time, i do find architecture cool, and also a
			recovering slop addict (currently i consider myself recoverd from light/web-novels,
			manhwa, manhua) i aspire to delete linkedin although i have never used it for anything
			other than scrolling. Other than that i do enjoy workout and football although i really
			need to bulk like a lot for that clean, lean and athletic build.
		</p>
	</div>
</div>`;
}

export function renderSysinfo(): string {
	return `
<div class="sysinfo-output">
	<div class="sysinfo-grid">
		<pre class="ascii-art" aria-hidden="true">
  ___ _____ ____   _    _  _____ _  _   
 / __|_   _|__ /  /_\\  | ||_   _| || |  
 \\__ \\ | |  |_ \\ / _ \\ | |__| | | || |_ 
 |___/ |_| |___//_/ \\_\\|____|_| |__   _|
                                   |_|  </pre>
		<div class="sys-specs-list">
			<div class="spec-row">
				<span class="spec-k">user:</span>
				<span class="spec-v highlight">st3alt4</span>
			</div>
			<div class="spec-row">
				<span class="spec-k">interest:</span>
				<span class="spec-v">High Performance Computing · Embedded · Digital Design · Compilers</span>
			</div>
			<div class="spec-row">
				<span class="spec-k">env:</span>
				<span class="spec-v">Arch btw!</span>
			</div>
			<div class="spec-row">
				<span class="spec-k">tooling:</span>
				<span class="spec-v">LLVM · Clang · GDB · Neovim</span>
			</div>
			<div class="spec-row">
				<span class="spec-k">status:</span>
				<span class="spec-v status-online">● fuck around and find out</span>
			</div>
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
</div>`;
}

export function renderSkills(skills: { label: string; value: string }[]): string {
	const rows = skills
		.map(
			(skill, i) => `
		<div class="code-line">
			<span class="line-num">${i + 1}</span>
			<span class="code-content">
				<span class="skill-name">${skill.label.padEnd(10, ' ')}</span>
				<span class="operator">:=</span>
				<span class="skill-value">${skill.value}</span>
			</span>
		</div>`
		)
		.join('');

	return `
<div class="skills-output">
	<div class="code-lines">
${rows}
	</div>
</div>`;
}

export function renderProjects(posts: BlogPostMeta[]): string {
	if (posts.length === 0) {
		return `
<div class="projects-output">
	<div class="empty-notice">
		<p class="comment">// no projects published yet</p>
	</div>
</div>`;
	}

	const rows = posts
		.map((project, index) => {
			const techStack = project.tags.filter((t) => t.toLowerCase() !== 'project');
			const branch = index === posts.length - 1 ? '└──' : '├──';
			const pipe = index === posts.length - 1 ? '   ' : '│  ';
			const tagsHtml =
				techStack.length > 0 ? `<span class="node-tags">[${techStack.join(' · ')}]</span>` : '';
			const descHtml = project.description
				? `
			<div class="tree-body-row">
				<span class="tree-pipe">${pipe}</span>
				<p class="node-desc">${project.description}</p>
			</div>`
				: '';

			return `
		<div class="tree-node">
			<div class="tree-header-row">
				<span class="tree-branch">${branch}</span>
				<a href="${ROUTES.home.blog(project.slug)}" class="node-title">${project.title}</a>
				${tagsHtml}
			</div>
			${descHtml}
		</div>`;
		})
		.join('');

	return `
<div class="projects-output">
	<div class="projects-tree-view">
${rows}
	</div>
</div>`;
}

export function renderContact(): string {
	return `
<div class="contact-output">
	<p class="contact-bio">
		Focused on compiler internals, low-level tooling, custom CUDA kernels, and real-time
		embedded devices. Always open to conversations, experiments, and technical collaborations.
	</p>
	<div class="contact-channels">
		<div class="channel-row">
			<span class="channel-arrow">→</span>
			<span class="channel-label">email:</span>
			<a href="mailto:anikait749@email.com" class="cmd-link">anikait749@email.com</a>
		</div>
		<div class="channel-row">
			<span class="channel-arrow">→</span>
			<span class="channel-label">github:</span>
			<a href="https://github.com/ST3ALT4" target="_blank" rel="noopener noreferrer" class="cmd-link">github.com/ST3ALT4</a>
		</div>
		<div class="channel-row">
			<span class="channel-arrow">→</span>
			<span class="channel-label">pgp:</span>
			<span class="channel-muted">available on request</span>
		</div>
	</div>
	<div class="contact-colophon">
		<span class="comment">// built with sveltekit & mdsvex · hosted on github pages · 2026</span>
	</div>
</div>`;
}

export function renderHistory(history: string[]): string {
	return history.map((cmd, i) => `  ${String(i + 1).padStart(4, ' ')}  ${cmd}`).join('\n');
}
