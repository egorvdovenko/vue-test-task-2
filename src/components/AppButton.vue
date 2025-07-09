<script setup lang="ts">
import { computed } from 'vue'

type ButtonVariant = 'primary' | 'secondary' | 'success'
type ButtonSize = 'sm' | 'md' | 'lg'

interface Props {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
  href?: string
  target?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  type: 'button',
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}

const classes = computed(() => [
  'button',
  `button--${props.variant}`,
  `button--${props.size}`,
  {
    'button--loading': props.loading,
  },
])
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :class="classes"
    :disabled="disabled || loading"
    :type="href ? undefined : type"
    :href="href"
    :target="target"
    @click="handleClick"
  >
    <span v-if="loading" class="button__spinner">
      <svg class="button__spinner-icon" viewBox="0 0 24 24">
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
          fill="none"
          stroke-linecap="round"
          stroke-dasharray="32"
          stroke-dashoffset="32"
        >
          <animate
            attributeName="stroke-dasharray"
            dur="2s"
            values="0 32;16 16;0 32;0 32"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-dashoffset"
            dur="2s"
            values="0;-16;-32;-32"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </span>
    <slot />
  </component>
</template>

<style lang="scss" scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid transparent;
  border-radius: var(--border-radius);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--loading {
    pointer-events: none;
  }

  &--primary {
    background-color: var(--primary-color);
    color: var(--color-white);

    &:hover:not(:disabled):not(.button--loading) {
      background-color: var(--primary-hover);
    }
  }

  &--secondary {
    background-color: transparent;
    color: var(--text-secondary);
    border-color: var(--border-color);

    &:hover:not(:disabled):not(.button--loading) {
      background-color: var(--background-color);
    }
  }

  &--success {
    background-color: var(--success-color);
    color: var(--color-white);

    &:hover:not(:disabled):not(.button--loading) {
      background-color: var(--success-hover);
    }
  }

  &--sm {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: 0.75rem;
  }

  &--lg {
    padding: var(--spacing-md) var(--spacing-lg);
    font-size: 1rem;
  }

  &__spinner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  &__spinner-icon {
    width: 1em;
    height: 1em;
    animation: spin 1s linear infinite;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
