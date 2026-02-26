<template>
  <div class="comic-viewer">
    <div class="strip-meta">
      <span class="strip-counter">{{ currentIndex + 1 }} / {{ strips.length }}</span>
      <h2 class="strip-title">{{ currentStrip.title }}</h2>
      <span class="strip-date">{{ currentStrip.date }}</span>
    </div>

    <div class="strip-image-container">
      <img
        :src="currentStrip.image"
        :alt="currentStrip.title"
        class="strip-image"
      />
    </div>

    <div class="strip-nav">
      <button
        @click="prev"
        :disabled="currentIndex === 0"
        class="nav-btn nav-prev"
      >
        ← Previous
      </button>
      <button
        @click="next"
        :disabled="currentIndex === strips.length - 1"
        class="nav-btn nav-next"
      >
        Next →
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  strips: {
    type: Array,
    required: true
  }
})

const currentIndex = ref(0)
const currentStrip = computed(() => props.strips[currentIndex.value])

function prev() {
  if (currentIndex.value > 0) currentIndex.value--
}

function next() {
  if (currentIndex.value < props.strips.length - 1) currentIndex.value++
}
</script>

<style scoped>
.comic-viewer {
  max-width: 860px;
  margin: 0 auto;
}

.strip-meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 1rem;
  gap: 1rem;
}

.strip-title {
  margin: 0;
  border-top: none;
  font-size: 1.2rem;
}

.strip-counter,
.strip-date {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
  white-space: nowrap;
}

.strip-image-container {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1.5rem;
  background: var(--vp-c-bg-soft);
}

.strip-image {
  width: 100%;
  display: block;
}

.strip-nav {
  display: flex;
  gap: 1rem;
}

.nav-btn {
  flex: 1;
  padding: 0.6rem 1.2rem;
  border: 1px solid var(--vp-c-brand-1);
  border-radius: 6px;
  background: transparent;
  color: var(--vp-c-brand-1);
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.15s, color 0.15s;
}

.nav-btn:hover:not(:disabled) {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.nav-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  border-color: var(--vp-c-text-3);
  color: var(--vp-c-text-3);
}
</style>
