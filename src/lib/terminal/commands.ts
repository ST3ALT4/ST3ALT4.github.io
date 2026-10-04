import type { BlogPostMeta } from '$lib/types';
import {
	renderMotd,
	renderHelp,
	renderWhoami,
	renderSysinfo,
	renderSkills,
	renderProjects,
	renderContact,
	renderHistory
} from './outputs';

export interface CommandResult {
	type: 'output' | 'error' | 'navigate' | 'action';
	content?: string; // plain text
	html?: string; // rich HTML
	navigateTo?: string;
	action?: 'clear' | 'theme' | 'man';
}

export interface CommandContext {
	projectPosts: BlogPostMeta[];
	commandHistory: string[];
}

export const SKILLS = [
	{ label: 'languages', value: 'C, C++, Rust, Python, Verilog' },
	{ label: 'systems', value: 'LLVM, Make, Git, Docker, Kubernetes' },
	{ label: 'embedded', value: 'Jetson Nano, ESP-32, Arduino' },
	{ label: 'gpu', value: 'CUDA, CUDA Python, Numba, CuPy, TensorRT, Vulkan' },
	{ label: 'data / ml', value: 'DALI, NumPy, pandas, OpenCV, PyTorch' }
];

export const COMMAND_LIST = [
	'help',
	'whoami',
	'sysinfo',
	'neofetch',
	'fastfetch',
	'skills',
	'projects',
	'blog',
	'contact',
	'theme',
	'history',
	'clear',
	'cls',
	'date',
	'pwd',
	'uname',
	'echo',
	'cat',
	'ls',
	'cd',
	'man'
];

export function executeCommand(raw: string, context: CommandContext): CommandResult {
	const trimmed = raw.trim();
	if (!trimmed) {
		return { type: 'output', content: '' };
	}

	const tokens = trimmed.split(/\s+/);
	const baseCmd = tokens[0].toLowerCase();
	const args = tokens.slice(1).join(' ');

	if (baseCmd === 'clear' || baseCmd === 'cls') {
		return { type: 'action', action: 'clear' };
	}
	if (baseCmd === 'help') {
		return { type: 'output', content: renderHelp() };
	}
	if (baseCmd === 'whoami') {
		return { type: 'output', html: renderWhoami() };
	}
	if (baseCmd === 'sysinfo' || baseCmd === 'neofetch' || baseCmd === 'fastfetch') {
		return { type: 'output', html: renderSysinfo() };
	}
	if (baseCmd === 'skills' || (baseCmd === 'cat' && args.toLowerCase().includes('skills'))) {
		return { type: 'output', html: renderSkills(SKILLS) };
	}
	if (
		baseCmd === 'projects' ||
		(baseCmd === 'ls' &&
			(args.toLowerCase().includes('project') || args === '-l' || args === '-la' || args === ''))
	) {
		return { type: 'output', html: renderProjects(context.projectPosts) };
	}
	if (baseCmd === 'blog' || (baseCmd === 'cd' && args.toLowerCase().includes('blog'))) {
		return { type: 'navigate', content: 'Navigating to ~/blog...', navigateTo: '/blog' };
	}
	if (baseCmd === 'contact' || (baseCmd === 'cat' && args.toLowerCase().includes('contact'))) {
		return { type: 'output', html: renderContact() };
	}
	if (baseCmd === 'theme') {
		return { type: 'action', action: 'theme' };
	}
	if (baseCmd === 'pwd') {
		return { type: 'output', content: '/home/st3alt4' };
	}
	if (baseCmd === 'date') {
		return { type: 'output', content: new Date().toString() };
	}
	if (baseCmd === 'uname') {
		return {
			type: 'output',
			content: 'Linux st3alt4 6.10.8-arch1-1 #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux'
		};
	}
	if (baseCmd === 'echo') {
		return { type: 'output', content: args };
	}
	if (baseCmd === 'history') {
		return { type: 'output', content: renderHistory(context.commandHistory) };
	}
	if (baseCmd === 'man') {
		return { type: 'action', action: 'man' };
	}

	return {
		type: 'error',
		content: `bash: ${tokens[0]}: command not found. Type 'help' for available commands.`
	};
}

export function getMotd(): string {
	return renderMotd();
}

export function getTabCompletion(partial: string): string | null {
	const match = COMMAND_LIST.find((s) => s.startsWith(partial.toLowerCase().trim()));
	return match || null;
}
