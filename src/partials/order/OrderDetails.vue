<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useOrderStore } from '@/stores/order'
import AppCard from '@/components/AppCard.vue'
import AppInput from '@/components/AppInput.vue'
import AppTextarea from '@/components/AppTextarea.vue'
import { useLocalState } from '@/composables/useLocalState'
import { useFieldValidation } from '@/composables/useFieldValidation'
import { useTextFormatting } from '@/composables/useTextFormatting'

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

const { useFormattedDescription } = useTextFormatting()
const formattedDescription = useFormattedDescription(computed(() => currentData.value?.description))

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
    <div v-if="orderStore.isEditMode">
      <AppInput
        v-model="localData.title"
        :label="$t('orderForm.orderTitle')"
        :placeholder="$t('orderForm.orderTitle')"
        :error="titleValidation.error.value"
        required
        @update:modelValue="updateTitle"
      />
      <AppTextarea
        v-model="localData.description"
        :label="$t('orderForm.description')"
        :placeholder="$t('orderForm.description')"
        :error="descriptionValidation.error.value"
        :rows="6"
        required
        @update:modelValue="updateDescription"
      />
    </div>
    <div v-else>
      <div class="form-group">
        <label class="form-group__label">{{ $t('orderForm.orderTitle') }}</label>
        <div class="form-group__value">
          {{ currentData?.title || t('common.noData') }}
        </div>
      </div>
      <div class="form-group">
        <label class="form-group__label">{{ $t('orderForm.description') }}</label>
        <div class="form-group__value form-group__value--multiline">
          <div v-html="formattedDescription"></div>
        </div>
      </div>
    </div>
  </AppCard>
</template>
