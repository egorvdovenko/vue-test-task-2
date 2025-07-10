<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useOrderStore } from '@/stores/order'
import AppButton from '@/components/AppButton.vue'
import AppLoader from '@/components/AppLoader.vue'
import OrderPhoto from '@/partials/order/OrderPhoto.vue'
import OrderFiles from '@/partials/order/OrderFiles.vue'
import OrderDetails from '@/partials/order/OrderDetails.vue'
import OrderManufacturer from '@/partials/order/OrderManufacturer.vue'
import OrderOrganization from '@/partials/order/OrderOrganization.vue'
import OrderStatus from '@/partials/order/OrderStatus.vue'
import OrderActions from '@/partials/order/OrderActions.vue'

const orderStore = useOrderStore()

const isFormValid = computed(() => {
  const data = orderStore.currentOrderData
  if (!data) return false

  return !!(data.title?.trim() && data.description?.trim())
})

const handleSave = () => {
  if (isFormValid.value) {
    orderStore.saveChanges()
  }
}

onMounted(() => {
  orderStore.loadOrder()
})
</script>

<template>
  <div class="order-view">
    <AppLoader
      v-if="orderStore.isLoadingOrder"
      :message="$t('common.loadingData')"
      size="lg"
      class="order-view__loader"
    />
    <div v-else class="l-container">
      <div class="order-view__header">
        <div class="order-view__header-content">
          <h1 class="order-view__title">{{ $t('orderForm.title') }}</h1>
          <div class="order-view__actions">
            <AppButton
              v-if="!orderStore.isEditMode && !orderStore.isLoadingOrder"
              @click="orderStore.startEdit"
              variant="primary"
            >
              {{ $t('orderForm.edit') }}
            </AppButton>
            <template v-else-if="orderStore.isEditMode">
              <AppButton @click="handleSave" :disabled="!isFormValid" variant="success">
                {{ $t('orderForm.save') }}
              </AppButton>
              <AppButton @click="orderStore.cancelEdit" variant="secondary">
                {{ $t('orderForm.cancel') }}
              </AppButton>
            </template>
          </div>
        </div>
      </div>
      <div class="order-view__content">
        <div class="order-view__left">
          <OrderPhoto />
          <OrderFiles />
        </div>
        <div class="order-view__right">
          <OrderDetails />
          <OrderManufacturer />
          <OrderOrganization />
          <OrderStatus />
          <OrderActions />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.order-view {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: var(--spacing-xl) 0;

  &__loader {
    flex: 1;
  }

  &__header {
    margin-bottom: var(--spacing-2xl);
  }

  &__header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__title {
    margin: 0;
    font-size: 2rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  &__actions {
    display: flex;
    gap: var(--spacing-sm);
  }

  &__content {
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: var(--spacing-2xl);

    @media (max-width: var(--breakpoint-tablet)) {
      grid-template-columns: 1fr;
    }
  }

  &__left,
  &__right {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
    min-height: 400px;
  }
}
</style>
