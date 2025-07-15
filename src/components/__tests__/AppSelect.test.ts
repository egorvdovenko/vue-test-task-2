import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppSelect from '../AppSelect.vue'

// Mock crypto.randomUUID
Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-123',
  },
})

describe('AppSelect', () => {
  const mockOptions = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3', disabled: true },
    { value: 42, label: 'Number Option' },
  ]

  describe('default behavior', () => {
    it('should render with required props', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: mockOptions,
        },
      })

      expect(wrapper.classes()).toContain('form-group')
      const select = wrapper.find('select')
      expect(select.exists()).toBe(true)
      expect(select.attributes('id')).toBe('select-test-uuid-123')
    })

    it('should render all options correctly', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: mockOptions,
        },
      })

      const options = wrapper.findAll('option')
      // Should have 4 options (no placeholder)
      expect(options).toHaveLength(4)
      expect(options[0].text()).toBe('Option 1')
      expect(options[1].text()).toBe('Option 2')
      expect(options[2].text()).toBe('Option 3')
      expect(options[3].text()).toBe('Number Option')
    })

    it('should set correct option values', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: mockOptions,
        },
      })

      const options = wrapper.findAll('option')
      expect(options[0].attributes('value')).toBe('option1')
      expect(options[1].attributes('value')).toBe('option2')
      expect(options[2].attributes('value')).toBe('option3')
      expect(options[3].attributes('value')).toBe('42')
    })

    it('should not render label when not provided', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: mockOptions,
        },
      })

      expect(wrapper.find('label').exists()).toBe(false)
    })
  })

  describe('modelValue', () => {
    it('should display selected value correctly', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: 'option2',
          options: mockOptions,
        },
      })

      const select = wrapper.find('select')
      expect(select.element.value).toBe('option2')
    })

    it('should handle numeric modelValue', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: 42,
          options: mockOptions,
        },
      })

      const select = wrapper.find('select')
      expect(select.element.value).toBe('42')
    })

    it('should emit update:modelValue on change', async () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: mockOptions,
        },
      })

      const select = wrapper.find('select')
      await select.setValue('option2')

      expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
      expect(wrapper.emitted('update:modelValue')?.[0][0]).toBe('option2')
    })

    it('should emit change event on change', async () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: mockOptions,
        },
      })

      const select = wrapper.find('select')
      await select.setValue('option1')

      expect(wrapper.emitted('change')).toHaveLength(1)
      expect(wrapper.emitted('change')?.[0][0]).toBe('option1')
    })
  })

  describe('label', () => {
    it('should render label when provided', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: mockOptions,
          label: 'Test Label',
        },
      })

      const label = wrapper.find('label')
      expect(label.exists()).toBe(true)
      expect(label.text()).toBe('Test Label')
      expect(label.attributes('for')).toBe('select-test-uuid-123')
    })

    it('should show required indicator when required', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: mockOptions,
          label: 'Required Field',
          required: true,
        },
      })

      const requiredSpan = wrapper.find('.form-group__required')
      expect(requiredSpan.exists()).toBe(true)
      expect(requiredSpan.text()).toBe('*')
    })

    it('should not show required indicator when not required', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: mockOptions,
          label: 'Optional Field',
          required: false,
        },
      })

      expect(wrapper.find('.form-group__required').exists()).toBe(false)
    })
  })

  describe('placeholder', () => {
    it('should render placeholder option when provided', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: mockOptions,
          placeholder: 'Select an option',
        },
      })

      const options = wrapper.findAll('option')
      expect(options).toHaveLength(5) // 4 options + placeholder
      expect(options[0].text()).toBe('Select an option')
      expect(options[0].attributes('value')).toBe('')
      expect(options[0].attributes('disabled')).toBeDefined()
    })

    it('should not render placeholder when not provided', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: mockOptions,
        },
      })

      const options = wrapper.findAll('option')
      expect(options).toHaveLength(4) // Only the actual options
    })
  })

  describe('disabled options', () => {
    it('should mark disabled options correctly', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: mockOptions,
        },
      })

      const options = wrapper.findAll('option')
      expect(options[0].attributes('disabled')).toBeUndefined()
      expect(options[1].attributes('disabled')).toBeUndefined()
      expect(options[2].attributes('disabled')).toBeDefined() // option3 is disabled
      expect(options[3].attributes('disabled')).toBeUndefined()
    })
  })

  describe('select attributes', () => {
    it('should set disabled attribute when disabled', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: mockOptions,
          disabled: true,
        },
      })

      const select = wrapper.find('select')
      expect(select.attributes('disabled')).toBeDefined()
    })

    it('should set required attribute when required', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: mockOptions,
          required: true,
        },
      })

      const select = wrapper.find('select')
      expect(select.attributes('required')).toBeDefined()
    })

    it('should not set disabled attribute when not disabled', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: mockOptions,
          disabled: false,
        },
      })

      const select = wrapper.find('select')
      expect(select.attributes('disabled')).toBeUndefined()
    })
  })

  describe('readonly mode', () => {
    it('should show readonly value instead of select when readonly', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: 'option2',
          options: mockOptions,
          readonly: true,
        },
      })

      expect(wrapper.find('select').exists()).toBe(false)
      expect(wrapper.find('.form-group__value').exists()).toBe(true)
      expect(wrapper.find('.form-group__value').text()).toBe('Option 2')
    })

    it('should show modelValue when no matching option in readonly', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: 'unknown',
          options: mockOptions,
          readonly: true,
        },
      })

      expect(wrapper.find('.form-group__value').text()).toBe('unknown')
    })

    it('should show dash when empty value in readonly', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: mockOptions,
          readonly: true,
        },
      })

      expect(wrapper.find('.form-group__value').text()).toBe('-')
    })

    it('should render readonly slot when provided', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: 'option1',
          options: mockOptions,
          readonly: true,
        },
        slots: {
          readonly: '<span class="custom-readonly">Custom: {{ selectedOption.label }}</span>',
        },
      })

      expect(wrapper.find('.custom-readonly').exists()).toBe(true)
    })
  })

  describe('error handling', () => {
    it('should not show error when no error provided', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: mockOptions,
        },
      })

      expect(wrapper.find('.form-group__error').exists()).toBe(false)
    })

    it('should show error message when error provided', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: mockOptions,
          error: 'This field is required',
        },
      })

      const errorDiv = wrapper.find('.form-group__error')
      expect(errorDiv.exists()).toBe(true)
      expect(errorDiv.text()).toBe('This field is required')
    })

    it('should apply error class to select when error provided', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: mockOptions,
          error: 'Error message',
        },
      })

      const select = wrapper.find('select')
      expect(select.classes()).toContain('form-group__input--error')
    })

    it('should not apply error class when no error', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: mockOptions,
        },
      })

      const select = wrapper.find('select')
      expect(select.classes()).not.toContain('form-group__input--error')
    })
  })

  describe('events', () => {
    it('should emit blur event when select loses focus', async () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: mockOptions,
        },
      })

      const select = wrapper.find('select')
      await select.trigger('blur')

      expect(wrapper.emitted('blur')).toHaveLength(1)
    })

    it('should emit focus event when select gains focus', async () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: mockOptions,
        },
      })

      const select = wrapper.find('select')
      await select.trigger('focus')

      expect(wrapper.emitted('focus')).toHaveLength(1)
    })
  })

  describe('selectedOption computed', () => {
    it('should find selected option correctly', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: 'option2',
          options: mockOptions,
          readonly: true,
        },
      })

      // In readonly mode, it should show the label of the selected option
      expect(wrapper.find('.form-group__value').text()).toBe('Option 2')
    })

    it('should handle numeric value matching', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: 42,
          options: mockOptions,
          readonly: true,
        },
      })

      expect(wrapper.find('.form-group__value').text()).toBe('Number Option')
    })

    it('should handle string-number matching', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '42', // String value
          options: mockOptions,
          readonly: true,
        },
      })

      // Should still match the numeric option due to string conversion
      expect(wrapper.find('.form-group__value').text()).toBe('Number Option')
    })
  })

  describe('accessibility', () => {
    it('should associate label with select via for/id attributes', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: mockOptions,
          label: 'Accessible Field',
        },
      })

      const label = wrapper.find('label')
      const select = wrapper.find('select')

      expect(label.attributes('for')).toBe(select.attributes('id'))
      expect(select.attributes('id')).toBe('select-test-uuid-123')
    })
  })

  describe('edge cases', () => {
    it('should handle empty options array', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: [],
        },
      })

      const options = wrapper.findAll('option')
      expect(options).toHaveLength(0)
    })

    it('should handle options with special characters', () => {
      const specialOptions = [{ value: 'special&<>"', label: 'Special & < > "' }]

      const wrapper = mount(AppSelect, {
        props: {
          modelValue: '',
          options: specialOptions,
        },
      })

      const option = wrapper.find('option')
      expect(option.text()).toBe('Special & < > "')
      expect(option.attributes('value')).toBe('special&<>"')
    })

    it('should not render select when in readonly mode', () => {
      const wrapper = mount(AppSelect, {
        props: {
          modelValue: 'option1',
          options: mockOptions,
          readonly: true,
        },
      })

      expect(wrapper.find('select').exists()).toBe(false)
      expect(wrapper.find('.form-group__value').exists()).toBe(true)
    })
  })
})
