<template>
  <span class="shape-icon" :class="shape">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <circle v-if="shape === 'circle'" :cx="size/2" :cy="size/2" :r="size/2 - 1" fill="currentColor" />
      <rect v-else-if="shape === 'square'" x="1" y="1" :width="size - 2" :height="size - 2" fill="currentColor" />
    </svg>
  </span>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'ShapeIcon',
  props: {
    shape: {
      type: String,
      required: true,
      validator: (value: string) => ['circle', 'square'].includes(value)
    }
  },
  setup() {
    const size = computed(() => {
      const fontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
      return Math.round(fontSize * 1.2); // Adjust this multiplier as needed
    });

    return { size };
  }
});
</script>

<style scoped>
.shape-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
}

.shape-icon svg {
  display: block;
}
</style>

