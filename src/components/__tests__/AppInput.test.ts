import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppInput from '../AppInput.vue'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => (key === 'common.noData' ? 'No data' : key),
  }),
}))

Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-123',
  },
})

describe('AppInput', () => {
  describe('default behavior', () => {
    it('should render with default props', () => {
      const wrapper = mount(AppInput, {
        props: { modelValue: '' },
      })

      expect(wrapper.classes()).toContain('form-group')
      const input = wrapper.find('input')
      expect(input.exists()).toBe(true)
      expect(input.attributes('type')).toBe('text')
      expect(input.attributes('disabled')).toBeUndefined()
      expect(input.attributes('required')).toBeUndefined()
    })

    it('should generate unique input ID', () => {
      const wrapper = mount(AppInput, {
        props: { modelValue: '' },
      })

      const input = wrapper.find('input')
      expect(input.attributes('id')).toBe('input-test-uuid-123')
    })
  })

  describe('model value', () => {
    it('should display string model value', () => {
      const wrapper = mount(AppInput, {
        props: { modelValue: 'test value' },
      })

      const input = wrapper.find('input')
      expect(input.element.value).toBe('test value')
    })

    it('should display numeric model value', () => {
      const wrapper = mount(AppInput, {
        props: { modelValue: 123 },
      })

      const input = wrapper.find('input')
      expect(input.element.value).toBe('123')
    })

    it('should emit update:modelValue on input change', async () => {
      const wrapper = mount(AppInput, {
        props: { modelValue: '' },
      })

      const input = wrapper.find('input')
      await input.setValue('new value')

      expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
      expect(wrapper.emitted('update:modelValue')?.[0][0]).toBe('new value')
    })
  })

  describe('label', () => {
    it('should not render label when not provided', () => {
      const wrapper = mount(AppInput, {
        props: { modelValue: '' },
      })

      expect(wrapper.find('label').exists()).toBe(false)
    })

    it('should render label when provided', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          label: 'Test Label',
        },
      })

      const label = wrapper.find('label')
      expect(label.exists()).toBe(true)
      expect(label.text()).toBe('Test Label')
      expect(label.attributes('for')).toBe('input-test-uuid-123')
    })

    it('should show required indicator when required', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          label: 'Required Field',
          required: true,
        },
      })

      const requiredSpan = wrapper.find('.form-group__required')
      expect(requiredSpan.exists()).toBe(true)
      expect(requiredSpan.text()).toBe('*')
    })

    it('should not show required indicator when not required', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          label: 'Optional Field',
          required: false,
        },
      })

      expect(wrapper.find('.form-group__required').exists()).toBe(false)
    })
  })

  describe('input attributes', () => {
    it('should set type attribute', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          type: 'email',
        },
      })

      const input = wrapper.find('input')
      expect(input.attributes('type')).toBe('email')
    })

    it('should set placeholder attribute', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          placeholder: 'Enter text here',
        },
      })

      const input = wrapper.find('input')
      expect(input.attributes('placeholder')).toBe('Enter text here')
    })

    it('should set disabled attribute when disabled', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          disabled: true,
        },
      })

      const input = wrapper.find('input')
      expect(input.attributes('disabled')).toBeDefined()
    })

    it('should set required attribute when required', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          required: true,
        },
      })

      const input = wrapper.find('input')
      expect(input.attributes('required')).toBeDefined()
    })
  })

  describe('readonly mode', () => {
    it('should show readonly value instead of input when readonly', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: 'readonly value',
          readonly: true,
        },
      })

      expect(wrapper.find('input').exists()).toBe(false)
      expect(wrapper.find('.form-group__value').exists()).toBe(true)
      expect(wrapper.find('.form-group__value').text()).toBe('readonly value')
    })

    it('should show "No data" when readonly and no value', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          readonly: true,
        },
      })

      expect(wrapper.find('.form-group__value').text()).toBe('No data')
    })

    it('should render readonly slot when provided', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: 'test',
          readonly: true,
        },
        slots: {
          readonly: '<span class="custom-readonly">Custom: {{ value }}</span>',
        },
      })

      expect(wrapper.find('.custom-readonly').exists()).toBe(true)
    })
  })

  describe('error handling', () => {
    it('should not show error when no error provided', () => {
      const wrapper = mount(AppInput, {
        props: { modelValue: '' },
      })

      expect(wrapper.find('.form-group__error').exists()).toBe(false)
    })

    it('should show error message when error provided', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          error: 'This field is required',
        },
      })

      const errorDiv = wrapper.find('.form-group__error')
      expect(errorDiv.exists()).toBe(true)
      expect(errorDiv.text()).toBe('This field is required')
    })

    it('should apply error class to input when error provided', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          error: 'Error message',
        },
      })

      const input = wrapper.find('input')
      expect(input.classes()).toContain('form-group__input--error')
    })

    it('should not apply error class when no error', () => {
      const wrapper = mount(AppInput, {
        props: { modelValue: '' },
      })

      const input = wrapper.find('input')
      expect(input.classes()).not.toContain('form-group__input--error')
    })
  })

  describe('events', () => {
    it('should emit blur event when input loses focus', async () => {
      const wrapper = mount(AppInput, {
        props: { modelValue: '' },
      })

      const input = wrapper.find('input')
      await input.trigger('blur')

      expect(wrapper.emitted('blur')).toHaveLength(1)
    })

    it('should emit focus event when input gains focus', async () => {
      const wrapper = mount(AppInput, {
        props: { modelValue: '' },
      })

      const input = wrapper.find('input')
      await input.trigger('focus')

      expect(wrapper.emitted('focus')).toHaveLength(1)
    })

    it('should emit input event with correct value', async () => {
      const wrapper = mount(AppInput, {
        props: { modelValue: '' },
      })

      const input = wrapper.find('input')
      input.element.value = 'test input'
      await input.trigger('input')

      expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
      expect(wrapper.emitted('update:modelValue')?.[0][0]).toBe('test input')
    })
  })

  describe('input types', () => {
    it('should handle different input types', () => {
      const types = ['text', 'email', 'password', 'number', 'tel', 'url']

      types.forEach((type) => {
        const wrapper = mount(AppInput, {
          props: {
            modelValue: '',
            type,
          },
        })

        const input = wrapper.find('input')
        expect(input.attributes('type')).toBe(type)
      })
    })
  })

  describe('accessibility', () => {
    it('should associate label with input via for/id attributes', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: '',
          label: 'Accessible Field',
        },
      })

      const label = wrapper.find('label')
      const input = wrapper.find('input')

      expect(label.attributes('for')).toBe(input.attributes('id'))
      expect(input.attributes('id')).toBe('input-test-uuid-123')
    })
  })

  describe('edge cases', () => {
    it('should handle empty string model value', () => {
      const wrapper = mount(AppInput, {
        props: { modelValue: '' },
      })

      const input = wrapper.find('input')
      expect(input.element.value).toBe('')
    })

    it('should handle zero numeric model value', () => {
      const wrapper = mount(AppInput, {
        props: { modelValue: 0 },
      })

      const input = wrapper.find('input')
      expect(input.element.value).toBe('0')
    })

    it('should not render input when in readonly mode', () => {
      const wrapper = mount(AppInput, {
        props: {
          modelValue: 'test',
          readonly: true,
        },
      })

      expect(wrapper.find('input').exists()).toBe(false)
      expect(wrapper.find('.form-group__value').exists()).toBe(true)
    })
  })
})
