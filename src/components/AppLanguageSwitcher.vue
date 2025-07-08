<template>
  <div class="language-switcher">
    <button
      v-for="lang in availableLanguages"
      :key="lang.code"
      @click="changeLanguage(lang.code)"
      :class="[
        'language-switcher__button',
        { 'language-switcher__button--active': currentLanguage === lang.code },
      ]"
    >
      {{ lang.flag }} {{ lang.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

const availableLanguages = [
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
]

const currentLanguage = computed(() => locale.value)

const changeLanguage = (langCode: string) => {
  locale.value = langCode
}
</script>

<style lang="scss" scoped>
.language-switcher {
  display: flex;
  gap: var(--spacing-xs);

  &__button {
    padding: var(--spacing-xs) var(--spacing-sm);
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background: var(--surface-color);
    color: var(--text-secondary);
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--background-color);
    }

    &--active {
      background: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
    }
  }
}
</style>
