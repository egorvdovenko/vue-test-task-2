import { describe, it, vi, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppTextarea from '../AppTextarea.vue'

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

describe('AppTextarea', () => {
  describe('default behavior', () => {
    it('should render with required props', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })

      expect(wrapper.classes()).toContain('form-group')
      const textarea = wrapper.find('textarea')
      expect(textarea.exists()).toBe(true)
      expect(textarea.attributes('id')).toBe('textarea-test-uuid-123')
    })

    it('should not render label when not provided', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })

      expect(wrapper.find('label').exists()).toBe(false)
    })

    it('should use default rows value', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.attributes('rows')).toBe('3')
    })
  })

  describe('modelValue', () => {
    it('should display string value correctly', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: 'Test content',
        },
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.element.value).toBe('Test content')
    })

    it('should display numeric value correctly', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: 123,
        },
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.element.value).toBe('123')
    })

    it('should emit update:modelValue on input', async () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })

      const textarea = wrapper.find('textarea')
      await textarea.setValue('New content')

      expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
      expect(wrapper.emitted('update:modelValue')?.[0][0]).toBe('New content')
    })

    it('should handle empty value', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.element.value).toBe('')
    })
  })

  describe('label', () => {
    it('should render label when provided', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          label: 'Description',
        },
      })

      const label = wrapper.find('label')
      expect(label.exists()).toBe(true)
      expect(label.text()).toBe('Description')
      expect(label.attributes('for')).toBe('textarea-test-uuid-123')
    })

    it('should show required indicator when required', () => {
      const wrapper = mount(AppTextarea, {
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
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          label: 'Optional Field',
          required: false,
        },
      })

      expect(wrapper.find('.form-group__required').exists()).toBe(false)
    })
  })

  describe('placeholder', () => {
    it('should set placeholder attribute when provided', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          placeholder: 'Enter your description...',
        },
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.attributes('placeholder')).toBe('Enter your description...')
    })

    it('should not set placeholder when not provided', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.attributes('placeholder')).toBeUndefined()
    })
  })

  describe('rows', () => {
    it('should set custom rows value', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          rows: 5,
        },
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.attributes('rows')).toBe('5')
    })

    it('should handle single row', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          rows: 1,
        },
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.attributes('rows')).toBe('1')
    })
  })

  describe('textarea attributes', () => {
    it('should set disabled attribute when disabled', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          disabled: true,
        },
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.attributes('disabled')).toBeDefined()
    })

    it('should set required attribute when required', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          required: true,
        },
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.attributes('required')).toBeDefined()
    })

    it('should not set disabled attribute when not disabled', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          disabled: false,
        },
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.attributes('disabled')).toBeUndefined()
    })
  })

  describe('readonly mode', () => {
    it('should show readonly value instead of textarea when readonly', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: 'Readonly content',
          readonly: true,
        },
      })

      expect(wrapper.find('textarea').exists()).toBe(false)
      expect(wrapper.find('.form-group__value').exists()).toBe(true)
      expect(wrapper.find('.form-group__value').text()).toBe('Readonly content')
    })

    it('should show "No data" when empty value in readonly', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          readonly: true,
        },
      })

      expect(wrapper.find('.form-group__value').text()).toBe('No data')
    })

    it('should show numeric value in readonly mode', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: 123,
          readonly: true,
        },
      })

      expect(wrapper.find('.form-group__value').text()).toBe('123')
    })

    it('should apply multiline class in readonly mode', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: 'Content',
          readonly: true,
        },
      })

      const valueDiv = wrapper.find('.form-group__value')
      expect(valueDiv.classes()).toContain('form-group__value--multiline')
    })

    it('should render readonly slot when provided', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: 'Test content',
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
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })

      expect(wrapper.find('.form-group__error').exists()).toBe(false)
    })

    it('should show error message when error provided', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          error: 'This field is required',
        },
      })

      const errorDiv = wrapper.find('.form-group__error')
      expect(errorDiv.exists()).toBe(true)
      expect(errorDiv.text()).toBe('This field is required')
    })

    it('should apply error class to textarea when error provided', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          error: 'Error message',
        },
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.classes()).toContain('form-group__input--error')
    })

    it('should not apply error class when no error', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.classes()).not.toContain('form-group__input--error')
    })
  })

  describe('events', () => {
    it('should emit blur event when textarea loses focus', async () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })

      const textarea = wrapper.find('textarea')
      await textarea.trigger('blur')

      expect(wrapper.emitted('blur')).toHaveLength(1)
    })

    it('should emit focus event when textarea gains focus', async () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })

      const textarea = wrapper.find('textarea')
      await textarea.trigger('focus')

      expect(wrapper.emitted('focus')).toHaveLength(1)
    })

    it('should emit update:modelValue with textarea value on input', async () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })

      const textarea = wrapper.find('textarea')
      textarea.element.value = 'Multi-line\ncontent'
      await textarea.trigger('input')

      expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
      expect(wrapper.emitted('update:modelValue')?.[0][0]).toBe('Multi-line\ncontent')
    })
  })

  describe('accessibility', () => {
    it('should associate label with textarea via for/id attributes', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          label: 'Accessible Field',
        },
      })

      const label = wrapper.find('label')
      const textarea = wrapper.find('textarea')

      expect(label.attributes('for')).toBe(textarea.attributes('id'))
      expect(textarea.attributes('id')).toBe('textarea-test-uuid-123')
    })
  })

  describe('CSS classes', () => {
    it('should apply correct CSS classes to textarea', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
        },
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.classes()).toContain('form-group__input')
      expect(textarea.classes()).toContain('form-group__textarea')
    })

    it('should apply error class when error is present', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          error: 'Test error',
        },
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.classes()).toContain('form-group__input--error')
    })
  })

  describe('edge cases', () => {
    it('should handle multiline content', () => {
      const multilineContent = 'Line 1\nLine 2\nLine 3'
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: multilineContent,
        },
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.element.value).toBe(multilineContent)
    })

    it('should handle special characters', () => {
      const specialContent = 'Special & < > " \' characters'
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: specialContent,
        },
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.element.value).toBe(specialContent)
    })

    it('should not render textarea when in readonly mode', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: 'Content',
          readonly: true,
        },
      })

      expect(wrapper.find('textarea').exists()).toBe(false)
      expect(wrapper.find('.form-group__value').exists()).toBe(true)
    })

    it('should handle very large row count', () => {
      const wrapper = mount(AppTextarea, {
        props: {
          modelValue: '',
          rows: 100,
        },
      })

      const textarea = wrapper.find('textarea')
      expect(textarea.attributes('rows')).toBe('100')
    })
  })
})
