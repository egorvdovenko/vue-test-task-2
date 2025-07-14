import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppButton from '../AppButton.vue'

describe('AppButton', () => {
  describe('default behavior', () => {
    it('should render with default props', () => {
      const wrapper = mount(AppButton, {
        slots: {
          default: 'Test Button',
        },
      })

      expect(wrapper.text()).toBe('Test Button')
      expect(wrapper.classes()).toContain('button')
      expect(wrapper.classes()).toContain('button--primary')
      expect(wrapper.classes()).toContain('button--md')
      expect(wrapper.attributes('type')).toBe('button')
    })

    it('should render as button element by default', () => {
      const wrapper = mount(AppButton)
      expect(wrapper.element.tagName).toBe('BUTTON')
    })
  })

  describe('variant prop', () => {
    it('should apply correct CSS class for each variant', () => {
      const variants = ['primary', 'secondary', 'success'] as const

      variants.forEach((variant) => {
        const wrapper = mount(AppButton, {
          props: { variant },
        })

        expect(wrapper.classes()).toContain(`button--${variant}`)
      })
    })
  })

  describe('size prop', () => {
    it('should apply correct CSS class for each size', () => {
      const sizes = ['sm', 'md', 'lg'] as const

      sizes.forEach((size) => {
        const wrapper = mount(AppButton, {
          props: { size },
        })

        expect(wrapper.classes()).toContain(`button--${size}`)
      })
    })
  })

  describe('disabled state', () => {
    it('should set disabled attribute when disabled', () => {
      const wrapper = mount(AppButton, {
        props: { disabled: true },
      })

      expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('should not emit click event when disabled', async () => {
      const wrapper = mount(AppButton, {
        props: { disabled: true },
      })

      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeUndefined()
    })
  })

  describe('loading state', () => {
    it('should show spinner when loading', () => {
      const wrapper = mount(AppButton, {
        props: { loading: true },
      })

      expect(wrapper.find('.button__spinner').exists()).toBe(true)
      expect(wrapper.find('.button__spinner-icon').exists()).toBe(true)
      expect(wrapper.classes()).toContain('button--loading')
    })

    it('should set disabled attribute when loading', () => {
      const wrapper = mount(AppButton, {
        props: { loading: true },
      })

      expect(wrapper.attributes('disabled')).toBeDefined()
    })

    it('should not emit click event when loading', async () => {
      const wrapper = mount(AppButton, {
        props: { loading: true },
      })

      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toBeUndefined()
    })
  })

  describe('link behavior', () => {
    it('should render as anchor element when href is provided', () => {
      const wrapper = mount(AppButton, {
        props: { href: 'https://example.com' },
      })

      expect(wrapper.element.tagName).toBe('A')
      expect(wrapper.attributes('href')).toBe('https://example.com')
      expect(wrapper.attributes('type')).toBeUndefined()
    })

    it('should set target attribute when provided', () => {
      const wrapper = mount(AppButton, {
        props: {
          href: 'https://example.com',
          target: '_blank',
        },
      })

      expect(wrapper.attributes('target')).toBe('_blank')
    })
  })

  describe('type prop', () => {
    it('should set correct type attribute', () => {
      const types = ['button', 'submit', 'reset'] as const

      types.forEach((type) => {
        const wrapper = mount(AppButton, {
          props: { type },
        })

        expect(wrapper.attributes('type')).toBe(type)
      })
    })
  })

  describe('click events', () => {
    it('should emit click event when clicked', async () => {
      const wrapper = mount(AppButton)

      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toHaveLength(1)
      expect(wrapper.emitted('click')?.[0][0]).toBeInstanceOf(MouseEvent)
    })

    it('should emit click event when not disabled or loading', async () => {
      const wrapper = mount(AppButton, {
        props: { disabled: false, loading: false },
      })

      await wrapper.trigger('click')
      expect(wrapper.emitted('click')).toHaveLength(1)
    })
  })

  describe('slot content', () => {
    it('should render slot content', () => {
      const wrapper = mount(AppButton, {
        slots: {
          default: '<span>Custom Content</span>',
        },
      })

      expect(wrapper.html()).toContain('<span>Custom Content</span>')
    })

    it('should render slot content alongside spinner when loading', () => {
      const wrapper = mount(AppButton, {
        props: { loading: true },
        slots: {
          default: 'Loading Button',
        },
      })

      expect(wrapper.text()).toContain('Loading Button')
      expect(wrapper.find('.button__spinner').exists()).toBe(true)
    })
  })
})
