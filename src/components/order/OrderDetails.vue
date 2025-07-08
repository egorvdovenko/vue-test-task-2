<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useOrderStore } from '@/stores/order'
import { useI18n } from 'vue-i18n'
import AppCard from '@/components/AppCard.vue'
import AppInput from '@/components/AppInput.vue'
import AppTextarea from '@/components/AppTextarea.vue'

const orderStore = useOrderStore()
const { t } = useI18n()

const localTitle = ref('')
const localDescription = ref('')

const currentData = computed(() => orderStore.currentOrderData)

watch(
  currentData,
  (newData) => {
    if (newData) {
      localTitle.value = newData.title
      localDescription.value = newData.description
    }
  },
  { immediate: true },
)

watch(
  () => orderStore.isEditMode,
  (isEdit) => {
    if (isEdit && currentData.value) {
      localTitle.value = currentData.value.title
      localDescription.value = currentData.value.description
    }
  },
)

const titleError = computed(() => {
  if (orderStore.isEditMode && !localTitle.value?.trim()) {
    return t('orderForm.validation.titleRequired')
  }
  return ''
})

const descriptionError = computed(() => {
  if (orderStore.isEditMode && !localDescription.value?.trim()) {
    return t('orderForm.validation.descriptionRequired')
  }
  return ''
})

const formattedDescription = computed(() => {
  if (!currentData.value?.description) return ''

  return currentData.value.description
    .replace(/\n/g, '<br>')
    .replace(/^• (.+)$/gm, '<ul><li>$1</li></ul>')
    .replace(/<\/ul>\s*<ul>/g, '')
})

const updateTitle = () => {
  orderStore.updateField('title', localTitle.value)
}

const updateDescription = () => {
  orderStore.updateField('description', localDescription.value)
}
</script>

<template>
  <AppCard>
    <template #header>
      <h3>{{ $t('orderForm.title') }}</h3>
    </template>
    <div v-if="orderStore.isEditMode">
      <AppInput
        v-model="localTitle"
        :label="$t('orderForm.orderTitle')"
        :placeholder="$t('orderForm.orderTitle')"
        :error="titleError"
        required
        @update:modelValue="updateTitle"
      />
      <AppTextarea
        v-model="localDescription"
        :label="$t('orderForm.description')"
        :placeholder="$t('orderForm.description')"
        :error="descriptionError"
        :rows="6"
        required
        @update:modelValue="updateDescription"
      />
    </div>
    <div v-else>
      <div class="form-group">
        <label class="form-group__label">{{ $t('orderForm.orderTitle') }}</label>
        <div class="form-group__value">
          {{ currentData?.title || '-' }}
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

<style lang="scss" scoped>
@use '@/assets/styles/components/form-group.scss';

.form-group__value--multiline {
  line-height: 1.6;
  white-space: pre-wrap;

  :deep(ul) {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
  }

  :deep(li) {
    margin: 0.25rem 0;
  }
}
</style>
