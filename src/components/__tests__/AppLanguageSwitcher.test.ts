import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import AppLanguageSwitcher from '../AppLanguageSwitcher.vue'

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

const mockLocale = ref('en')
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    locale: mockLocale,
  }),
}))

describe('AppLanguageSwitcher', () => {
  beforeEach(() => {
    mockLocale.value = 'en'
    vi.clearAllMocks()
  })

  describe('default behavior', () => {
    it('should render all available languages', () => {
      const wrapper = mount(AppLanguageSwitcher)

      const buttons = wrapper.findAll('.language-switcher__button')
      expect(buttons).toHaveLength(2)

      expect(buttons[0].find('.language-switcher__flag').text()).toBe('🇷🇺')
      expect(buttons[0].find('.language-switcher__name').text()).toBe('Русский')

      expect(buttons[1].find('.language-switcher__flag').text()).toBe('🇬🇧')
      expect(buttons[1].find('.language-switcher__name').text()).toBe('English')
    })

    it('should have correct component structure', () => {
      const wrapper = mount(AppLanguageSwitcher)

      expect(wrapper.classes()).toContain('language-switcher')
      expect(wrapper.findAll('.language-switcher__button')).toHaveLength(2)
    })
  })

  describe('language switching', () => {
    it('should change language when button is clicked', async () => {
      const wrapper = mount(AppLanguageSwitcher)

      const buttons = wrapper.findAll('.language-switcher__button')

      await buttons[0].trigger('click')

      expect(mockLocale.value).toBe('ru')
    })

    it('should change to English when English button is clicked', async () => {
      mockLocale.value = 'ru'
      const wrapper = mount(AppLanguageSwitcher)

      const buttons = wrapper.findAll('.language-switcher__button')

      await buttons[1].trigger('click')

      expect(mockLocale.value).toBe('en')
    })
  })

  describe('active state', () => {
    it('should mark current language as active', () => {
      mockLocale.value = 'en'
      const wrapper = mount(AppLanguageSwitcher)

      const buttons = wrapper.findAll('.language-switcher__button')

      expect(buttons[1].classes()).toContain('language-switcher__button--active')
      expect(buttons[0].classes()).not.toContain('language-switcher__button--active')
    })

    it('should update active state when language changes', async () => {
      mockLocale.value = 'en'
      const wrapper = mount(AppLanguageSwitcher)

      const buttons = wrapper.findAll('.language-switcher__button')

      expect(buttons[1].classes()).toContain('language-switcher__button--active')
      expect(buttons[0].classes()).not.toContain('language-switcher__button--active')

      await buttons[0].trigger('click')

      await wrapper.vm.$nextTick()

      expect(buttons[0].classes()).toContain('language-switcher__button--active')
      expect(buttons[1].classes()).not.toContain('language-switcher__button--active')
    })

    it('should handle Russian as active language', () => {
      mockLocale.value = 'ru'
      const wrapper = mount(AppLanguageSwitcher)

      const buttons = wrapper.findAll('.language-switcher__button')

      expect(buttons[0].classes()).toContain('language-switcher__button--active')
      expect(buttons[1].classes()).not.toContain('language-switcher__button--active')
    })
  })

  describe('localStorage integration', () => {
    it('should save language to localStorage when changed', async () => {
      const wrapper = mount(AppLanguageSwitcher)

      const buttons = wrapper.findAll('.language-switcher__button')

      await buttons[0].trigger('click')

      await wrapper.vm.$nextTick()

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('locale', 'ru')
    })

    it('should save English to localStorage', async () => {
      mockLocale.value = 'ru'
      const wrapper = mount(AppLanguageSwitcher)

      const buttons = wrapper.findAll('.language-switcher__button')

      await buttons[1].trigger('click')

      await wrapper.vm.$nextTick()

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('locale', 'en')
    })

    it('should call localStorage.setItem when locale changes', async () => {
      const wrapper = mount(AppLanguageSwitcher)

      mockLocale.value = 'ru'
      await wrapper.vm.$nextTick()

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('locale', 'ru')
    })
  })

  describe('button content', () => {
    it('should display correct flags for each language', () => {
      const wrapper = mount(AppLanguageSwitcher)

      const flags = wrapper.findAll('.language-switcher__flag')
      expect(flags[0].text()).toBe('🇷🇺')
      expect(flags[1].text()).toBe('🇬🇧')
    })

    it('should display correct names for each language', () => {
      const wrapper = mount(AppLanguageSwitcher)

      const names = wrapper.findAll('.language-switcher__name')
      expect(names[0].text()).toBe('Русский')
      expect(names[1].text()).toBe('English')
    })

    it('should have both flag and name in each button', () => {
      const wrapper = mount(AppLanguageSwitcher)

      const buttons = wrapper.findAll('.language-switcher__button')

      buttons.forEach((button) => {
        expect(button.find('.language-switcher__flag').exists()).toBe(true)
        expect(button.find('.language-switcher__name').exists()).toBe(true)
      })
    })
  })

  describe('language data structure', () => {
    it('should have correct language codes', async () => {
      const wrapper = mount(AppLanguageSwitcher)

      const buttons = wrapper.findAll('.language-switcher__button')

      await buttons[0].trigger('click')
      expect(mockLocale.value).toBe('ru')

      await buttons[1].trigger('click')
      expect(mockLocale.value).toBe('en')
    })
  })

  describe('edge cases', () => {
    it('should handle rapid language switching', async () => {
      const wrapper = mount(AppLanguageSwitcher)

      const buttons = wrapper.findAll('.language-switcher__button')

      await buttons[0].trigger('click')
      await buttons[1].trigger('click')
      await buttons[0].trigger('click')

      expect(mockLocale.value).toBe('ru')
      expect(mockLocalStorage.setItem).toHaveBeenCalled()
    })

    it('should handle clicking the same language multiple times', async () => {
      const wrapper = mount(AppLanguageSwitcher)

      const buttons = wrapper.findAll('.language-switcher__button')

      await buttons[1].trigger('click')
      await buttons[1].trigger('click')

      expect(mockLocale.value).toBe('en')
      expect(mockLocalStorage.setItem).toHaveBeenCalled()
    })
  })
})
