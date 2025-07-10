<script setup lang="ts">
import { computed, watch } from 'vue'
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

watch(
  () => locale.value,
  (newLocale: string) => {
    localStorage.setItem('locale', newLocale)
  },
)
</script>

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
      <span class="language-switcher__flag">{{ lang.flag }}</span>
      <span class="language-switcher__name">{{ lang.name }}</span>
    </button>
  </div>
</template>

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
    display: flex;
    align-items: center;
    gap: var(--spacing-xs);
    min-height: 32px;

    &:hover {
      background: var(--background-color);
    }

    &--active {
      background: var(--primary-color);
      color: var(--color-white);
      border-color: var(--primary-color);
    }

    @media (max-width: 768px) {
      padding: var(--spacing-sm);
      min-height: 40px;
      font-size: 0.875rem;
    }

    @media (max-width: 480px) {
      .language-switcher__name {
        display: none;
      }

      .language-switcher__flag {
        font-size: 1.125rem;
      }

      padding: var(--spacing-sm) var(--spacing-xs);
      min-width: 40px;
      justify-content: center;
    }
  }

  &__flag {
    line-height: 1;
  }

  &__name {
    font-weight: 500;
    white-space: nowrap;
  }
}
</style>
