import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppAlert from '../AppAlert.vue'

describe('AppAlert', () => {
  describe('default behavior', () => {
    it('should render with default props', () => {
      const wrapper = mount(AppAlert, {
        slots: {
          default: 'Test message',
        },
      })

      expect(wrapper.text()).toBe('Test message')
      expect(wrapper.classes()).toContain('alert')
      expect(wrapper.classes()).toContain('alert--info')
      expect(wrapper.find('.alert__icon').exists()).toBe(false)
    })

    it('should apply default variant, size, and position', () => {
      const wrapper = mount(AppAlert)

      expect(wrapper.classes()).toEqual(['alert', 'alert--info'])
    })
  })

  describe('variant prop', () => {
    it('should apply correct CSS class for each variant', () => {
      const variants = ['warning', 'error', 'success', 'info'] as const

      variants.forEach((variant) => {
        const wrapper = mount(AppAlert, {
          props: { variant },
        })

        expect(wrapper.classes()).toContain(`alert--${variant}`)
      })
    })

    it('should show correct icon for each variant when showIcon is true', () => {
      const variantIcons = {
        warning: '⚠️',
        error: '❌',
        success: '✅',
        info: 'ℹ️',
      }

      Object.entries(variantIcons).forEach(([variant, expectedIcon]) => {
        const wrapper = mount(AppAlert, {
          props: {
            variant: variant as 'warning' | 'error' | 'success' | 'info',
            showIcon: true,
          },
        })

        const icon = wrapper.find('.alert__icon')
        expect(icon.exists()).toBe(true)
        expect(icon.text()).toBe(expectedIcon)
        expect(icon.attributes('aria-label')).toBe(variant)
      })
    })
  })

  describe('size prop', () => {
    it('should not add size class for medium size (default)', () => {
      const wrapper = mount(AppAlert, {
        props: { size: 'medium' },
      })

      expect(wrapper.classes()).not.toContain('alert--medium')
    })

    it('should add size class for non-medium sizes', () => {
      const sizes = ['small', 'large'] as const

      sizes.forEach((size) => {
        const wrapper = mount(AppAlert, {
          props: { size },
        })

        expect(wrapper.classes()).toContain(`alert--${size}`)
      })
    })
  })

  describe('position prop', () => {
    it('should not add position class for default position', () => {
      const wrapper = mount(AppAlert, {
        props: { position: 'default' },
      })

      expect(wrapper.classes()).not.toContain('alert--default')
    })

    it('should add position class for non-default positions', () => {
      const positions = ['inline', 'top'] as const

      positions.forEach((position) => {
        const wrapper = mount(AppAlert, {
          props: { position },
        })

        expect(wrapper.classes()).toContain(`alert--${position}`)
      })
    })
  })

  describe('showIcon prop', () => {
    it('should hide icon when showIcon is false', () => {
      const wrapper = mount(AppAlert, {
        props: { showIcon: false },
      })

      expect(wrapper.find('.alert__icon').exists()).toBe(false)
    })

    it('should show icon when showIcon is true', () => {
      const wrapper = mount(AppAlert, {
        props: { showIcon: true },
      })

      const icon = wrapper.find('.alert__icon')
      expect(icon.exists()).toBe(true)
      expect(icon.attributes('role')).toBe('img')
    })
  })

  describe('combined props', () => {
    it('should apply multiple CSS classes when multiple props are set', () => {
      const wrapper = mount(AppAlert, {
        props: {
          variant: 'warning',
          size: 'large',
          position: 'top',
        },
      })

      expect(wrapper.classes()).toEqual(['alert', 'alert--warning', 'alert--large', 'alert--top'])
    })

    it('should render with all custom props', () => {
      const wrapper = mount(AppAlert, {
        props: {
          variant: 'error',
          size: 'small',
          position: 'inline',
          showIcon: true,
        },
        slots: {
          default: 'Error message',
        },
      })

      expect(wrapper.text()).toBe('❌Error message')
      expect(wrapper.classes()).toEqual(['alert', 'alert--error', 'alert--small', 'alert--inline'])

      const icon = wrapper.find('.alert__icon')
      expect(icon.exists()).toBe(true)
      expect(icon.text()).toBe('❌')
      expect(icon.attributes('aria-label')).toBe('error')
    })
  })

  describe('slot content', () => {
    it('should render slot content', () => {
      const wrapper = mount(AppAlert, {
        slots: {
          default: '<strong>Bold message</strong>',
        },
      })

      expect(wrapper.html()).toContain('<strong>Bold message</strong>')
    })

    it('should render without slot content', () => {
      const wrapper = mount(AppAlert)

      expect(wrapper.find('.alert').exists()).toBe(true)
      expect(wrapper.text().trim()).toBe('')
    })
  })
})
