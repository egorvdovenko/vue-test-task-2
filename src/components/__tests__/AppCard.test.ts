import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppCard from '../AppCard.vue'

describe('AppCard', () => {
  describe('default behavior', () => {
    it('should render with default props', () => {
      const wrapper = mount(AppCard, {
        slots: {
          default: 'Card content',
        },
      })

      expect(wrapper.text()).toBe('Card content')
      expect(wrapper.classes()).toContain('card')
      expect(wrapper.classes()).not.toContain('card--no-shadow')
      expect(wrapper.classes()).not.toContain('card--no-padding')
    })

    it('should render content in card__content wrapper', () => {
      const wrapper = mount(AppCard, {
        slots: {
          default: 'Test content',
        },
      })

      const contentElement = wrapper.find('.card__content')
      expect(contentElement.exists()).toBe(true)
      expect(contentElement.text()).toBe('Test content')
    })
  })

  describe('shadow prop', () => {
    it('should not apply no-shadow class when shadow is true', () => {
      const wrapper = mount(AppCard, {
        props: { shadow: true },
      })

      expect(wrapper.classes()).not.toContain('card--no-shadow')
    })

    it('should apply no-shadow class when shadow is false', () => {
      const wrapper = mount(AppCard, {
        props: { shadow: false },
      })

      expect(wrapper.classes()).toContain('card--no-shadow')
    })
  })

  describe('padding prop', () => {
    it('should not apply no-padding class when padding is true', () => {
      const wrapper = mount(AppCard, {
        props: { padding: true },
      })

      expect(wrapper.classes()).not.toContain('card--no-padding')
    })

    it('should apply no-padding class when padding is false', () => {
      const wrapper = mount(AppCard, {
        props: { padding: false },
      })

      expect(wrapper.classes()).toContain('card--no-padding')
    })
  })

  describe('header slot', () => {
    it('should not render header when header slot is empty', () => {
      const wrapper = mount(AppCard, {
        slots: {
          default: 'Content',
        },
      })

      expect(wrapper.find('.card__header').exists()).toBe(false)
    })

    it('should render header when header slot is provided', () => {
      const wrapper = mount(AppCard, {
        slots: {
          header: 'Card Header',
          default: 'Card Content',
        },
      })

      const headerElement = wrapper.find('.card__header')
      expect(headerElement.exists()).toBe(true)
      expect(headerElement.text()).toBe('Card Header')
    })
  })

  describe('footer slot', () => {
    it('should not render footer when footer slot is empty', () => {
      const wrapper = mount(AppCard, {
        slots: {
          default: 'Content',
        },
      })

      expect(wrapper.find('.card__footer').exists()).toBe(false)
    })

    it('should render footer when footer slot is provided', () => {
      const wrapper = mount(AppCard, {
        slots: {
          default: 'Card Content',
          footer: 'Card Footer',
        },
      })

      const footerElement = wrapper.find('.card__footer')
      expect(footerElement.exists()).toBe(true)
      expect(footerElement.text()).toBe('Card Footer')
    })
  })

  describe('multiple slots', () => {
    it('should render all slots when provided', () => {
      const wrapper = mount(AppCard, {
        slots: {
          header: 'Header Content',
          default: 'Main Content',
          footer: 'Footer Content',
        },
      })

      expect(wrapper.find('.card__header').text()).toBe('Header Content')
      expect(wrapper.find('.card__content').text()).toBe('Main Content')
      expect(wrapper.find('.card__footer').text()).toBe('Footer Content')
    })

    it('should maintain proper structure with all elements', () => {
      const wrapper = mount(AppCard, {
        slots: {
          header: 'Header',
          default: 'Content',
          footer: 'Footer',
        },
      })

      const cardElement = wrapper.find('.card')
      const children = cardElement.element.children

      expect(children[0].classList.contains('card__header')).toBe(true)
      expect(children[1].classList.contains('card__content')).toBe(true)
      expect(children[2].classList.contains('card__footer')).toBe(true)
    })
  })

  describe('combined props', () => {
    it('should apply both no-shadow and no-padding classes when both props are false', () => {
      const wrapper = mount(AppCard, {
        props: {
          shadow: false,
          padding: false,
        },
      })

      expect(wrapper.classes()).toContain('card--no-shadow')
      expect(wrapper.classes()).toContain('card--no-padding')
    })
  })
})
