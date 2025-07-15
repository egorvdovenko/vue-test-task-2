import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppRating from '../AppRating.vue'

describe('AppRating', () => {
  describe('default behavior', () => {
    it('should render with default props', () => {
      const wrapper = mount(AppRating, {
        props: { modelValue: 3 },
      })

      expect(wrapper.classes()).toContain('rating')
      expect(wrapper.find('.rating__value').text()).toBe('3')
      expect(wrapper.findAll('.rating__star')).toHaveLength(5) // default max
    })

    it('should show rating value by default', () => {
      const wrapper = mount(AppRating, {
        props: { modelValue: 4.5 },
      })

      expect(wrapper.find('.rating__value').exists()).toBe(true)
      expect(wrapper.find('.rating__value').text()).toBe('4.5')
    })

    it('should not be readonly by default', () => {
      const wrapper = mount(AppRating, {
        props: { modelValue: 3 },
      })

      expect(wrapper.classes()).not.toContain('rating--readonly')
      const stars = wrapper.findAll('.rating__star')
      stars.forEach((star) => {
        expect(star.classes()).toContain('rating__star--interactive')
      })
    })

    it('should use medium size by default', () => {
      const wrapper = mount(AppRating, {
        props: { modelValue: 3 },
      })

      const star = wrapper.find('.rating__star')
      expect(star.attributes('style')).toContain('width: 16px')
      expect(star.attributes('style')).toContain('height: 16px')
    })
  })

  describe('modelValue display', () => {
    it('should display zero when modelValue is 0', () => {
      const wrapper = mount(AppRating, {
        props: { modelValue: 0 },
      })

      expect(wrapper.find('.rating__value').text()).toBe('0')
    })

    it('should display zero when modelValue is undefined/null', () => {
      const wrapper = mount(AppRating, {
        props: { modelValue: 0 }, // Test with 0 instead of null
      })

      expect(wrapper.find('.rating__value').text()).toBe('0')
    })

    it('should display decimal values correctly', () => {
      const wrapper = mount(AppRating, {
        props: { modelValue: 3.7 },
      })

      expect(wrapper.find('.rating__value').text()).toBe('3.7')
    })

    it('should handle high values', () => {
      const wrapper = mount(AppRating, {
        props: {
          modelValue: 8,
          max: 10,
        },
      })

      expect(wrapper.find('.rating__value').text()).toBe('8')
    })
  })

  describe('star filling', () => {
    it('should fill stars correctly for whole numbers', () => {
      const wrapper = mount(AppRating, {
        props: { modelValue: 3 },
      })

      const stars = wrapper.findAll('.rating__star')

      // First 3 stars should be filled
      expect(stars[0].classes()).toContain('rating__star--filled')
      expect(stars[1].classes()).toContain('rating__star--filled')
      expect(stars[2].classes()).toContain('rating__star--filled')

      // Last 2 stars should not be filled
      expect(stars[3].classes()).not.toContain('rating__star--filled')
      expect(stars[4].classes()).not.toContain('rating__star--filled')
    })

    it('should round decimal values for star filling', () => {
      const wrapper = mount(AppRating, {
        props: { modelValue: 3.4 },
      })

      const stars = wrapper.findAll('.rating__star')

      // 3.4 rounds to 3, so first 3 stars should be filled
      expect(stars[0].classes()).toContain('rating__star--filled')
      expect(stars[1].classes()).toContain('rating__star--filled')
      expect(stars[2].classes()).toContain('rating__star--filled')
      expect(stars[3].classes()).not.toContain('rating__star--filled')
      expect(stars[4].classes()).not.toContain('rating__star--filled')
    })

    it('should round up decimal values correctly', () => {
      const wrapper = mount(AppRating, {
        props: { modelValue: 3.6 },
      })

      const stars = wrapper.findAll('.rating__star')

      // 3.6 rounds to 4, so first 4 stars should be filled
      expect(stars[0].classes()).toContain('rating__star--filled')
      expect(stars[1].classes()).toContain('rating__star--filled')
      expect(stars[2].classes()).toContain('rating__star--filled')
      expect(stars[3].classes()).toContain('rating__star--filled')
      expect(stars[4].classes()).not.toContain('rating__star--filled')
    })

    it('should handle zero rating', () => {
      const wrapper = mount(AppRating, {
        props: { modelValue: 0 },
      })

      const stars = wrapper.findAll('.rating__star')
      stars.forEach((star) => {
        expect(star.classes()).not.toContain('rating__star--filled')
      })
    })

    it('should handle maximum rating', () => {
      const wrapper = mount(AppRating, {
        props: { modelValue: 5 },
      })

      const stars = wrapper.findAll('.rating__star')
      stars.forEach((star) => {
        expect(star.classes()).toContain('rating__star--filled')
      })
    })
  })

  describe('max prop', () => {
    it('should render correct number of stars based on max', () => {
      const wrapper = mount(AppRating, {
        props: {
          modelValue: 3,
          max: 10,
        },
      })

      expect(wrapper.findAll('.rating__star')).toHaveLength(10)
    })

    it('should handle custom max with rating', () => {
      const wrapper = mount(AppRating, {
        props: {
          modelValue: 7,
          max: 10,
        },
      })

      const stars = wrapper.findAll('.rating__star')
      expect(stars).toHaveLength(10)

      // First 7 stars should be filled
      for (let i = 0; i < 7; i++) {
        expect(stars[i].classes()).toContain('rating__star--filled')
      }

      // Last 3 stars should not be filled
      for (let i = 7; i < 10; i++) {
        expect(stars[i].classes()).not.toContain('rating__star--filled')
      }
    })

    it('should handle max of 1', () => {
      const wrapper = mount(AppRating, {
        props: {
          modelValue: 1,
          max: 1,
        },
      })

      const stars = wrapper.findAll('.rating__star')
      expect(stars).toHaveLength(1)
      expect(stars[0].classes()).toContain('rating__star--filled')
    })
  })

  describe('size prop', () => {
    it('should apply small size correctly', () => {
      const wrapper = mount(AppRating, {
        props: {
          modelValue: 3,
          size: 'sm',
        },
      })

      const star = wrapper.find('.rating__star')
      expect(star.attributes('style')).toContain('width: 14px')
      expect(star.attributes('style')).toContain('height: 14px')
    })

    it('should apply large size correctly', () => {
      const wrapper = mount(AppRating, {
        props: {
          modelValue: 3,
          size: 'lg',
        },
      })

      const star = wrapper.find('.rating__star')
      expect(star.attributes('style')).toContain('width: 20px')
      expect(star.attributes('style')).toContain('height: 20px')
    })

    it('should apply all size variants correctly', () => {
      const sizes = [
        { size: 'sm', expected: 14 },
        { size: 'md', expected: 16 },
        { size: 'lg', expected: 20 },
      ] as const

      sizes.forEach(({ size, expected }) => {
        const wrapper = mount(AppRating, {
          props: {
            modelValue: 3,
            size,
          },
        })

        const star = wrapper.find('.rating__star')
        expect(star.attributes('style')).toContain(`width: ${expected}px`)
        expect(star.attributes('style')).toContain(`height: ${expected}px`)
      })
    })
  })

  describe('showValue prop', () => {
    it('should hide value when showValue is false', () => {
      const wrapper = mount(AppRating, {
        props: {
          modelValue: 3,
          showValue: false,
        },
      })

      expect(wrapper.find('.rating__value').exists()).toBe(false)
    })

    it('should show value when showValue is true', () => {
      const wrapper = mount(AppRating, {
        props: {
          modelValue: 3,
          showValue: true,
        },
      })

      expect(wrapper.find('.rating__value').exists()).toBe(true)
      expect(wrapper.find('.rating__value').text()).toBe('3')
    })
  })

  describe('readonly prop', () => {
    it('should apply readonly class when readonly is true', () => {
      const wrapper = mount(AppRating, {
        props: {
          modelValue: 3,
          readonly: true,
        },
      })

      expect(wrapper.classes()).toContain('rating--readonly')
    })

    it('should not make stars interactive when readonly', () => {
      const wrapper = mount(AppRating, {
        props: {
          modelValue: 3,
          readonly: true,
        },
      })

      const stars = wrapper.findAll('.rating__star')
      stars.forEach((star) => {
        expect(star.classes()).not.toContain('rating__star--interactive')
      })
    })

    it('should make stars interactive when not readonly', () => {
      const wrapper = mount(AppRating, {
        props: {
          modelValue: 3,
          readonly: false,
        },
      })

      const stars = wrapper.findAll('.rating__star')
      stars.forEach((star) => {
        expect(star.classes()).toContain('rating__star--interactive')
      })
    })
  })

  describe('click interaction', () => {
    it('should emit update:modelValue when star is clicked', async () => {
      const wrapper = mount(AppRating, {
        props: {
          modelValue: 2,
          readonly: false,
        },
      })

      const stars = wrapper.findAll('.rating__star')
      await stars[3].trigger('click') // Click 4th star (rating 4)

      expect(wrapper.emitted('update:modelValue')).toHaveLength(1)
      expect(wrapper.emitted('update:modelValue')?.[0][0]).toBe(4)
    })

    it('should not emit update:modelValue when readonly', async () => {
      const wrapper = mount(AppRating, {
        props: {
          modelValue: 2,
          readonly: true,
        },
      })

      const stars = wrapper.findAll('.rating__star')
      await stars[3].trigger('click')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    it('should emit correct rating for each star clicked', async () => {
      const wrapper = mount(AppRating, {
        props: {
          modelValue: 0,
          readonly: false,
        },
      })

      const stars = wrapper.findAll('.rating__star')

      // Click first star
      await stars[0].trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[0][0]).toBe(1)

      // Click third star
      await stars[2].trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[1][0]).toBe(3)

      // Click fifth star
      await stars[4].trigger('click')
      expect(wrapper.emitted('update:modelValue')?.[2][0]).toBe(5)
    })
  })

  describe('combined props', () => {
    it('should handle all props together', () => {
      const wrapper = mount(AppRating, {
        props: {
          modelValue: 7,
          max: 10,
          size: 'lg',
          showValue: true,
          readonly: false,
        },
      })

      expect(wrapper.find('.rating__value').text()).toBe('7')
      expect(wrapper.findAll('.rating__star')).toHaveLength(10)
      expect(wrapper.find('.rating__star').attributes('style')).toContain('width: 20px')
      expect(wrapper.classes()).not.toContain('rating--readonly')

      const filledStars = wrapper.findAll('.rating__star--filled')
      expect(filledStars).toHaveLength(7)
    })

    it('should handle readonly with custom max and size', () => {
      const wrapper = mount(AppRating, {
        props: {
          modelValue: 3,
          max: 7,
          size: 'sm',
          readonly: true,
          showValue: false,
        },
      })

      expect(wrapper.find('.rating__value').exists()).toBe(false)
      expect(wrapper.findAll('.rating__star')).toHaveLength(7)
      expect(wrapper.find('.rating__star').attributes('style')).toContain('width: 14px')
      expect(wrapper.classes()).toContain('rating--readonly')
    })
  })

  describe('edge cases', () => {
    it('should handle rating higher than max', () => {
      const wrapper = mount(AppRating, {
        props: {
          modelValue: 8,
          max: 5,
        },
      })

      // All 5 stars should be filled even though rating is 8
      const stars = wrapper.findAll('.rating__star')
      expect(stars).toHaveLength(5)
      stars.forEach((star) => {
        expect(star.classes()).toContain('rating__star--filled')
      })
    })

    it('should handle negative rating', () => {
      const wrapper = mount(AppRating, {
        props: {
          modelValue: -1,
        },
      })

      const stars = wrapper.findAll('.rating__star')
      stars.forEach((star) => {
        expect(star.classes()).not.toContain('rating__star--filled')
      })
    })

    it('should handle very small decimal values', () => {
      const wrapper = mount(AppRating, {
        props: {
          modelValue: 0.1,
        },
      })

      // 0.1 rounds to 0, so no stars should be filled
      const stars = wrapper.findAll('.rating__star')
      stars.forEach((star) => {
        expect(star.classes()).not.toContain('rating__star--filled')
      })
    })
  })
})
