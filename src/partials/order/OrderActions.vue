<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useOrderStore } from '@/stores/order'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'
import AppAlert from '@/components/AppAlert.vue'

const { locale } = useI18n()
const orderStore = useOrderStore()

const goToChat = () => {
  alert('goToChat')
}

const contactSupport = () => {
  alert('contactSupport')
}

const formatDate = (date: Date | undefined): string => {
  if (!date) return '-'

  const localeCode = locale.value === 'ru' ? 'ru-RU' : 'en-US'

  return new Intl.DateTimeFormat(localeCode, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}
</script>

<template>
  <AppCard>
    <template #header>
      <h3>{{ $t('orderForm.actions.title') }}</h3>
    </template>
    <div class="order-actions">
      <div class="order-actions__buttons">
        <AppButton @click="goToChat" variant="primary" size="lg" class="order-actions__button">
          {{ $t('orderForm.actions.goToChat') }}
        </AppButton>
        <AppButton
          @click="contactSupport"
          variant="secondary"
          size="lg"
          class="order-actions__button"
        >
          {{ $t('orderForm.actions.contactSupport') }}
        </AppButton>
      </div>
      <div class="info-list info-list--bordered">
        <div class="info-item">
          <span class="info-item__label">{{ $t('orderForm.actions.createdAt') }}:</span>
          <span class="info-item__value">{{
            formatDate(orderStore.originalOrderData?.createdAt)
          }}</span>
        </div>
        <div class="info-item">
          <span class="info-item__label">{{ $t('orderForm.actions.updatedAt') }}:</span>
          <span class="info-item__value">{{
            formatDate(orderStore.originalOrderData?.updatedAt)
          }}</span>
        </div>
      </div>
      <AppAlert v-if="orderStore.hasUnsavedChanges" variant="warning">
        {{ $t('orderForm.actions.unsavedChanges') }}
      </AppAlert>
    </div>
  </AppCard>
</template>

<style lang="scss" scoped>
.order-actions {
  &__buttons {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
  }
}

@media (min-width: 768px) {
  .order-actions__buttons {
    flex-direction: row;

    .order-actions__button {
      flex: 1;
    }
  }
}
</style>
