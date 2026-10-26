import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context: any) {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  posts.sort((a, b) => b.data.date.localeCompare(a.data.date));

  return rss({
    title: 'Silicon Pen',
    description: 'Independent writing on electronics, hardware, embedded systems, and engineering thought.',
    site: context.site || 'https://siliconpen.com',
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: new Date(post.data.date),
      description: post.data.description || post.data.subtitle || '',
      link: `/posts/${post.id}.html`,
    })),
    customData: `<language>en-us</language>`,
  });
}
