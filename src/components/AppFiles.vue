<script setup lang="ts">
import type { AttachedFile } from '@/types/order'

interface Props {
  files: AttachedFile[]
  editable?: boolean
}

withDefaults(defineProps<Props>(), {
  editable: false,
})

const emit = defineEmits<{
  'remove-file': [fileId: string]
}>()

const removeFile = (fileId: string) => {
  emit('remove-file', fileId)
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<template>
  <div class="files">
    <div v-for="file in files" :key="file.id" class="files__item">
      <div class="files__item-info">
        <div class="files__item-name">{{ file.name }}</div>
        <div class="files__item-size">{{ formatFileSize(file.size) }}</div>
      </div>
      <button
        v-if="editable"
        @click="removeFile(file.id)"
        class="files__item-remove"
        :title="$t?.('common.remove') || 'Remove'"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.files {
  margin-bottom: var(--spacing-lg);

  &:last-child {
    margin-bottom: 0;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    margin-bottom: var(--spacing-sm);
    background: var(--surface-color);

    &:last-child {
      margin-bottom: 0;
    }

    &:hover {
      background: var(--background-color);
    }
  }

  &__item-info {
    flex: 1;
    min-width: 0;
  }

  &__item-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__item-size {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-top: 2px;
  }

  &__item-remove {
    width: 24px;
    height: 24px;
    padding: 0;
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    &:hover {
      background-color: var(--background-color);
      color: var(--error-color);
    }
  }
}
</style>
