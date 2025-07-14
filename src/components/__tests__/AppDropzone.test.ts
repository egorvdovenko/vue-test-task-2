import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppDropzone from '../AppDropzone.vue'

// Mock vue-i18n
vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => (key === 'common.dropZone' ? 'Drop files here' : key),
  }),
}))

describe('AppDropzone', () => {
  describe('default behavior', () => {
    it('should render with default props', () => {
      const wrapper = mount(AppDropzone)

      expect(wrapper.classes()).toContain('drop-zone')
      expect(wrapper.classes()).not.toContain('drop-zone--active')
      expect(wrapper.classes()).not.toContain('drop-zone--disabled')
      expect(wrapper.text()).toBe('Drop files here')
    })

    it('should render file input with correct attributes', () => {
      const wrapper = mount(AppDropzone)

      const input = wrapper.find('input[type="file"]')
      expect(input.exists()).toBe(true)
      expect(input.attributes('accept')).toBe('*/*')
      expect(input.attributes('multiple')).toBeUndefined()
      expect(input.attributes('disabled')).toBeUndefined()
    })
  })

  describe('accept prop', () => {
    it('should set accept attribute on file input', () => {
      const wrapper = mount(AppDropzone, {
        props: { accept: 'image/*' },
      })

      const input = wrapper.find('input[type="file"]')
      expect(input.attributes('accept')).toBe('image/*')
    })
  })

  describe('multiple prop', () => {
    it('should set multiple attribute when multiple is true', () => {
      const wrapper = mount(AppDropzone, {
        props: { multiple: true },
      })

      const input = wrapper.find('input[type="file"]')
      expect(input.attributes('multiple')).toBeDefined()
    })

    it('should not set multiple attribute when multiple is false', () => {
      const wrapper = mount(AppDropzone, {
        props: { multiple: false },
      })

      const input = wrapper.find('input[type="file"]')
      expect(input.attributes('multiple')).toBeUndefined()
    })
  })

  describe('text prop', () => {
    it('should display custom text when provided', () => {
      const wrapper = mount(AppDropzone, {
        props: { text: 'Custom drop text' },
      })

      expect(wrapper.text()).toBe('Custom drop text')
    })

    it('should use i18n text when no custom text provided', () => {
      const wrapper = mount(AppDropzone)

      expect(wrapper.text()).toBe('Drop files here')
    })
  })

  describe('disabled state', () => {
    it('should apply disabled class when disabled', () => {
      const wrapper = mount(AppDropzone, {
        props: { disabled: true },
      })

      expect(wrapper.classes()).toContain('drop-zone--disabled')
    })

    it('should set disabled attribute on input when disabled', () => {
      const wrapper = mount(AppDropzone, {
        props: { disabled: true },
      })

      const input = wrapper.find('input[type="file"]')
      expect(input.attributes('disabled')).toBeDefined()
    })
  })

  describe('file selection', () => {
    it('should emit files-selected event when files are selected via input', async () => {
      const wrapper = mount(AppDropzone)
      const input = wrapper.find('input[type="file"]')

      // Mock file selection
      const mockFiles = [new File(['content'], 'test.txt', { type: 'text/plain' })]
      Object.defineProperty(input.element, 'files', {
        value: mockFiles,
        writable: false,
      })

      await input.trigger('change')

      expect(wrapper.emitted('files-selected')).toHaveLength(1)
      expect(wrapper.emitted('files-selected')?.[0][0]).toEqual(mockFiles)
    })

    it('should not emit files-selected when no files selected', async () => {
      const wrapper = mount(AppDropzone)
      const input = wrapper.find('input[type="file"]')

      Object.defineProperty(input.element, 'files', {
        value: [],
        writable: false,
      })

      await input.trigger('change')

      expect(wrapper.emitted('files-selected')).toBeUndefined()
    })

    it('should clear input value after file selection', async () => {
      const wrapper = mount(AppDropzone)
      const input = wrapper.find('input[type="file"]')

      const mockFiles = [new File(['content'], 'test.txt')]
      Object.defineProperty(input.element, 'files', {
        value: mockFiles,
        writable: false,
      })

      await input.trigger('change')

      expect((input.element as HTMLInputElement).value).toBe('')
    })
  })

  describe('click behavior', () => {
    it('should trigger file input when dropzone is clicked', async () => {
      const wrapper = mount(AppDropzone)
      const input = wrapper.find('input[type="file"]')
      const clickSpy = vi.spyOn(input.element as HTMLInputElement, 'click')

      await wrapper.trigger('click')

      expect(clickSpy).toHaveBeenCalled()
    })

    it('should not trigger file input when disabled and clicked', async () => {
      const wrapper = mount(AppDropzone, {
        props: { disabled: true },
      })
      const input = wrapper.find('input[type="file"]')
      const clickSpy = vi.spyOn(input.element as HTMLInputElement, 'click')

      await wrapper.trigger('click')

      expect(clickSpy).not.toHaveBeenCalled()
    })
  })

  describe('drag and drop', () => {
    it('should set active class on dragenter when not disabled', async () => {
      const wrapper = mount(AppDropzone)

      await wrapper.trigger('dragenter')

      expect(wrapper.classes()).toContain('drop-zone--active')
    })

    it('should remove active class on dragleave', async () => {
      const wrapper = mount(AppDropzone)

      await wrapper.trigger('dragenter')
      expect(wrapper.classes()).toContain('drop-zone--active')

      await wrapper.trigger('dragleave')
      expect(wrapper.classes()).not.toContain('drop-zone--active')
    })

    it('should not set active class on dragenter when disabled', async () => {
      const wrapper = mount(AppDropzone, {
        props: { disabled: true },
      })

      await wrapper.trigger('dragenter')

      expect(wrapper.classes()).not.toContain('drop-zone--active')
    })
  })

  describe('slots', () => {
    it('should render custom icon slot', () => {
      const wrapper = mount(AppDropzone, {
        slots: {
          icon: '<div class="custom-icon">Custom Icon</div>',
        },
      })

      expect(wrapper.find('.custom-icon').exists()).toBe(true)
      expect(wrapper.find('.drop-zone__icon').exists()).toBe(false)
    })

    it('should render custom text slot', () => {
      const wrapper = mount(AppDropzone, {
        slots: {
          text: '<div class="custom-text">Custom Text</div>',
        },
      })

      expect(wrapper.find('.custom-text').exists()).toBe(true)
      expect(wrapper.find('.drop-zone__text').exists()).toBe(false)
    })

    it('should render default icon when no icon slot provided', () => {
      const wrapper = mount(AppDropzone)

      expect(wrapper.find('.drop-zone__icon').exists()).toBe(true)
    })

    it('should render default text when no text slot provided', () => {
      const wrapper = mount(AppDropzone)

      expect(wrapper.find('.drop-zone__text').exists()).toBe(true)
    })
  })
})
