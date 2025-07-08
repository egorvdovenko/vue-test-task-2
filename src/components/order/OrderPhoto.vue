<script setup lang="ts">
import { computed } from 'vue'
import { useOrderStore } from '@/stores/order'
import AppDropzone from '@/components/AppDropzone.vue'
import AppCard from '@/components/AppCard.vue'
import AppPreviewer from '@/components/AppPreviewer.vue'

const orderStore = useOrderStore()

const currentPhoto = computed(() => orderStore.currentOrderData?.photo)

const handleFilesSelected = (files: File[]) => {
  const file = files[0]
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      orderStore.updatePhoto(result)
    }
    reader.readAsDataURL(file)
  }
}

const removePhoto = () => {
  orderStore.updatePhoto('')
}
</script>

<template>
  <AppCard>
    <template #header>
      <h3>{{ $t('orderForm.photo.title') }}</h3>
    </template>
    <AppPreviewer
      v-if="currentPhoto"
      :src="currentPhoto"
      :alt="$t('orderForm.photo.title')"
      :show-remove-button="orderStore.isEditMode"
      :enable-zoom="!orderStore.isEditMode"
      :remove-button-title="$t('orderForm.cancel')"
      @remove="removePhoto"
    />
    <AppDropzone
      v-else-if="orderStore.isEditMode"
      accept="image/*"
      :text="$t('orderForm.photo.dropZone')"
      @files-selected="handleFilesSelected"
    />
    <div v-else class="no-photo">
      <p>{{ $t('orderForm.photo.noPhoto') }}</p>
    </div>
  </AppCard>
</template>

<style lang="scss" scoped>
.no-photo {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-secondary);
  border: 2px dashed var(--border-color);
  border-radius: var(--border-radius-lg);
}
</style>
