<script setup lang="ts">
import { computed } from 'vue'
import { useOrderStore } from '@/stores/order'
import AppFiles from '@/components/AppFiles.vue'
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
      :files="currentFiles"
      :editable="orderStore.isEditMode"
      :dropzone-text="$t('orderForm.files.dropZone')"
      :no-files-text="$t('orderForm.files.noFiles')"
      @files-selected="handleFilesSelected"
      @remove-file="removeFile"
    />
  </AppCard>
</template>
