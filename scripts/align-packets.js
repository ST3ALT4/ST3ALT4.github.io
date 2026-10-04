import fs from 'node:fs';
import path from 'node:path';

const MSS = 1460;
const BUILD_DIR = path.resolve('build');

function walk(dir) {
	let results = [];
	const list = fs.readdirSync(dir);
	for (const file of list) {
		const fullPath = path.join(dir, file);
		const stat = fs.statSync(fullPath);
		if (stat && stat.isDirectory()) {
			results = results.concat(walk(fullPath));
		} else if (file.endsWith('.html')) {
			results.push(fullPath);
		}
	}
	return results;
}

function minifyHtmlPreservingPre(html) {
	// Strip previous padding if running repeatedly
	const unpadded = html.replace(/<!-- 1460b-pad:[\s\S]*?-->/g, '').trimEnd();

	// Preserve <pre> and <code> blocks by tokenizing them
	const preBlocks = [];
	let tokenized = unpadded.replace(/<pre[\s\S]*?<\/pre>/gi, (match) => {
		preBlocks.push(match);
		return `___PRE_BLOCK_${preBlocks.length - 1}___`;
	});

	// Collapse multiple spaces/newlines outside pre blocks
	tokenized = tokenized
		.replace(/^[ \t]+/gm, '') // Remove leading whitespace per line
		.replace(/[ \t]+$/gm, '') // Remove trailing whitespace per line
		.replace(/\n{2,}/g, '\n') // Collapse multiple empty lines
		.replace(/>\s+</g, '><'); // Remove spaces between tags where safe

	// Restore pre blocks
	let restored = tokenized.replace(/___PRE_BLOCK_(\d+)___/g, (_, index) => {
		return preBlocks[Number(index)];
	});

	return restored.trim();
}

function alignFileToMss(filePath) {
	const raw = fs.readFileSync(filePath, 'utf8');
	const minified = minifyHtmlPreservingPre(raw);
	const initialBytes = Buffer.byteLength(minified, 'utf8');

	const rem = initialBytes % MSS;
	const padNeeded = (MSS - rem) % MSS;

	const PREFIX = '<!-- 1460b-pad:';
	const SUFFIX = '-->';
	const overhead = Buffer.byteLength(PREFIX + SUFFIX, 'utf8');

	let padded = minified;
	if (padNeeded >= overhead) {
		const fillLen = padNeeded - overhead;
		padded = minified + `${PREFIX}${'#'.repeat(fillLen)}${SUFFIX}`;
	} else if (padNeeded > 0) {
		// If needed padding is smaller than comment overhead, pad with trailing whitespace
		padded = minified + ' '.repeat(padNeeded);
	}

	const finalBytes = Buffer.byteLength(padded, 'utf8');
	const packetCount = Math.round(finalBytes / MSS);
	const isAligned = finalBytes % MSS === 0;

	fs.writeFileSync(filePath, padded, 'utf8');

	return {
		relPath: path.relative(BUILD_DIR, filePath),
		initialBytes,
		padAdded: padNeeded,
		finalBytes,
		packetCount,
		isAligned
	};
}

function run() {
	if (!fs.existsSync(BUILD_DIR)) {
		console.error(`Build directory '${BUILD_DIR}' not found. Run 'vite build' first.`);
		process.exit(1);
	}

	const htmlFiles = walk(BUILD_DIR);
	console.log('\n========================================================================');
	console.log('⚡ TCP MSS (1460 BYTE) PACKET ALIGNMENT & PERFORMANCE OPTIMIZER');
	console.log('========================================================================');
	console.log(
		`${'File'.padEnd(25)} | ${'Initial'.padStart(8)} | ${'Padding'.padStart(8)} | ${'Final'.padStart(8)} | ${'Packets'.padStart(8)} | Status`
	);
	console.log('------------------------------------------------------------------------');

	let allPassed = true;
	for (const file of htmlFiles) {
		const res = alignFileToMss(file);
		if (!res.isAligned) allPassed = false;

		const status = res.isAligned && res.packetCount <= 10 ? '✓ PASS (<=14KB)' : '✗ FAIL';
		console.log(
			`${res.relPath.padEnd(25)} | ${(res.initialBytes + ' B').padStart(8)} | ${(res.padAdded + ' B').padStart(8)} | ${(res.finalBytes + ' B').padStart(8)} | ${(res.packetCount + ' pkts').padStart(8)} | ${status}`
		);
	}
	console.log('========================================================================\n');

	if (!allPassed) {
		console.error('Error: Not all files were aligned to 1460-byte multiples.');
		process.exit(1);
	}
}

run();
