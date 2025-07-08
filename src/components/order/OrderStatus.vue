<template>
  <AppCard>
    <template #header>
      <h3>{{ $t('orderForm.status.title') }}</h3>
    </template>
    <AppProgress
      :steps="statusSteps"
      :current-status="currentStatus"
      :status-order="[
        OrderStatus.Draft,
        OrderStatus.Published,
        OrderStatus.InProgress,
        OrderStatus.Completed,
      ]"
    />
    <div v-if="orderStore.isEditMode" class="status-selector">
      <label class="form-group__label">{{ $t('orderForm.status.changeStatus') }}:</label>
      <select v-model="selectedStatus" @change="updateStatus" class="form-group__input">
        <option v-for="step in statusSteps" :key="step.key" :value="step.key">
          {{ step.label }}
        </option>
      </select>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useOrderStore } from '@/stores/order'
import { useI18n } from 'vue-i18n'
import AppCard from '@/components/AppCard.vue'
import AppProgress from '@/components/AppProgress.vue'
import { OrderStatus } from '@/types/order'

const orderStore = useOrderStore()
const { t } = useI18n()

const selectedStatus = ref<OrderStatus>(OrderStatus.Draft)

const currentStatus = computed(() => orderStore.currentOrderData?.status || OrderStatus.Draft)

const statusSteps = computed(() => [
  { key: OrderStatus.Draft, label: t('orderForm.status.draft') },
  { key: OrderStatus.Published, label: t('orderForm.status.published') },
  { key: OrderStatus.InProgress, label: t('orderForm.status.inProgress') },
  { key: OrderStatus.Completed, label: t('orderForm.status.completed') },
])

watch(
  currentStatus,
  (newStatus) => {
    selectedStatus.value = newStatus
  },
  { immediate: true },
)

watch(
  () => orderStore.isEditMode,
  (isEdit) => {
    if (isEdit) {
      selectedStatus.value = currentStatus.value
    }
  },
)

const updateStatus = () => {
  orderStore.updateStatus(selectedStatus.value)
}
</script>

<style lang="scss" scoped>
.status-selector {
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
}

.form-group__label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-group__input {
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgb(37 99 235 / 0.1);
  }
}
</style>
