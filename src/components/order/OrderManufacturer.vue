<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useOrderStore } from '@/stores/order'
import AppCard from '@/components/AppCard.vue'
import AppInput from '@/components/AppInput.vue'
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
        <div class="rating-display">
          <span class="rating-display__value">{{ currentData?.manufacturer.rating || 0 }}</span>
          <div class="star-rating">
            <svg
              v-for="star in 5"
              :key="star"
              class="star-rating__star"
              :class="{
                'star-rating__star--filled':
                  star <= Math.round(currentData?.manufacturer.rating || 0),
              }"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"
              />
            </svg>
          </div>
        </div>
      </template>
    </AppInput>
    <div v-if="orderStore.isEditMode" class="rating-input">
      <div class="star-rating">
        <svg
          v-for="star in 5"
          :key="star"
          class="star-rating__star"
          :class="{ 'star-rating__star--filled': star <= Math.round(localData.rating) }"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path
            d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"
          />
        </svg>
      </div>
    </div>
  </AppCard>
</template>

<style lang="scss" scoped>
.rating-input {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
}

.rating-display {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);

  &__value {
    font-weight: 500;
    color: var(--text-primary);
  }
}

.star-rating {
  display: flex;
  gap: 2px;

  &__star {
    width: 16px;
    height: 16px;
    color: var(--border-color);
    transition: color 0.2s ease;

    &--filled {
      color: #fbbf24;
    }
  }
}
</style>
