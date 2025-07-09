<script setup lang="ts">
interface Props {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

withDefaults(defineProps<Props>(), {
  message: '',
  size: 'md',
})
</script>

<template>
  <div class="loader" :class="`loader--${size}`">
    <div class="loader__spinner"></div>
    <p v-if="message" class="loader__message">{{ message }}</p>
  </div>
</template>

<style lang="scss" scoped>
.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);

  &--sm {
    padding: var(--spacing-md);
  }

  &--lg {
    padding: var(--spacing-2xl);
  }

  &__spinner {
    width: 40px;
    height: 40px;
    border: 3px solid var(--border-color);
    border-top: 3px solid var(--primary-color);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  &--sm &__spinner {
    width: 24px;
    height: 24px;
    border-width: 2px;
  }

  &--lg &__spinner {
    width: 56px;
    height: 56px;
    border-width: 4px;
  }

  &__message {
    margin: var(--spacing-md) 0 0;
    color: var(--text-secondary);
    font-size: 0.9rem;
    text-align: center;
  }

  &--sm &__message {
    margin-top: var(--spacing-sm);
    font-size: 0.8rem;
  }

  &--lg &__message {
    margin-top: var(--spacing-lg);
    font-size: 1rem;
  }
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
