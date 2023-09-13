---
title: CV
---

<script setup>
import Resume from './components/Resume.vue'
import Tag from './components/Tag.vue'

</script>
<div style="padding-bottom: 30px">
<a href="/blog/assets/BryanMelanson-CV.pdf" target="_blank">
  <Tag :color="'secondary'" :key="k" class="item">PDF</Tag>
</a>
</div>

<Resume />
