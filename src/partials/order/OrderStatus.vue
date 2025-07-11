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
    <div v-if="orderStore.isEditMode">
      <AppSelect
        v-model="selectedStatus"
        :label="$t('orderForm.status.changeStatus')"
        :options="statusOptions"
        @change="updateStatus"
      />
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useOrderStore } from '@/stores/order'
import { useI18n } from 'vue-i18n'
import AppCard from '@/components/AppCard.vue'
import AppProgress from '@/components/AppProgress.vue'
import AppSelect from '@/components/AppSelect.vue'
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

const statusOptions = computed(() =>
  statusSteps.value.map((step) => ({
    value: step.key,
    label: step.label,
  })),
)

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

const updateStatus = (value: string | number) => {
  orderStore.updateStatus(value as OrderStatus)
}
</script>
