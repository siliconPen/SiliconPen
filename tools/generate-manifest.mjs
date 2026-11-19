import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT_DIR, 'src', 'content', 'posts');
const SERIES_FILE = path.join(ROOT_DIR, 'src', 'data', 'series.json');
const OUTPUT_FILE = path.join(ROOT_DIR, 'public', 'manifest.json');

// Read series metadata
let seriesData = {};
if (fs.existsSync(SERIES_FILE)) {
  try {
    seriesData = JSON.parse(fs.readFileSync(SERIES_FILE, 'utf-8'));
  } catch (e) {
    console.error('Failed to parse series.json:', e);
  }
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const rawYaml = match[1];
  const body = match[2];
  const data = {};

  const lines = rawYaml.split(/\r?\n/);
  let currentKey = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    if (currentKey && /^\s*-\s+/.test(line)) {
      const itemVal = line.replace(/^\s*-\s+/, '').trim().replace(/^['"]|['"]$/g, '');
      if (Array.isArray(data[currentKey])) {
        data[currentKey].push(itemVal);
      }
      continue;
    }

    const colonIdx = line.indexOf(':');
    if (colonIdx !== -1) {
      const key = line.slice(0, colonIdx).trim();
      let val = line.slice(colonIdx + 1).trim();

      if (!val) {
        data[key] = [];
        currentKey = key;
      } else {
        currentKey = null;
        if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
        else if (val.startsWith("'") && val.endsWith("'")) val = val.slice(1, -1);
        else if (val === 'true') val = true;
        else if (val === 'false') val = false;
        else if (!isNaN(Number(val))) val = Number(val);
        data[key] = val;
      }
    }
  }

  return { data, body };
}

function getAttr(tagStr, attrName) {
  const match = tagStr.match(new RegExp(`${attrName}=["']([^"']*)["']`, 'i'));
  return match ? match[1] : '';
}

function parseAttributes(tagStr) {
  const attrs = {};
  const regex = /([a-zA-Z0-9_-]+)=["']([^"']*)["']/g;
  let match;
  while ((match = regex.exec(tagStr)) !== null) {
    attrs[match[1].toLowerCase()] = match[2];
  }
  return attrs;
}

function extractYouTubeId(url) {
  if (!url) return '';
  const match = url.match(/(?:embed\/|v=|youtu\.be\/|\/v\/|watch\?v=|\&v=)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : '';
}

export function generateManifest() {
  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith('.md'));
  const circuits = [];
  const labs = [];
  const videos = [];
  const postsSummary = [];

  for (const file of files) {
    const slug = file.replace(/\.md$/, '');
    const rawContent = fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8');
    const { data, body } = parseFrontmatter(rawContent);

    if (data.draft) continue;

    const postRef = {
      id: slug,
      title: data.title || slug,
      url: `/posts/${slug}.html`,
      series: data.series || null,
      date: data.date || '',
    };

    // 1. Extract <sp-circuit>
    const circuitRegex = /<sp-circuit([\s\S]*?)>([\s\S]*?)<\/sp-circuit>/gi;
    let circuitMatch;
    while ((circuitMatch = circuitRegex.exec(body)) !== null) {
      const openTagAttrs = circuitMatch[1];
      const innerContent = circuitMatch[2];

      const circuitTitle = getAttr(openTagAttrs, 'title') || 'Circuit Connections';
      const circuitSubtitle = getAttr(openTagAttrs, 'subtitle') || '';
      const breadboard = getAttr(openTagAttrs, 'breadboard') || 'true';

      const devices = [];
      const devRegex = /<sp-dev\s+([^>]*?)(?:\/?>|><\/sp-dev>)/gi;
      let devMatch;
      while ((devMatch = devRegex.exec(innerContent)) !== null) {
        const attrs = parseAttributes(devMatch[1]);
        devices.push({
          id: attrs.id || '',
          model: attrs.model || '',
          label: attrs.label || attrs.id || '',
          value: attrs.value || '',
        });
      }

      const wires = [];
      const wireRegex = /<sp-wire\s+([^>]*?)(?:\/?>|><\/sp-wire>)/gi;
      let wireMatch;
      while ((wireMatch = wireRegex.exec(innerContent)) !== null) {
        const attrs = parseAttributes(wireMatch[1]);
        wires.push({
          from: attrs.from || '',
          to: attrs.to || '',
          color: (attrs.color || 'gray').toLowerCase(),
          signal: attrs.signal || '',
          why: attrs.why || '',
        });
      }

      circuits.push({
        id: `${slug}-circuit-${circuits.length + 1}`,
        title: circuitTitle,
        subtitle: circuitSubtitle,
        breadboard,
        post: postRef,
        devices,
        wires,
      });
    }

    // 2. Extract <sp-lab>
    const labRegex = /<sp-lab([\s\S]*?)>([\s\S]*?)<\/sp-lab>/gi;
    let labMatch;
    while ((labMatch = labRegex.exec(body)) !== null) {
      const openAttrs = parseAttributes(labMatch[1]);
      const desc = labMatch[2].replace(/<[^>]*>/g, '').trim();

      const wokwi = openAttrs.wokwi || openAttrs['wokwi-id'] || '';
      const tinkercad = openAttrs.tinkercad || openAttrs['tinkercad-id'] || '';
      let platform = 'generic';
      if (wokwi || (openAttrs.link && openAttrs.link.includes('wokwi.com'))) platform = 'wokwi';
      else if (tinkercad || (openAttrs.link && openAttrs.link.includes('tinkercad.com'))) platform = 'tinkercad';

      labs.push({
        id: `${slug}-lab-${labs.length + 1}`,
        title: openAttrs.title || 'Interactive Hardware Lab',
        subtitle: openAttrs.subtitle || '',
        platform,
        wokwiId: wokwi,
        tinkercadSlug: tinkercad,
        link: openAttrs.link || '',
        buttonText: openAttrs.button || 'Launch Simulation',
        image: openAttrs.image || '',
        mode: openAttrs.mode || 'preview',
        description: desc,
        post: postRef,
      });
    }

    // 3. Extract <sp-video>, <sp-youtube>, and YouTube iframes
    const videoRegex = /<(?:sp-video|sp-youtube)([\s\S]*?)(?:\/?>|>[\s\S]*?<\/(?:sp-video|sp-youtube)>)/gi;
    let vidMatch;
    while ((vidMatch = videoRegex.exec(body)) !== null) {
      const attrs = parseAttributes(vidMatch[1]);
      const src = attrs.src || attrs.url || '';
      const ytid = extractYouTubeId(src);
      if (ytid) {
        videos.push({
          id: ytid,
          youtubeId: ytid,
          title: attrs.title || data.title,
          caption: attrs.caption || '',
          embedUrl: `https://www.youtube.com/embed/${ytid}`,
          thumbnail: `https://img.youtube.com/vi/${ytid}/hqdefault.jpg`,
          post: postRef,
        });
      }
    }

    const iframeRegex = /<iframe[^>]*src=["'](https?:\/\/(?:www\.)?youtube\.com\/embed\/[a-zA-Z0-9_-]+)["'][^>]*>/gi;
    let iframeMatch;
    while ((iframeMatch = iframeRegex.exec(body)) !== null) {
      const ytid = extractYouTubeId(iframeMatch[1]);
      if (ytid && !videos.some((v) => v.youtubeId === ytid)) {
        videos.push({
          id: ytid,
          youtubeId: ytid,
          title: data.title,
          caption: '',
          embedUrl: `https://www.youtube.com/embed/${ytid}`,
          thumbnail: `https://img.youtube.com/vi/${ytid}/hqdefault.jpg`,
          post: postRef,
        });
      }
    }

    postsSummary.push({
      id: slug,
      title: data.title || slug,
      subtitle: data.subtitle || null,
      description: data.description || null,
      date: data.date || '',
      cover: data.cover || null,
      series: data.series || null,
      order: data.order || null,
      tags: data.tags || [],
      url: `/posts/${slug}.html`,
    });
  }

  // Sort posts by date descending
  postsSummary.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  const payload = {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    site: 'https://siliconpen.com',
    series: seriesData,
    stats: {
      totalPosts: postsSummary.length,
      totalCircuits: circuits.length,
      totalLabs: labs.length,
      totalVideos: videos.length,
    },
    posts: postsSummary,
    circuits,
    labs,
    videos,
  };

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2), 'utf-8');
  console.log(`[Manifest API] Successfully generated ${OUTPUT_FILE}`);
  console.log(`- ${postsSummary.length} Posts`);
  console.log(`- ${circuits.length} Circuits`);
  console.log(`- ${labs.length} Labs`);
  console.log(`- ${videos.length} Videos`);
  return payload;
}

// Run directly if invoked from CLI
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  generateManifest();
}
