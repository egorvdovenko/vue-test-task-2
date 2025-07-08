<script setup lang="ts">
import { computed } from 'vue'
import { useOrderStore } from '@/stores/order'
import AppFiles from '@/components/AppFiles.vue'
import AppDropzone from '@/components/AppDropzone.vue'
import AppCard from '@/components/AppCard.vue'
import type { AttachedFile } from '@/types/order'

const orderStore = useOrderStore()

const currentFiles = computed(() => orderStore.currentOrderData?.attachedFiles || [])

const handleFilesSelected = (files: File[]) => {
  files.forEach(handleFile)
}

const handleFile = (file: File) => {
  const attachedFile: AttachedFile = {
    id: crypto.randomUUID(),
    name: file.name,
    type: file.type || 'application/octet-stream',
    size: file.size,
    url: URL.createObjectURL(file),
  }

  orderStore.addFile(attachedFile)
}

const removeFile = (fileId: string) => {
  orderStore.removeFile(fileId)
}
</script>

<template>
  <AppCard>
    <template #header>
      <h3>{{ $t('orderForm.files.title') }}</h3>
    </template>
    <AppFiles
      v-if="currentFiles.length > 0"
      :files="currentFiles"
      :editable="orderStore.isEditMode"
      @remove-file="removeFile"
    />
    <AppDropzone
      v-if="orderStore.isEditMode"
      multiple
      :text="$t('orderForm.files.dropZone')"
      @files-selected="handleFilesSelected"
    />
    <div v-else-if="currentFiles.length === 0" class="no-files">
      <p>{{ $t('orderForm.files.noFiles') }}</p>
    </div>
  </AppCard>
</template>

<style lang="scss" scoped>
.no-files {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius-lg);
}
</style>
