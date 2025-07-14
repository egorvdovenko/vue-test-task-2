import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppLoader from '../AppLoader.vue'

describe('AppLoader', () => {
  describe('default behavior', () => {
    it('should render with default props', () => {
      const wrapper = mount(AppLoader)

      expect(wrapper.classes()).toContain('loader')
      expect(wrapper.classes()).toContain('loader--md')
      expect(wrapper.find('.loader__spinner').exists()).toBe(true)
    })

    it('should not show message when no message provided', () => {
      const wrapper = mount(AppLoader)

      expect(wrapper.find('.loader__message').exists()).toBe(false)
    })

    it('should have correct default structure', () => {
      const wrapper = mount(AppLoader)

      expect(wrapper.find('.loader').exists()).toBe(true)
      expect(wrapper.find('.loader__spinner').exists()).toBe(true)
    })
  })

  describe('size prop', () => {
    it('should apply small size class', () => {
      const wrapper = mount(AppLoader, {
        props: { size: 'sm' },
      })

      expect(wrapper.classes()).toContain('loader--sm')
      expect(wrapper.classes()).not.toContain('loader--md')
      expect(wrapper.classes()).not.toContain('loader--lg')
    })

    it('should apply medium size class', () => {
      const wrapper = mount(AppLoader, {
        props: { size: 'md' },
      })

      expect(wrapper.classes()).toContain('loader--md')
      expect(wrapper.classes()).not.toContain('loader--sm')
      expect(wrapper.classes()).not.toContain('loader--lg')
    })

    it('should apply large size class', () => {
      const wrapper = mount(AppLoader, {
        props: { size: 'lg' },
      })

      expect(wrapper.classes()).toContain('loader--lg')
      expect(wrapper.classes()).not.toContain('loader--sm')
      expect(wrapper.classes()).not.toContain('loader--md')
    })

    it('should default to medium size when no size provided', () => {
      const wrapper = mount(AppLoader)

      expect(wrapper.classes()).toContain('loader--md')
    })
  })

  describe('message prop', () => {
    it('should show message when provided', () => {
      const wrapper = mount(AppLoader, {
        props: { message: 'Loading data...' },
      })

      const messageElement = wrapper.find('.loader__message')
      expect(messageElement.exists()).toBe(true)
      expect(messageElement.text()).toBe('Loading data...')
    })

    it('should not show message when empty string provided', () => {
      const wrapper = mount(AppLoader, {
        props: { message: '' },
      })

      expect(wrapper.find('.loader__message').exists()).toBe(false)
    })

    it('should show message with different sizes', () => {
      const sizes = ['sm', 'md', 'lg'] as const

      sizes.forEach((size) => {
        const wrapper = mount(AppLoader, {
          props: {
            message: 'Test message',
            size,
          },
        })

        const messageElement = wrapper.find('.loader__message')
        expect(messageElement.exists()).toBe(true)
        expect(messageElement.text()).toBe('Test message')
      })
    })

    it('should handle long messages', () => {
      const longMessage =
        'This is a very long loading message that should still be displayed correctly'
      const wrapper = mount(AppLoader, {
        props: { message: longMessage },
      })

      const messageElement = wrapper.find('.loader__message')
      expect(messageElement.text()).toBe(longMessage)
    })
  })

  describe('spinner', () => {
    it('should always render spinner regardless of props', () => {
      const defaultWrapper = mount(AppLoader)
      expect(defaultWrapper.find('.loader__spinner').exists()).toBe(true)

      const smWrapper = mount(AppLoader, { props: { size: 'sm' } })
      expect(smWrapper.find('.loader__spinner').exists()).toBe(true)

      const lgWrapper = mount(AppLoader, { props: { size: 'lg' } })
      expect(lgWrapper.find('.loader__spinner').exists()).toBe(true)

      const messageWrapper = mount(AppLoader, { props: { message: 'Loading...' } })
      expect(messageWrapper.find('.loader__spinner').exists()).toBe(true)

      const bothWrapper = mount(AppLoader, { props: { size: 'sm', message: 'Loading...' } })
      expect(bothWrapper.find('.loader__spinner').exists()).toBe(true)
    })
  })

  describe('combined props', () => {
    it('should handle small size with message', () => {
      const wrapper = mount(AppLoader, {
        props: {
          size: 'sm',
          message: 'Small loader',
        },
      })

      expect(wrapper.classes()).toContain('loader--sm')
      expect(wrapper.find('.loader__message').text()).toBe('Small loader')
      expect(wrapper.find('.loader__spinner').exists()).toBe(true)
    })

    it('should handle large size with message', () => {
      const wrapper = mount(AppLoader, {
        props: {
          size: 'lg',
          message: 'Large loader',
        },
      })

      expect(wrapper.classes()).toContain('loader--lg')
      expect(wrapper.find('.loader__message').text()).toBe('Large loader')
      expect(wrapper.find('.loader__spinner').exists()).toBe(true)
    })

    it('should handle medium size with message', () => {
      const wrapper = mount(AppLoader, {
        props: {
          size: 'md',
          message: 'Medium loader',
        },
      })

      expect(wrapper.classes()).toContain('loader--md')
      expect(wrapper.find('.loader__message').text()).toBe('Medium loader')
      expect(wrapper.find('.loader__spinner').exists()).toBe(true)
    })
  })

  describe('component structure', () => {
    it('should have correct element hierarchy', () => {
      const wrapper = mount(AppLoader, {
        props: { message: 'Test' },
      })

      const loader = wrapper.find('.loader')
      expect(loader.exists()).toBe(true)

      const spinner = loader.find('.loader__spinner')
      expect(spinner.exists()).toBe(true)

      const message = loader.find('.loader__message')
      expect(message.exists()).toBe(true)
    })

    it('should render only spinner when no message', () => {
      const wrapper = mount(AppLoader)

      const loader = wrapper.find('.loader')
      expect(loader.find('.loader__spinner').exists()).toBe(true)
      expect(loader.find('.loader__message').exists()).toBe(false)
    })
  })

  describe('edge cases', () => {
    it('should handle undefined message', () => {
      const wrapper = mount(AppLoader, {
        props: { message: undefined },
      })

      expect(wrapper.find('.loader__message').exists()).toBe(false)
    })

    it('should handle all possible size values', () => {
      const validSizes = ['sm', 'md', 'lg'] as const

      validSizes.forEach((size) => {
        const wrapper = mount(AppLoader, {
          props: { size },
        })

        expect(wrapper.classes()).toContain(`loader--${size}`)
      })
    })

    it('should render message as paragraph element', () => {
      const wrapper = mount(AppLoader, {
        props: { message: 'Test message' },
      })

      const messageElement = wrapper.find('.loader__message')
      expect(messageElement.element.tagName).toBe('P')
    })

    it('should render spinner as div element', () => {
      const wrapper = mount(AppLoader)

      const spinnerElement = wrapper.find('.loader__spinner')
      expect(spinnerElement.element.tagName).toBe('DIV')
    })
  })

  describe('accessibility', () => {
    it('should have meaningful structure for screen readers', () => {
      const wrapper = mount(AppLoader, {
        props: { message: 'Loading your data' },
      })

      expect(wrapper.find('.loader__spinner').exists()).toBe(true)

      const message = wrapper.find('.loader__message')
      expect(message.exists()).toBe(true)
      expect(message.text()).toBe('Loading your data')
    })
  })
})
