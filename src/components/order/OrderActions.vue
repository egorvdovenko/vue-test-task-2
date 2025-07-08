<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useOrderStore } from '@/stores/order'
import AppButton from '@/components/AppButton.vue'
import AppCard from '@/components/AppCard.vue'

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
    <div class="order-actions">
      <h4 class="order-actions__title">
        {{ $t('orderForm.actions.title') }}
      </h4>
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
      <div class="order-actions__info">
        <div class="order-actions__info-item">
          <span class="order-actions__info-label">{{ $t('orderForm.actions.createdAt') }}:</span>
          <span class="order-actions__info-value">{{
            formatDate(orderStore.originalOrderData?.createdAt)
          }}</span>
        </div>
        <div class="order-actions__info-item">
          <span class="order-actions__info-label">{{ $t('orderForm.actions.updatedAt') }}:</span>
          <span class="order-actions__info-value">{{
            formatDate(orderStore.originalOrderData?.updatedAt)
          }}</span>
        </div>
      </div>
      <div v-if="orderStore.hasUnsavedChanges" class="order-actions__warning">
        <span>{{ $t('orderForm.actions.unsavedChanges') }}</span>
      </div>
    </div>
  </AppCard>
</template>

<style lang="scss" scoped>
.order-actions {
  &__title {
    margin: 0 0 var(--spacing-lg) 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  &__buttons {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
  }

  &__button {
    width: 100%;
    justify-content: flex-start;
  }

  &__icon {
    width: 20px;
    height: 20px;
  }

  &__info {
    padding-top: var(--spacing-lg);
    border-top: 1px solid var(--border-color);

    &-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--spacing-sm) 0;
      border-bottom: 1px solid var(--border-color);

      &:last-child {
        border-bottom: none;
      }
    }

    &-label {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }

    &-value {
      font-size: 0.875rem;
      color: var(--text-primary);
      font-weight: 500;
    }
  }

  &__warning {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm) var(--spacing-md);
    background-color: #fef3c7;
    border: 1px solid #f59e0b;
    border-radius: var(--border-radius);
    color: #92400e;
    font-size: 0.875rem;
    margin-top: var(--spacing-lg);

    &-icon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
    }
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
