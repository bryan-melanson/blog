---
title: Comic
---

<script setup>
const strips = [
  {
    title: "Strip #1",
    image: "/blog/comic/strip-001.png",
    date: ""
  },
  {
    title: "Strip #2",
    image: "/blog/comic/strip-002.png",
    date: ""
  },
  {
    title: "Strip #3",
    image: "/blog/comic/strip-003.png",
    date: ""
  },
  {
    title: "Strip #4",
    image: "/blog/comic/strip-004.png",
    date: ""
  },
  {
    title: "Strip #5",
    image: "/blog/comic/strip-005.png",
    date: ""
  }
]
</script>

<ComicViewer :strips="strips" />
