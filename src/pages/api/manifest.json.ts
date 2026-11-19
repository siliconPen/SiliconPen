import { getCollection } from 'astro:content';
import seriesData from '../../data/series.json';
import fs from 'node:fs';
import path from 'node:path';

// Helper to extract attribute values from an HTML/XML tag string
function getAttr(tagStr: string, attrName: string): string {
  const match = tagStr.match(new RegExp(`${attrName}=["']([^"']*)["']`, 'i'));
  return match ? match[1] : '';
}

// Helper to parse all attributes from a tag
function parseAttributes(tagStr: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const regex = /([a-zA-Z0-9_-]+)=["']([^"']*)["']/g;
  let match;
  while ((match = regex.exec(tagStr)) !== null) {
    attrs[match[1].toLowerCase()] = match[2];
  }
  return attrs;
}

// Extract YouTube Video ID from any URL
function extractYouTubeId(url: string): string {
  if (!url) return '';
  const match = url.match(/(?:embed\/|v=|youtu\.be\/|\/v\/|watch\?v=|\&v=)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : '';
}

export async function GET() {
  const allPosts = await getCollection('posts', ({ data }) => !data.draft);

  // Sort by date descending
  allPosts.sort((a, b) => b.data.date.localeCompare(a.data.date));

  const circuits: any[] = [];
  const labs: any[] = [];
  const videos: any[] = [];

  const postsSummary = allPosts.map((post) => {
    // Read raw markdown content
    let rawBody = post.body || '';
    if (!rawBody) {
      try {
        const filePath = path.resolve(`./src/content/posts/${post.id}.md`);
        if (fs.existsSync(filePath)) {
          rawBody = fs.readFileSync(filePath, 'utf-8');
        }
      } catch (e) {
        // Fallback
      }
    }

    const postRef = {
      id: post.id,
      title: post.data.title,
      url: `/posts/${post.id}.html`,
      series: post.data.series || null,
      date: post.data.date,
    };

    // 1. Extract <sp-circuit> blocks
    const circuitRegex = /<sp-circuit([\s\S]*?)>([\s\S]*?)<\/sp-circuit>/gi;
    let circuitMatch;
    while ((circuitMatch = circuitRegex.exec(rawBody)) !== null) {
      const openTagAttrs = circuitMatch[1];
      const innerContent = circuitMatch[2];

      const circuitTitle = getAttr(openTagAttrs, 'title') || 'Circuit Connections';
      const circuitSubtitle = getAttr(openTagAttrs, 'subtitle') || '';
      const breadboard = getAttr(openTagAttrs, 'breadboard') || 'true';

      // Extract <sp-dev>
      const devices: any[] = [];
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

      // Extract <sp-wire>
      const wires: any[] = [];
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
        id: `${post.id}-circuit-${circuits.length + 1}`,
        title: circuitTitle,
        subtitle: circuitSubtitle,
        breadboard,
        post: postRef,
        devices,
        wires,
      });
    }

    // 2. Extract <sp-lab> blocks
    const labRegex = /<sp-lab([\s\S]*?)>([\s\S]*?)<\/sp-lab>/gi;
    let labMatch;
    while ((labMatch = labRegex.exec(rawBody)) !== null) {
      const openAttrs = parseAttributes(labMatch[1]);
      const desc = labMatch[2].replace(/<[^>]*>/g, '').trim();

      const wokwi = openAttrs.wokwi || openAttrs['wokwi-id'] || '';
      const tinkercad = openAttrs.tinkercad || openAttrs['tinkercad-id'] || '';
      let platform = 'generic';
      if (wokwi || (openAttrs.link && openAttrs.link.includes('wokwi.com'))) platform = 'wokwi';
      else if (tinkercad || (openAttrs.link && openAttrs.link.includes('tinkercad.com'))) platform = 'tinkercad';

      labs.push({
        id: `${post.id}-lab-${labs.length + 1}`,
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
    while ((vidMatch = videoRegex.exec(rawBody)) !== null) {
      const attrs = parseAttributes(vidMatch[1]);
      const src = attrs.src || attrs.url || '';
      const ytid = extractYouTubeId(src);
      if (ytid) {
        videos.push({
          id: ytid,
          youtubeId: ytid,
          title: attrs.title || post.data.title,
          caption: attrs.caption || '',
          embedUrl: `https://www.youtube.com/embed/${ytid}`,
          thumbnail: `https://img.youtube.com/vi/${ytid}/hqdefault.jpg`,
          post: postRef,
        });
      }
    }

    // Also catch iframe youtube embeds
    const iframeRegex = /<iframe[^>]*src=["'](https?:\/\/(?:www\.)?youtube\.com\/embed\/[a-zA-Z0-9_-]+)["'][^>]*>/gi;
    let iframeMatch;
    while ((iframeMatch = iframeRegex.exec(rawBody)) !== null) {
      const ytid = extractYouTubeId(iframeMatch[1]);
      if (ytid && !videos.some((v) => v.youtubeId === ytid)) {
        videos.push({
          id: ytid,
          youtubeId: ytid,
          title: post.data.title,
          caption: '',
          embedUrl: `https://www.youtube.com/embed/${ytid}`,
          thumbnail: `https://img.youtube.com/vi/${ytid}/hqdefault.jpg`,
          post: postRef,
        });
      }
    }

    return {
      id: post.id,
      title: post.data.title,
      subtitle: post.data.subtitle || null,
      description: post.data.description || null,
      date: post.data.date,
      cover: post.data.cover || null,
      series: post.data.series || null,
      order: post.data.order || null,
      tags: post.data.tags || [],
      url: `/posts/${post.id}.html`,
    };
  });

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

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
