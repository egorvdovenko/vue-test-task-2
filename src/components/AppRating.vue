<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: number
  readonly?: boolean
  max?: number
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
}

interface Emits {
  (e: 'update:modelValue', value: number): void
}

const props = withDefaults(defineProps<Props>(), {
  readonly: false,
  max: 5,
  showValue: true,
  size: 'md',
})

const emit = defineEmits<Emits>()

const starSize = computed(() => {
  const sizes = {
    sm: 14,
    md: 16,
    lg: 20,
  }
  return sizes[props.size]
})

const handleStarClick = (rating: number) => {
  if (!props.readonly) {
    emit('update:modelValue', rating)
  }
}
</script>

<template>
  <div class="rating" :class="{ 'rating--readonly': readonly }">
    <span v-if="showValue" class="rating__value">{{ modelValue || 0 }}</span>
    <div class="rating__stars">
      <svg
        v-for="star in max"
        :key="star"
        class="rating__star"
        :class="{
          'rating__star--filled': star <= Math.round(modelValue || 0),
          'rating__star--interactive': !readonly,
        }"
        :style="{ width: `${starSize}px`, height: `${starSize}px` }"
        viewBox="0 0 24 24"
        fill="currentColor"
        @click="handleStarClick(star)"
      >
        <path
          d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.46,13.97L5.82,21L12,17.27Z"
        />
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.rating {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);

  &__value {
    font-weight: 500;
    color: var(--text-primary);
  }

  &__stars {
    display: flex;
    gap: 2px;
  }

  &__star {
    color: var(--border-color);
    transition: color 0.2s ease;

    &--filled {
      color: var(--star-color);
    }

    &--interactive {
      cursor: pointer;

      &:hover {
        color: var(--star-hover);
      }
    }
  }

  &--readonly &__star--interactive {
    cursor: default;

    &:hover {
      color: var(--border-color);
    }

    &.rating__star--filled:hover {
      color: var(--star-color);
    }
  }
}
</style>
