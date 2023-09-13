<template>
  <span :style="{
    backgroundColor: color === 'secondary' ? '#48BFE3' : 'var(--textLink)',
    color: 'white',
    borderRadius: '4px',
    padding: '0px 4px 2px 4px',
    marginLeft: '4px',
    marginBottom: '10px',
    boxSizing: 'border-box',
    fontSize: 'smaller',
    fontWeight: 'bold',
  }">
    <slot></slot>
  </span>
</template>

<script>
export default {
  props: {
    color: String,
  },
};
</script>

<style scoped>
/* Add some margin to separate tags */

/* Define your scoped styles here if needed */
</style>

