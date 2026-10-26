import fs from 'fs';
import path from 'path';

const postsJson = JSON.parse(fs.readFileSync('posts.json', 'utf8'));
const postsDir = 'posts';
const outDir = path.join('src', 'content', 'posts');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Map of slug -> json metadata
const jsonMap = new Map();
for (const p of postsJson) {
  const base = path.basename(p.slug, '.html');
  jsonMap.set(base, p);
}

const htmlFiles = fs.readdirSync(postsDir).filter(f => f.endsWith('.html'));

let migratedCount = 0;

for (const file of htmlFiles) {
  const slug = path.basename(file, '.html');
  if (slug === 'test') continue; // Skip test file

  const filePath = path.join(postsDir, file);
  const rawHtml = fs.readFileSync(filePath, 'utf8');

  let title = '';
  let subtitle = '';
  let description = '';
  let cover = '';
  let date = '2026-01-01';
  let series = undefined;
  let order = undefined;
  let tags = undefined;
  let draft = false;

  const jsonEntry = jsonMap.get(slug);

  if (jsonEntry) {
    title = jsonEntry.title;
    subtitle = jsonEntry.subtitle || '';
    cover = jsonEntry.cover ? (jsonEntry.cover.startsWith('/') ? jsonEntry.cover : '/' + jsonEntry.cover) : '';
    date = jsonEntry.date || date;
    series = jsonEntry.series;
    order = jsonEntry.order;
    tags = jsonEntry.tags;
    draft = false;
  } else {
    // Draft or unlisted post (like pull-up resistors or ultrasonic sensor)
    draft = true;
    const titleMatch = rawHtml.match(/<title>(.*?)<\/title>/i);
    title = titleMatch ? titleMatch[1].replace(/ — Silicon Pen.*$/i, '').trim() : slug;

    const h1Match = rawHtml.match(/<h1 class="post-title-main">([\s\S]*?)(?:<\/h1>|<p class="post-subtitle-bar"|<\/header>)/i);
    if (h1Match) {
      title = h1Match[1].replace(/<!--[\s\S]*?-->/g, '').replace(/<br\s*\/?>/gi, ' - ').replace(/\r?\n/g, ' ').trim();
    }

    const subMatch = rawHtml.match(/<p class="post-subtitle-bar">([\s\S]*?)<\/p>/i);
    if (subMatch) {
      subtitle = subMatch[1].trim().replace(/^["“]|["”]$/g, '');
    }

    const coverMatch = rawHtml.match(/class="post-hero-image"[\s\S]*?src=["'](.*?)["']/i) ||
                       rawHtml.match(/src=["'](.*?)["'][\s\S]*?class="post-hero-image"/i);
    if (coverMatch) {
      cover = coverMatch[1].replace(/^\.\.\//, '/');
    }

    if (slug.includes('pull-up') || slug.includes('ultrasonic')) {
      series = 'pathway-to-arduino';
      cover = cover || '/images/pathway-to-arduino/cover.webp';
    }
  }

  // Extract meta description
  const descMatch = rawHtml.match(/<meta\s+name=["']description["']\s+content=["'](.*?)["']/i);
  if (descMatch) {
    description = descMatch[1].trim();
  }
  if (!description && subtitle) {
    description = subtitle;
  }

  // Extract post-content
  const contentStartMatch = rawHtml.match(/<div class=["']post-content["']>([\s\S]*)/i);
  let content = '';

  if (contentStartMatch) {
    let rawContent = contentStartMatch[1];
    // Strip trailing layout elements (newsletter, TOC, footer extra, etc.)
    const stopMarkers = [
      /<div id=["']newsletter["']>/i,
      /<!--Newlettter and TOC-->/i,
      /<!--\s*Newlettter/i,
      /<section class=["']post-footer-extra["']>/i,
      /<aside class=["']post-toc["']>/i,
      /<section id=["']comments["']>/i
    ];

    let stopIndex = rawContent.length;
    for (const marker of stopMarkers) {
      const idx = rawContent.search(marker);
      if (idx !== -1 && idx < stopIndex) {
        stopIndex = idx;
      }
    }

    content = rawContent.substring(0, stopIndex).trim();

    // Clean up trailing unopened/unclosed div tags if cut off
    content = content.replace(/<\/div>\s*<\/div>\s*<\/section>[\s\S]*$/i, '').trim();
    // Strip all HTML comments (MDX doesn't allow HTML comments <!-- ... -->)
    content = content.replace(/<!--[\s\S]*?-->/g, '').trim();
  }

  // Normalize image paths: ../images/ -> /images/
  content = content.replace(/\.\.\/images\//g, '/images/');
  // Normalize links: ../series/ -> /series/
  content = content.replace(/\.\.\/series\//g, '/series/');
  // Normalize relative post links: href="foo.html" -> href="/posts/foo.html"
  content = content.replace(/href=["']([a-zA-Z0-9_-]+\.html)["']/g, 'href="/posts/$1"');

  // Normalize self-closing tags
  content = content.replace(/<br(?!\s*\/)>/gi, '<br />');
  content = content.replace(/<hr(?!\s*\/)>/gi, '<hr />');
  content = content.replace(/<img([^>]*?)(?!\s*\/)>/gi, '<img$1 />');

  // Build Frontmatter
  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    subtitle ? `subtitle: ${JSON.stringify(subtitle)}` : null,
    description ? `description: ${JSON.stringify(description)}` : null,
    `date: "${date}"`,
    cover ? `cover: "${cover}"` : null,
    series ? `series: "${series}"` : null,
    order !== undefined ? `order: ${order}` : null,
    tags && tags.length ? `tags:\n${tags.map(t => `  - ${JSON.stringify(t)}`).join('\n')}` : null,
    `draft: ${draft}`,
    '---',
    '',
    content
  ].filter(line => line !== null).join('\n');

  const outFilePath = path.join(outDir, `${slug}.md`);
  fs.writeFileSync(outFilePath, frontmatter, 'utf8');
  migratedCount++;
  console.log(`Migrated [${draft ? 'DRAFT' : 'POST'}]: ${slug}.md`);
}

console.log(`\nSuccessfully migrated ${migratedCount} articles to ${outDir}`);
