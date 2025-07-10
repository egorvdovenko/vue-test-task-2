<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
  alt: '',
  showRemoveButton: false,
  enableZoom: true,
  removeButtonTitle: '',
})

defineEmits<Emits>()

const displayAlt = computed(() => props.alt || t('common.photoPreview'))
const displayRemoveTitle = computed(() => props.removeButtonTitle || t('common.remove'))

const showZoom = ref(false)

const handleImageClick = () => {
  if (props.enableZoom) {
    showZoom.value = true
  }
}
</script>

<template>
  <div class="previewer">
    <img :src="src" :alt="displayAlt" class="previewer__image" @click="handleImageClick" />
    <div v-if="showRemoveButton" class="previewer__overlay">
      <button @click="$emit('remove')" class="previewer__action" :title="displayRemoveTitle">
        ✕
      </button>
    </div>
    <div v-if="showZoom && enableZoom" class="previewer__zoom-overlay" @click="showZoom = false">
      <img :src="src" :alt="displayAlt" class="previewer__zoom-image" />
    </div>
  </div>
</template>

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
    width: var(--icon-xl);
    height: var(--icon-xl);
    background: var(--overlay-light);
    color: var(--color-white);
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: var(--font-size-sm);

    &:hover {
      background: var(--overlay-error);
    }
  }

  &__zoom-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--overlay-dark);
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
