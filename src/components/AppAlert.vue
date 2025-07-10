<script setup lang="ts">
import { computed } from 'vue'

export interface AppAlertProps {
  variant?: 'warning' | 'error' | 'success' | 'info'
  size?: 'small' | 'medium' | 'large'
  position?: 'default' | 'inline' | 'top'
  showIcon?: boolean
}

const props = withDefaults(defineProps<AppAlertProps>(), {
  variant: 'info',
  size: 'medium',
  position: 'default',
  showIcon: false,
})

const alertClasses = computed(() => {
  const classes = ['alert', `alert--${props.variant}`]

  if (props.size !== 'medium') {
    classes.push(`alert--${props.size}`)
  }

  if (props.position !== 'default') {
    classes.push(`alert--${props.position}`)
  }

  return classes
})

const iconName = computed(() => {
  switch (props.variant) {
    case 'warning':
      return '⚠️'
    case 'error':
      return '❌'
    case 'success':
      return '✅'
    case 'info':
    default:
      return 'ℹ️'
  }
})
</script>

<template>
  <div :class="alertClasses">
    <span v-if="showIcon" class="alert__icon" role="img" :aria-label="variant">
      {{ iconName }}
    </span>
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.alert {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  margin-top: var(--spacing-lg);

  &__icon {
    width: var(--icon-sm);
    height: var(--icon-sm);
    flex-shrink: 0;
  }

  &--warning {
    background-color: var(--warning-bg);
    border: 1px solid var(--warning-color);
    color: var(--warning-text);
  }

  &--error {
    background-color: var(--error-bg);
    border: 1px solid var(--error-color);
    color: var(--error-text);
  }

  &--success {
    background-color: var(--success-bg);
    border: 1px solid var(--success-color);
    color: var(--success-text);
  }

  &--info {
    background-color: var(--info-bg);
    border: 1px solid var(--info-color);
    color: var(--info-text);
  }

  &--small {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: 0.75rem;
    margin-top: var(--spacing-md);

    .alert__icon {
      width: var(--icon-xs);
      height: var(--icon-xs);
    }
  }

  &--large {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: 1rem;
    margin-top: var(--spacing-xl);

    .alert__icon {
      width: var(--icon-md);
      height: var(--icon-md);
    }
  }

  &--inline {
    margin-top: 0;
    margin-bottom: 0;
  }

  &--top {
    margin-top: 0;
    margin-bottom: var(--spacing-lg);
  }
}
</style>
