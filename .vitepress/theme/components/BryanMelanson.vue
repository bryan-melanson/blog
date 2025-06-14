<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
  {
    avatar: 'https://avatars.githubusercontent.com/u/46350945?v=4',
    name: 'Bryan Melanson',
    title: 'Embedded Developer',
    links: [
      { icon: 'github', link: 'https://github.com/bryan-melanson' },
      { icon: 'linkedin', link: 'https://linkedin.com/in/bryanmelanson' },
			{ icon: 'link', link: 'mailto:bryan@bryanmelanson.com' }
    ]
  },
]
</script>

<template>
  <div class="center-horizontal">
    <VPTeamMembers size="medium" :members="members" />
  </div>
</template>

<style>
.center-horizontal {
  display: flex;
  justify-content: center;
}
</style>
