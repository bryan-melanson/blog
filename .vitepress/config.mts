import { defineConfig } from 'vitepress'
import mathjax3 from 'markdown-it-mathjax3';
const customElements = ['mjx-container'];

const music = {
  text: 'Music', items: [
    {
      text: 'Albums', collapsible: true, items: [
        { text: 'Errand Boy - Bachelor of Commerce (2005)', link: 'music/bachelor-of-commerce' },
        { text: 'Errand Boy - Errand Boy (2007)', link: 'music/errand-boy' },
        { text: 'Errand Boy - At the 24 Hr Art Marathon (2008)', link: 'music/art-marathon' },
        { text: 'Errand Boy - Cape Disappointment (2009)', link: 'music/cape-disappointment' },
        { text: 'Veneers - Similar Stories (2011)', link: 'music/veneers-similar-stories' },
      ]
    }
  ]
}

const guides = {
  text: 'Study Guides', items: [
    {
      text: 'Engineering', collapsible: true, items: [
        { text: 'Electronic Circuits', link: 'study-guides/circuits' },
        { text: 'Control Systems', link: 'study-guides/control-systems' },
        { text: 'Probability & Random Processes', link: 'study-guides/probability' },
        { text: 'Digital Systems', link: 'study-guides/digital-systems' },
      ]
    },
    {
      text: 'Programming', collapsible: true, items: [
        { text: 'Data Structures', link: 'study-guides/data-structures' },
        { text: 'Rust', link: 'study-guides/rust' }
      ]
    },
  ]
}

// Combine the 'items' arrays from both objects
const combinedItems = guides.items.concat(music.items);

// Create a new object with the combined 'items' array
const all = {
  items: combinedItems,
};

export default defineConfig({
  base: '/blog/',
  srcDir: './src',
  markdown: {
    toc: { level: [1, 2, 3] },
    config: (md) => {
      md.use(mathjax3)
    },
  },
  vue: {
    template: {
      compilerOptions: {
        isCustomElement: (tag) => customElements.includes(tag)
      }
    },
  },
  head: [['link', { rel: 'icon', href: './favicon.ico' }]],
  title: "Bryan Melanson",
  description: "A young curmudgeon",
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Blog', link: 'articles' },
      guides,
      music,
      { text: 'CV', link: 'resume' }
    ],
    search: {
      provider: 'local'
    },
    sidebar: {
      'music': music,
      'study-guides': guides,
      'resume': all
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/bryan-melanson' },
      { icon: 'linkedin', link: 'https://linkedin.com/in/bryanmelanson' }
    ],
  }
})

