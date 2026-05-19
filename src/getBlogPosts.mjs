import fs from 'node:fs/promises';
import matter from 'gray-matter';
import removeMd from 'remove-markdown';

const posts = await fs.readdir('./src/blog/');
const mdPosts = posts.filter((f) => f.endsWith('.md'));

const data = await Promise.all(
  mdPosts.map(async (post) => {
    const file = matter.read(`./src/blog/${post}`, {
      excerpt: true,
      excerpt_separator: '<!-- more -->',
    });

    const { data, excerpt, path } = file;
    const contents = removeMd(excerpt)
      .trim()
      .split(/\r\n|\n|\r/);

    const updated = data.Updated instanceof Date
      ? data.Updated.toISOString().split('T')[0]
      : data.Updated;

    return {
      ...data,
      Updated: updated,
      title: contents[0].replace(/\s{2,}/g, '').trim(),
      path: path.replace('./src/blog/', '').replace(/\.md$/, '.html'),
      excerpt: contents,
    };
  })
);

await fs.writeFile('./src/blog-data.json', JSON.stringify(data), 'utf-8');
