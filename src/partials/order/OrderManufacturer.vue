<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useOrderStore } from '@/stores/order'
import AppCard from '@/components/AppCard.vue'
import AppInput from '@/components/AppInput.vue'
import AppRating from '@/components/AppRating.vue'
import type { Manufacturer } from '@/types/order'
import { useLocalState } from '@/composables/useLocalState'
import { useFieldValidation } from '@/composables/useFieldValidation'

const orderStore = useOrderStore()
const { t } = useI18n()

const currentData = computed(() => orderStore.currentOrderData)

const localData = useLocalState(
  computed(() => currentData.value?.manufacturer),
  computed(() => orderStore.isEditMode),
  { name: '', contact: '', rating: 0 } as Manufacturer,
)

const nameValidation = useFieldValidation(
  computed(() => localData.value.name),
  { required: true },
  computed(() => orderStore.isEditMode),
  { required: t('orderForm.validation.manufacturerNameRequired') },
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
      :error="nameValidation.error.value"
      required
      @update:model-value="updateField('name', String($event))"
    >
      <template #readonly>
        {{ currentData?.manufacturer.name || t('common.noData') }}
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
        {{ currentData?.manufacturer.contact || t('common.noData') }}
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
