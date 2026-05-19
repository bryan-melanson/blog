---
title: "Blog"
---

<script setup>
  import ArticleCard from './components/ArticleCard.vue'

  import data from './blog-data.json'
</script>

<div v-for="(post, index) in data" :key="index">
  <ArticleCard :title="post.title" :excerpt="post.excerpt" :image="post.image" :author="post.Author" :href="post.path" :date="post.Updated" />
</div>
