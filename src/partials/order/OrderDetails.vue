<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useOrderStore } from '@/stores/order'
import AppCard from '@/components/AppCard.vue'
import AppInput from '@/components/AppInput.vue'
import AppTextarea from '@/components/AppTextarea.vue'
import { useLocalState } from '@/composables/useLocalState'
import { useFieldValidation } from '@/composables/useFieldValidation'

const orderStore = useOrderStore()
const { t } = useI18n()

const currentData = computed(() => orderStore.currentOrderData)

const localData = useLocalState(
  computed(() =>
    currentData.value
      ? {
          title: currentData.value.title || '',
          description: currentData.value.description || '',
        }
      : null,
  ),
  computed(() => orderStore.isEditMode),
  { title: '', description: '' },
)

const titleValidation = useFieldValidation(
  computed(() => localData.value.title),
  { required: true },
  computed(() => orderStore.isEditMode),
  { required: t('orderForm.validation.titleRequired') },
)

const descriptionValidation = useFieldValidation(
  computed(() => localData.value.description),
  { required: true },
  computed(() => orderStore.isEditMode),
  { required: t('orderForm.validation.descriptionRequired') },
)

const updateTitle = () => {
  orderStore.updateField('title', localData.value.title)
}

const updateDescription = () => {
  orderStore.updateField('description', localData.value.description)
}
</script>

<template>
  <AppCard>
    <template #header>
      <h3>{{ $t('orderForm.title') }}</h3>
    </template>
    <AppInput
      v-model="localData.title"
      :label="$t('orderForm.orderTitle')"
      :placeholder="$t('orderForm.orderTitle')"
      :readonly="!orderStore.isEditMode"
      :error="titleValidation.error.value"
      required
      @update:modelValue="updateTitle"
    />
    <AppTextarea
      v-model="localData.description"
      :label="$t('orderForm.description')"
      :placeholder="$t('orderForm.description')"
      :readonly="!orderStore.isEditMode"
      :error="descriptionValidation.error.value"
      :rows="6"
      required
      @update:modelValue="updateDescription"
    >
    </AppTextarea>
  </AppCard>
</template>
