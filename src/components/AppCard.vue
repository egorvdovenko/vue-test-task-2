<script setup lang="ts">
interface Props {
  shadow?: boolean
  padding?: boolean
}

withDefaults(defineProps<Props>(), {
  shadow: true,
  padding: true,
})
</script>

<template>
  <div
    class="card"
    :class="{
      'card--no-shadow': !shadow,
      'card--no-padding': !padding,
    }"
  >
    <header v-if="$slots.header" class="card__header">
      <slot name="header" />
    </header>
    <div class="card__content">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="card__footer">
      <slot name="footer" />
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.card {
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);

  &--no-shadow {
    box-shadow: none;
  }

  &__header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--border-color);
  }

  &__content {
    padding: var(--spacing-lg);

    .card--no-padding & {
      padding: 0;
    }
  }

  &__footer {
    padding: var(--spacing-lg);
    border-top: 1px solid var(--border-color);
    background-color: #f8fafc;
  }
}
</style>
