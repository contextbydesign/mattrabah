#!/usr/bin/env node
import { promises as fs } from 'fs';
import path from 'path';

const roots = [
  path.resolve(process.cwd(), 'src/content'),
  path.resolve(process.cwd(), 'content'),
];

function isMarkdown(file) {
  return /\.mdx?$|\.markdown$/i.test(file);
}

async function walk(dir) {
  let results = [];
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const res = path.join(dir, e.name);
    if (e.isDirectory()) results = results.concat(await walk(res));
    else if (e.isFile() && isMarkdown(res)) results.push(res);
  }
  return results;
}

async function checkFile(file) {
  const content = await fs.readFile(file, 'utf8');
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!fmMatch) return null;
  const fm = fmMatch[1];
  // look for date: "YYYY-MM-DD" (date-only)
  const dateOnly = fm.match(/^date:\s*"(\d{4}-\d{2}-\d{2})"$/m);
  if (dateOnly) return { file, date: dateOnly[1] };
  return null;
}

async function main() {
  let found = [];
  for (const root of roots) {
    try {
      const files = await walk(root);
      for (const f of files) {
        const res = await checkFile(f);
        if (res) found.push(res);
      }
    } catch (err) {
      // ignore missing dirs
    }
  }

  if (found.length === 0) {
    console.log('No date-only frontmatter found.');
    process.exit(0);
  }

  console.log('Files with date-only frontmatter:');
  for (const f of found) console.log(` - ${f.file}: ${f.date}`);
  console.log('\nConsider normalizing to ISO-8601 like "2026-05-30T00:00:00Z".');
  process.exit(1);
}

main().catch((e) => { console.error(e); process.exit(2); });
