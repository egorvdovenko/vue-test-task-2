<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useOrderStore } from '@/stores/order'
import AppCard from '@/components/AppCard.vue'
import AppInput from '@/components/AppInput.vue'
import AppRating from '@/components/AppRating.vue'
import type { Manufacturer } from '@/types/order'

const orderStore = useOrderStore()

const localData = ref<Manufacturer>({
  name: '',
  contact: '',
  rating: 0,
})

const currentData = computed(() => orderStore.currentOrderData)

watch(
  currentData,
  (newData) => {
    if (newData) {
      localData.value = { ...newData.manufacturer }
    }
  },
  { immediate: true },
)

watch(
  () => orderStore.isEditMode,
  (isEdit) => {
    if (isEdit && currentData.value) {
      localData.value = { ...currentData.value.manufacturer }
    }
  },
)

const updateField = <K extends keyof Manufacturer>(field: K, value: Manufacturer[K]) => {
  orderStore.updateManufacturer(field, value)
}
</script>

<template>
  <AppCard>
    <template #header>
      <h3>{{ $t('orderForm.manufacturer.title') }}</h3>
    </template>
    <AppInput
      v-model="localData.name"
      :label="$t('orderForm.manufacturer.name')"
      :placeholder="$t('orderForm.manufacturer.name')"
      :readonly="!orderStore.isEditMode"
      @update:model-value="updateField('name', String($event))"
    >
      <template #readonly>
        {{ currentData?.manufacturer.name || '-' }}
      </template>
    </AppInput>
    <AppInput
      v-model="localData.contact"
      :label="$t('orderForm.manufacturer.contact')"
      :placeholder="$t('orderForm.manufacturer.contact')"
      :readonly="!orderStore.isEditMode"
      @update:model-value="updateField('contact', String($event))"
    >
      <template #readonly>
        {{ currentData?.manufacturer.contact || '-' }}
      </template>
    </AppInput>
    <AppInput
      v-model="localData.rating"
      type="number"
      :label="$t('orderForm.manufacturer.rating')"
      :placeholder="$t('orderForm.manufacturer.rating')"
      :readonly="!orderStore.isEditMode"
      @update:model-value="updateField('rating', Number($event))"
    >
      <template #readonly>
        <AppRating :model-value="currentData?.manufacturer.rating || 0" readonly />
      </template>
    </AppInput>
  </AppCard>
</template>
