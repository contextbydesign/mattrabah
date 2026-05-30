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
  // look for draft: "true" or draft: "false" (quoted booleans)
  const draftQuoted = fm.match(/^draft:\s*['"]?(true|false|yes|no)['"]?$/im);

  const res = {};
  if (dateOnly) res.date = dateOnly[1];
  if (draftQuoted) res.draft = draftQuoted[1].toLowerCase();
  if (Object.keys(res).length === 0) return null;
  return { file, ...res };
}

async function fixFile(file, date, draft) {
  let content = await fs.readFile(file, 'utf8');
  let fixed = content;

  if (date) {
    fixed = fixed.replace(
      /^date:\s*"(\d{4}-\d{2}-\d{2})"/m,
      `date: "${date}T00:00:00Z"`
    );
  }

  if (draft) {
    // normalize yes/no to true/false
    const normalized = draft === 'yes' ? 'true' : draft === 'no' ? 'false' : draft;
    fixed = fixed.replace(
      /^draft:\s*['"]?(true|false|yes|no)['"]?/gim,
      `draft: ${normalized}`
    );
  }

  if (fixed !== content) {
    await fs.writeFile(file, fixed, 'utf8');
    return true;
  }
  return false;
}

async function main() {
  const args = process.argv.slice(2);
  const fix = args.includes('--fix');

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

  if (!fix) {
    console.log('Files with date-only or draft issues:');
    for (const f of found) console.log(
      ` - ${f.file}${f.date ? `: date=${f.date}` : ''}${f.draft ? `, draft=${f.draft}` : ''}`
    );
    console.log('\nRun with --fix to convert these to ISO-8601 datetimes and normalize `draft`.');
    process.exit(1);
  }

  console.log('Auto-fixing date-only frontmatter...');
  let changed = [];
  for (const f of found) {
    const ok = await fixFile(f.file, f.date, f.draft);
    if (ok) changed.push(f.file);
  }

  if (changed.length === 0) {
    console.log('No files needed fixing.');
    process.exit(0);
  }

  console.log('Fixed files:');
  for (const p of changed) console.log(` - ${p}`);
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(2); });
