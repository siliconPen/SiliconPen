import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT_DIR, 'src', 'content', 'posts');
const IMAGES_DIR = path.join(ROOT_DIR, 'public', 'images');
const SERIES_FILE = path.join(ROOT_DIR, 'src', 'data', 'series.json');
const GLOBAL_CSS_FILE = path.join(ROOT_DIR, 'src', 'styles', 'global.css');
const CUSTOM_ELEMENTS_FILE = path.join(ROOT_DIR, 'public', 'js', 'custom-elements.js');
const STUDIO_HTML_FILE = path.join(__dirname, 'studio.html');

const PORT = 4322;

// Utility: Ensure directory exists
function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

// Utility: Parse YAML frontmatter and Markdown body
function parsePostMarkdown(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, content: raw };
  }
  const rawYaml = match[1];
  const content = match[2];
  const frontmatter = {};

  const lines = rawYaml.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;
    const key = line.slice(0, colonIdx).trim();
    let val = line.slice(colonIdx + 1).trim();

    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.slice(1, -1).replace(/\\"/g, '"');
    } else if (val.startsWith("'") && val.endsWith("'")) {
      val = val.slice(1, -1).replace(/\\'/g, "'");
    } else if (val === 'true') {
      val = true;
    } else if (val === 'false') {
      val = false;
    } else if (/^-?\d+(\.\d+)?$/.test(val)) {
      val = Number(val);
    } else if (val.startsWith('[') && val.endsWith(']')) {
      try {
        val = JSON.parse(val);
      } catch {
        val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean);
      }
    }
    frontmatter[key] = val;
  }
  return { frontmatter, content };
}

// Utility: Format post as YAML frontmatter + markdown
function serializePostMarkdown(frontmatter, content) {
  const lines = ['---'];
  if (frontmatter.title) lines.push(`title: ${JSON.stringify(frontmatter.title)}`);
  if (frontmatter.subtitle) lines.push(`subtitle: ${JSON.stringify(frontmatter.subtitle)}`);
  if (frontmatter.description) lines.push(`description: ${JSON.stringify(frontmatter.description)}`);
  if (frontmatter.date) lines.push(`date: ${JSON.stringify(frontmatter.date)}`);
  if (frontmatter.cover) lines.push(`cover: ${JSON.stringify(frontmatter.cover)}`);
  if (frontmatter.series) lines.push(`series: ${JSON.stringify(frontmatter.series)}`);
  if (typeof frontmatter.order === 'number' && !isNaN(frontmatter.order)) {
    lines.push(`order: ${frontmatter.order}`);
  }
  if (Array.isArray(frontmatter.tags) && frontmatter.tags.length > 0) {
    lines.push(`tags: ${JSON.stringify(frontmatter.tags)}`);
  }
  lines.push(`draft: ${frontmatter.draft === true ? 'true' : 'false'}`);
  lines.push('---');
  lines.push('');
  lines.push(content ? content.trim() : '');
  lines.push('');
  return lines.join('\n');
}

// Read all existing posts
function getAllPosts() {
  ensureDir(POSTS_DIR);
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  const posts = [];

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    try {
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      const { frontmatter } = parsePostMarkdown(raw);
      posts.push({
        slug,
        title: frontmatter.title || slug,
        subtitle: frontmatter.subtitle || '',
        date: frontmatter.date || '',
        series: frontmatter.series || '',
        order: typeof frontmatter.order === 'number' ? frontmatter.order : null,
        draft: Boolean(frontmatter.draft),
        cover: frontmatter.cover || '',
        tags: frontmatter.tags || []
      });
    } catch (err) {
      console.error(`Error reading ${file}:`, err);
    }
  }

  // Sort by date desc
  posts.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  return posts;
}

// Read Series definition and calculate max order per series
function getSeriesInfo() {
  let seriesData = {};
  if (fs.existsSync(SERIES_FILE)) {
    try {
      seriesData = JSON.parse(fs.readFileSync(SERIES_FILE, 'utf8'));
    } catch (err) {
      console.error('Error reading series.json:', err);
    }
  }

  const posts = getAllPosts();
  const seriesStats = {};

  for (const key of Object.keys(seriesData)) {
    seriesStats[key] = {
      ...seriesData[key],
      key,
      count: 0,
      maxOrder: 0
    };
  }

  for (const post of posts) {
    if (post.series && seriesStats[post.series]) {
      seriesStats[post.series].count++;
      if (typeof post.order === 'number' && post.order > seriesStats[post.series].maxOrder) {
        seriesStats[post.series].maxOrder = post.order;
      }
    }
  }

  return seriesStats;
}

// Mime types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

// HTTP Server
const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = reqUrl.pathname;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Helper to send JSON
  const sendJson = (statusCode, data) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
  };

  // Helper to parse JSON body
  const readJsonBody = (callback) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 50 * 1024 * 1024) { // 50MB max for images
        res.writeHead(413, { 'Content-Type': 'text/plain' });
        res.end('Payload Too Large');
        req.destroy();
      }
    });
    req.on('end', () => {
      try {
        const json = JSON.parse(body || '{}');
        callback(null, json);
      } catch (err) {
        callback(err);
      }
    });
  };

  // --- API Endpoints ---
  if (pathname === '/api/series' && req.method === 'GET') {
    return sendJson(200, getSeriesInfo());
  }

  if (pathname === '/api/posts' && req.method === 'GET') {
    return sendJson(200, getAllPosts());
  }

  if (pathname === '/api/post' && req.method === 'GET') {
    const slug = reqUrl.searchParams.get('slug');
    if (!slug) return sendJson(400, { error: 'Missing slug' });

    const filePath = path.join(POSTS_DIR, `${slug}.md`);
    if (!fs.existsSync(filePath)) {
      return sendJson(404, { error: 'Post not found' });
    }

    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      const parsed = parsePostMarkdown(raw);
      return sendJson(200, {
        slug,
        frontmatter: parsed.frontmatter,
        content: parsed.content
      });
    } catch (err) {
      return sendJson(500, { error: err.message });
    }
  }

  if (pathname === '/api/upload-image' && req.method === 'POST') {
    return readJsonBody((err, data) => {
      if (err) return sendJson(400, { error: 'Invalid JSON body' });

      let { slug, filename, dataUrl } = data;
      if (!slug) slug = 'general';
      if (!filename || !dataUrl) {
        return sendJson(400, { error: 'Missing filename or dataUrl' });
      }

      // Clean filename
      filename = filename.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '-').replace(/-+/g, '-');
      const targetDir = path.join(IMAGES_DIR, slug);
      ensureDir(targetDir);

      // Strip Base64 header e.g. "data:image/png;base64,"
      const matches = dataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      let buffer;
      if (matches) {
        buffer = Buffer.from(matches[2], 'base64');
      } else {
        buffer = Buffer.from(dataUrl, 'base64');
      }

      const destPath = path.join(targetDir, filename);
      fs.writeFileSync(destPath, buffer);

      const publicUrl = `/images/${slug}/${filename}`;
      return sendJson(200, {
        success: true,
        url: publicUrl,
        filename,
        slug
      });
    });
  }

  if (pathname === '/api/save-post' && req.method === 'POST') {
    return readJsonBody((err, data) => {
      if (err) return sendJson(400, { error: 'Invalid JSON body' });

      let { slug, frontmatter, content } = data;
      if (!frontmatter || !frontmatter.title) {
        return sendJson(400, { error: 'Post title is required' });
      }

      if (!slug) {
        slug = frontmatter.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
      }

      slug = slug.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/-+/g, '-');
      ensureDir(POSTS_DIR);

      const targetPath = path.join(POSTS_DIR, `${slug}.md`);
      const serialized = serializePostMarkdown(frontmatter, content);

      try {
        fs.writeFileSync(targetPath, serialized, 'utf8');
        return sendJson(200, {
          success: true,
          slug,
          path: `src/content/posts/${slug}.md`
        });
      } catch (saveErr) {
        return sendJson(500, { error: saveErr.message });
      }
    });
  }

  // --- Static File Routing ---
  if (pathname === '/styles/global.css' || pathname === '/src/styles/global.css') {
    if (fs.existsSync(GLOBAL_CSS_FILE)) {
      res.writeHead(200, { 'Content-Type': 'text/css; charset=utf-8' });
      return res.end(fs.readFileSync(GLOBAL_CSS_FILE));
    }
  }

  if (pathname === '/js/custom-elements.js' || pathname === '/public/js/custom-elements.js') {
    if (fs.existsSync(CUSTOM_ELEMENTS_FILE)) {
      res.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8' });
      return res.end(fs.readFileSync(CUSTOM_ELEMENTS_FILE));
    }
  }

  // Serve image files from public/images/
  if (pathname.startsWith('/images/')) {
    const relPath = pathname.replace(/^\/images\//, '');
    const safePath = path.normalize(relPath).replace(/^(\.\.[\/\\])+/, '');
    const imgFile = path.join(IMAGES_DIR, safePath);

    if (fs.existsSync(imgFile) && fs.statSync(imgFile).isFile()) {
      const ext = path.extname(imgFile).toLowerCase();
      const mime = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, { 'Content-Type': mime });
      return res.end(fs.readFileSync(imgFile));
    }
  }

  // Serve Main Studio UI at `/`
  if (pathname === '/' || pathname === '/index.html') {
    if (fs.existsSync(STUDIO_HTML_FILE)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end(fs.readFileSync(STUDIO_HTML_FILE, 'utf8'));
    }
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

// Launch server
server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log(`\n======================================================`);
  console.log(`  ⚡ SiliconPen Studio running at: ${url}`);
  console.log(`  📂 Markdown posts directory:     src/content/posts/`);
  console.log(`  🖼️ Image assets directory:        public/images/`);
  console.log(`======================================================\n`);

  // Auto-launch default browser
  const startCmd =
    process.platform === 'win32'
      ? `start "" "${url}"`
      : process.platform === 'darwin'
      ? `open "${url}"`
      : `xdg-open "${url}"`;

  exec(startCmd, err => {
    if (err) console.log(`👉 Open your browser to: ${url}`);
  });
});
