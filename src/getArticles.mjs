import fs from 'node:fs/promises';
import matter from 'gray-matter';
import removeMd from 'remove-markdown';

const articles = await fs.readdir('./src/articles/');

const data = await Promise.all(
  articles.map(async (article) => {
    const file = matter.read(`./src/articles/${article}`, {
      excerpt: true,
      excerpt_separator: '<!-- more -->',
    });

    const { data, excerpt, path } = file;
    const contents = removeMd(excerpt)
      .trim()
      .split(/\r\n|\n|\r/);

    return {
      ...data,
      title: contents[0].replace(/\s{2,}/g, '').trim(),
      path: path.replace('./src/articles/', '').replace(/\.md$/, '.html'),
      excerpt: contents
    };
  })
);

await fs.writeFile('./data.json', JSON.stringify(data), 'utf-8');

