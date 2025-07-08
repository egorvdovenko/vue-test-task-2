<script setup lang="ts">
import AppDropzone from '@/components/AppDropzone.vue'
import type { AttachedFile } from '@/types/order'

interface Props {
  files: AttachedFile[]
  editable?: boolean
  showDropzone?: boolean
  dropzoneText?: string
  noFilesText?: string
}

withDefaults(defineProps<Props>(), {
  editable: false,
  showDropzone: true,
  dropzoneText: 'Drop files here or click to upload',
  noFilesText: 'No files attached',
})

const emit = defineEmits<{
  'files-selected': [files: File[]]
  'remove-file': [fileId: string]
}>()

const handleFilesSelected = (files: File[]) => {
  emit('files-selected', files)
}

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
  <div class="app-files">
    <div v-if="files.length > 0" class="app-files__list">
      <div v-for="file in files" :key="file.id" class="app-files__list-item">
        <div class="app-files__list-item-info">
          <div class="app-files__list-item-name">{{ file.name }}</div>
          <div class="app-files__list-item-size">{{ formatFileSize(file.size) }}</div>
        </div>
        <button
          v-if="editable"
          @click="removeFile(file.id)"
          class="app-files__list-item-remove"
          :title="$t?.('common.remove') || 'Remove'"
        >
          ✕
        </button>
      </div>
    </div>
    <AppDropzone
      v-if="editable && showDropzone"
      multiple
      :text="dropzoneText"
      @files-selected="handleFilesSelected"
    />
    <div v-else-if="files.length === 0" class="no-files">
      <p>{{ noFilesText }}</p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-files {
  width: 100%;

  &__list {
    margin-bottom: var(--spacing-lg);

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__list-item {
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

  &__list-item-info {
    flex: 1;
    min-width: 0;
  }

  &__list-item-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: var(--text-primary);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__list-item-size {
    font-size: 0.75rem;
    color: var(--text-secondary);
    margin-top: 2px;
  }

  &__list-item-remove {
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

.no-files {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius-lg);
}
</style>
