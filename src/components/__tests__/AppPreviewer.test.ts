import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppPreviewer from '../AppPreviewer.vue'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.photoPreview': 'Photo preview',
        'common.remove': 'Remove',
      }
      return translations[key] || key
    },
  }),
}))

describe('AppPreviewer', () => {
  const defaultProps = {
    src: 'https://example.com/image.jpg',
  }

  describe('default behavior', () => {
    it('should render image with required props', () => {
      const wrapper = mount(AppPreviewer, {
        props: defaultProps,
      })

      const image = wrapper.find('.previewer__image')
      expect(image.exists()).toBe(true)
      expect(image.attributes('src')).toBe('https://example.com/image.jpg')
      expect(image.attributes('alt')).toBe('Photo preview')
    })

    it('should have correct component structure', () => {
      const wrapper = mount(AppPreviewer, {
        props: defaultProps,
      })

      expect(wrapper.classes()).toContain('previewer')
      expect(wrapper.find('.previewer__image').exists()).toBe(true)
    })

    it('should not show remove button by default', () => {
      const wrapper = mount(AppPreviewer, {
        props: defaultProps,
      })

      expect(wrapper.find('.previewer__overlay').exists()).toBe(false)
      expect(wrapper.find('.previewer__action').exists()).toBe(false)
    })

    it('should not show zoom overlay by default', () => {
      const wrapper = mount(AppPreviewer, {
        props: defaultProps,
      })

      expect(wrapper.find('.previewer__zoom-overlay').exists()).toBe(false)
    })
  })

  describe('alt text', () => {
    it('should use custom alt text when provided', () => {
      const wrapper = mount(AppPreviewer, {
        props: {
          ...defaultProps,
          alt: 'Custom alt text',
        },
      })

      const image = wrapper.find('.previewer__image')
      expect(image.attributes('alt')).toBe('Custom alt text')
    })

    it('should use default alt text when not provided', () => {
      const wrapper = mount(AppPreviewer, {
        props: defaultProps,
      })

      const image = wrapper.find('.previewer__image')
      expect(image.attributes('alt')).toBe('Photo preview')
    })

    it('should use default alt text when empty string provided', () => {
      const wrapper = mount(AppPreviewer, {
        props: {
          ...defaultProps,
          alt: '',
        },
      })

      const image = wrapper.find('.previewer__image')
      expect(image.attributes('alt')).toBe('Photo preview')
    })
  })

  describe('remove button', () => {
    it('should show remove button when showRemoveButton is true', () => {
      const wrapper = mount(AppPreviewer, {
        props: {
          ...defaultProps,
          showRemoveButton: true,
        },
      })

      expect(wrapper.find('.previewer__overlay').exists()).toBe(true)
      expect(wrapper.find('.previewer__action').exists()).toBe(true)
    })

    it('should emit remove event when remove button is clicked', async () => {
      const wrapper = mount(AppPreviewer, {
        props: {
          ...defaultProps,
          showRemoveButton: true,
        },
      })

      const removeButton = wrapper.find('.previewer__action')
      await removeButton.trigger('click')

      expect(wrapper.emitted('remove')).toHaveLength(1)
    })

    it('should use custom remove button title when provided', () => {
      const wrapper = mount(AppPreviewer, {
        props: {
          ...defaultProps,
          showRemoveButton: true,
          removeButtonTitle: 'Delete image',
        },
      })

      const removeButton = wrapper.find('.previewer__action')
      expect(removeButton.attributes('title')).toBe('Delete image')
    })

    it('should use default remove button title when not provided', () => {
      const wrapper = mount(AppPreviewer, {
        props: {
          ...defaultProps,
          showRemoveButton: true,
        },
      })

      const removeButton = wrapper.find('.previewer__action')
      expect(removeButton.attributes('title')).toBe('Remove')
    })
  })

  describe('zoom functionality', () => {
    it('should show zoom overlay when image is clicked and zoom is enabled', async () => {
      const wrapper = mount(AppPreviewer, {
        props: {
          ...defaultProps,
          enableZoom: true,
        },
      })

      const image = wrapper.find('.previewer__image')
      await image.trigger('click')

      expect(wrapper.find('.previewer__zoom-overlay').exists()).toBe(true)
      expect(wrapper.find('.previewer__zoom-image').exists()).toBe(true)
    })

    it('should not show zoom overlay when zoom is disabled', async () => {
      const wrapper = mount(AppPreviewer, {
        props: {
          ...defaultProps,
          enableZoom: false,
        },
      })

      const image = wrapper.find('.previewer__image')
      await image.trigger('click')

      expect(wrapper.find('.previewer__zoom-overlay').exists()).toBe(false)
    })

    it('should close zoom overlay when overlay is clicked', async () => {
      const wrapper = mount(AppPreviewer, {
        props: {
          ...defaultProps,
          enableZoom: true,
        },
      })

      const image = wrapper.find('.previewer__image')
      await image.trigger('click')
      expect(wrapper.find('.previewer__zoom-overlay').exists()).toBe(true)

      const overlay = wrapper.find('.previewer__zoom-overlay')
      await overlay.trigger('click')
      expect(wrapper.find('.previewer__zoom-overlay').exists()).toBe(false)
    })

    it('should enable zoom by default', async () => {
      const wrapper = mount(AppPreviewer, {
        props: defaultProps,
      })

      const image = wrapper.find('.previewer__image')
      await image.trigger('click')

      expect(wrapper.find('.previewer__zoom-overlay').exists()).toBe(true)
    })

    it('should use same image source and alt in zoom', async () => {
      const wrapper = mount(AppPreviewer, {
        props: {
          ...defaultProps,
          alt: 'Test image',
          enableZoom: true,
        },
      })

      const image = wrapper.find('.previewer__image')
      await image.trigger('click')

      const zoomImage = wrapper.find('.previewer__zoom-image')
      expect(zoomImage.attributes('src')).toBe('https://example.com/image.jpg')
      expect(zoomImage.attributes('alt')).toBe('Test image')
    })
  })

  describe('combined features', () => {
    it('should handle remove button and zoom together', async () => {
      const wrapper = mount(AppPreviewer, {
        props: {
          ...defaultProps,
          showRemoveButton: true,
          enableZoom: true,
        },
      })

      expect(wrapper.find('.previewer__action').exists()).toBe(true)

      const image = wrapper.find('.previewer__image')
      await image.trigger('click')
      expect(wrapper.find('.previewer__zoom-overlay').exists()).toBe(true)

      const removeButton = wrapper.find('.previewer__action')
      await removeButton.trigger('click')
      expect(wrapper.emitted('remove')).toHaveLength(1)
    })

    it('should handle all props together', () => {
      const wrapper = mount(AppPreviewer, {
        props: {
          src: 'test-image.jpg',
          alt: 'Test alt',
          showRemoveButton: true,
          enableZoom: true,
          removeButtonTitle: 'Delete',
        },
      })

      const image = wrapper.find('.previewer__image')
      expect(image.attributes('src')).toBe('test-image.jpg')
      expect(image.attributes('alt')).toBe('Test alt')

      const removeButton = wrapper.find('.previewer__action')
      expect(removeButton.exists()).toBe(true)
      expect(removeButton.attributes('title')).toBe('Delete')
    })
  })

  describe('zoom state management', () => {
    it('should start with zoom closed', () => {
      const wrapper = mount(AppPreviewer, {
        props: defaultProps,
      })

      expect(wrapper.find('.previewer__zoom-overlay').exists()).toBe(false)
    })

    it('should toggle zoom state correctly', async () => {
      const wrapper = mount(AppPreviewer, {
        props: defaultProps,
      })

      expect(wrapper.find('.previewer__zoom-overlay').exists()).toBe(false)

      await wrapper.find('.previewer__image').trigger('click')
      expect(wrapper.find('.previewer__zoom-overlay').exists()).toBe(true)

      await wrapper.find('.previewer__zoom-overlay').trigger('click')
      expect(wrapper.find('.previewer__zoom-overlay').exists()).toBe(false)

      await wrapper.find('.previewer__image').trigger('click')
      expect(wrapper.find('.previewer__zoom-overlay').exists()).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('should handle missing src gracefully', () => {
      const wrapper = mount(AppPreviewer, {
        props: {
          src: '',
        },
      })

      const image = wrapper.find('.previewer__image')
      expect(image.exists()).toBe(true)
      expect(image.attributes('src')).toBe('')
    })

    it('should handle remove button with zoom disabled', async () => {
      const wrapper = mount(AppPreviewer, {
        props: {
          ...defaultProps,
          showRemoveButton: true,
          enableZoom: false,
        },
      })

      const removeButton = wrapper.find('.previewer__action')
      await removeButton.trigger('click')
      expect(wrapper.emitted('remove')).toHaveLength(1)

      const image = wrapper.find('.previewer__image')
      await image.trigger('click')
      expect(wrapper.find('.previewer__zoom-overlay').exists()).toBe(false)
    })
  })
})
