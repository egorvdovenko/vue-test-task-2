<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Props {
  accept?: string
  multiple?: boolean
  text?: string
  disabled?: boolean
}

interface Emits {
  (e: 'files-selected', files: File[]): void
}

const props = withDefaults(defineProps<Props>(), {
  accept: '*/*',
  multiple: false,
  text: '',
  disabled: false,
})

const emit = defineEmits<Emits>()

const displayText = computed(() => props.text || t('common.dropZone'))

const fileInput = ref<HTMLInputElement>()
const isDragOver = ref(false)

const triggerFileInput = () => {
  if (!props.disabled) {
    fileInput.value?.click()
  }
}

const handleFileSelect = (event: Event) => {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files || [])
  if (files.length > 0) {
    emit('files-selected', files)
  }
  input.value = ''
}

const handleDrop = (event: DragEvent) => {
  if (props.disabled) return

  isDragOver.value = false
  const files = Array.from(event.dataTransfer?.files || [])
  if (files.length > 0) {
    emit('files-selected', files)
  }
}

const handleDragEnter = (event: DragEvent) => {
  if (!props.disabled) {
    event.preventDefault()
    isDragOver.value = true
  }
}

const handleDragLeave = (event: DragEvent) => {
  if (!props.disabled) {
    event.preventDefault()
    isDragOver.value = false
  }
}

const handleDragOver = (event: DragEvent) => {
  if (!props.disabled) {
    event.preventDefault()
  }
}
</script>

<template>
  <div
    class="drop-zone"
    :class="{
      'drop-zone--active': isDragOver,
      'drop-zone--disabled': disabled,
    }"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    @dragover="handleDragOver"
    @drop.prevent="handleDrop"
    @click="triggerFileInput"
  >
    <div class="drop-zone__content">
      <slot name="icon">
        <svg class="drop-zone__icon" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"
          />
        </svg>
      </slot>
      <slot name="text">
        <p class="drop-zone__text">{{ displayText }}</p>
      </slot>
    </div>
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      :multiple="multiple"
      :disabled="disabled"
      class="drop-zone__input"
      @change="handleFileSelect"
    />
  </div>
</template>

<style lang="scss" scoped>
.drop-zone {
  position: relative;
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  text-align: center;
  transition: all 0.2s ease;
  cursor: pointer;
  background: var(--surface-color);

  &:hover:not(&--disabled) {
    border-color: var(--primary-color);
    background-color: var(--background-color);
  }

  &--active {
    border-color: var(--primary-color);
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
    color: var(--text-secondary);
  }

  &__icon {
    width: 48px;
    height: 48px;
    color: var(--text-secondary);
    opacity: 0.5;
  }

  &__text {
    margin: 0;
    font-size: 0.875rem;
    color: var(--text-secondary);
  }

  &__input {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    pointer-events: none;
  }
}
</style>
