<template>
  <div class="previewer">
    <img :src="src" :alt="alt" class="previewer__image" @click="handleImageClick" />
    <div v-if="showRemoveButton" class="previewer__overlay">
      <button @click="$emit('remove')" class="previewer__action" :title="removeButtonTitle">
        ✕
      </button>
    </div>
    <div v-if="showZoom && enableZoom" class="previewer__zoom-overlay" @click="showZoom = false">
      <img :src="src" :alt="alt" class="previewer__zoom-image" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  src: string
  alt?: string
  showRemoveButton?: boolean
  enableZoom?: boolean
  removeButtonTitle?: string
}

interface Emits {
  remove: []
}

const props = withDefaults(defineProps<Props>(), {
  alt: 'Photo preview',
  showRemoveButton: false,
  enableZoom: true,
  removeButtonTitle: 'Remove',
})

defineEmits<Emits>()

const showZoom = ref(false)

const handleImageClick = () => {
  if (props.enableZoom) {
    showZoom.value = true
  }
}
</script>

<style lang="scss" scoped>
.previewer {
  position: relative;

  &__image {
    width: 100%;
    height: 300px;
    object-fit: cover;
    border-radius: var(--border-radius-lg);
    border: 1px solid var(--border-color);
    cursor: pointer;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.02);
    }
  }

  &__overlay {
    position: absolute;
    top: var(--spacing-sm);
    right: var(--spacing-sm);
  }

  &__action {
    width: 32px;
    height: 32px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;

    &:hover {
      background: rgba(239, 68, 68, 0.9);
    }
  }

  &__zoom-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  &__zoom-image {
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
    cursor: pointer;
  }
}
</style>
