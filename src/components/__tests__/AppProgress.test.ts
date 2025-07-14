import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import AppProgress from '../AppProgress.vue'

describe('AppProgress', () => {
  const mockSteps = [
    { key: 'draft', label: 'Draft' },
    { key: 'published', label: 'Published' },
    { key: 'inProgress', label: 'In Progress' },
    { key: 'completed', label: 'Completed' },
  ]

  const mockStatusOrder = ['draft', 'published', 'inProgress', 'completed']

  describe('default behavior', () => {
    it('should render all steps', () => {
      const wrapper = mount(AppProgress, {
        props: {
          steps: mockSteps,
          currentStatus: 'published',
          statusOrder: mockStatusOrder,
        },
      })

      const steps = wrapper.findAll('.progress__step')
      expect(steps).toHaveLength(4)

      expect(steps[0].find('.progress__label').text()).toBe('Draft')
      expect(steps[1].find('.progress__label').text()).toBe('Published')
      expect(steps[2].find('.progress__label').text()).toBe('In Progress')
      expect(steps[3].find('.progress__label').text()).toBe('Completed')
    })

    it('should have correct component structure', () => {
      const wrapper = mount(AppProgress, {
        props: {
          steps: mockSteps,
          currentStatus: 'draft',
        },
      })

      expect(wrapper.classes()).toContain('progress')
      expect(wrapper.findAll('.progress__step')).toHaveLength(4)
      expect(wrapper.findAll('.progress__circle')).toHaveLength(4)
      expect(wrapper.findAll('.progress__label')).toHaveLength(4)
    })

    it('should render connectors between steps', () => {
      const wrapper = mount(AppProgress, {
        props: {
          steps: mockSteps,
          currentStatus: 'draft',
        },
      })

      const connectors = wrapper.findAll('.progress__connector')
      expect(connectors).toHaveLength(3)
    })
  })

  describe('step states', () => {
    it('should mark current step as active', () => {
      const wrapper = mount(AppProgress, {
        props: {
          steps: mockSteps,
          currentStatus: 'published',
          statusOrder: mockStatusOrder,
        },
      })

      const steps = wrapper.findAll('.progress__step')

      expect(steps[1].classes()).toContain('progress__step--active')

      expect(steps[0].classes()).not.toContain('progress__step--active')
      expect(steps[2].classes()).not.toContain('progress__step--active')
      expect(steps[3].classes()).not.toContain('progress__step--active')
    })

    it('should mark completed steps correctly', () => {
      const wrapper = mount(AppProgress, {
        props: {
          steps: mockSteps,
          currentStatus: 'inProgress',
          statusOrder: mockStatusOrder,
        },
      })

      const steps = wrapper.findAll('.progress__step')

      expect(steps[0].classes()).toContain('progress__step--completed')
      expect(steps[1].classes()).toContain('progress__step--completed')

      expect(steps[2].classes()).toContain('progress__step--active')

      expect(steps[3].classes()).not.toContain('progress__step--completed')
      expect(steps[3].classes()).not.toContain('progress__step--active')
    })

    it('should handle first step as current', () => {
      const wrapper = mount(AppProgress, {
        props: {
          steps: mockSteps,
          currentStatus: 'draft',
          statusOrder: mockStatusOrder,
        },
      })

      const steps = wrapper.findAll('.progress__step')

      expect(steps[0].classes()).toContain('progress__step--active')

      steps.forEach((step) => {
        expect(step.classes()).not.toContain('progress__step--completed')
      })
    })

    it('should handle last step as current', () => {
      const wrapper = mount(AppProgress, {
        props: {
          steps: mockSteps,
          currentStatus: 'completed',
          statusOrder: mockStatusOrder,
        },
      })

      const steps = wrapper.findAll('.progress__step')

      expect(steps[3].classes()).toContain('progress__step--active')

      expect(steps[0].classes()).toContain('progress__step--completed')
      expect(steps[1].classes()).toContain('progress__step--completed')
      expect(steps[2].classes()).toContain('progress__step--completed')
    })
  })

  describe('step content', () => {
    it('should show step numbers for uncompleted steps', () => {
      const wrapper = mount(AppProgress, {
        props: {
          steps: mockSteps,
          currentStatus: 'published',
          statusOrder: mockStatusOrder,
        },
      })

      const circles = wrapper.findAll('.progress__circle')

      expect(circles[0].text()).toBe('✓')

      expect(circles[1].text()).toBe('2')

      expect(circles[2].text()).toBe('3')
      expect(circles[3].text()).toBe('4')
    })

    it('should show checkmarks for completed steps', () => {
      const wrapper = mount(AppProgress, {
        props: {
          steps: mockSteps,
          currentStatus: 'completed',
          statusOrder: mockStatusOrder,
        },
      })

      const circles = wrapper.findAll('.progress__circle')

      expect(circles[0].text()).toBe('✓')
      expect(circles[1].text()).toBe('✓')
      expect(circles[2].text()).toBe('✓')

      expect(circles[3].text()).toBe('4')
    })
  })

  describe('connectors', () => {
    it('should mark connectors as completed for completed step transitions', () => {
      const wrapper = mount(AppProgress, {
        props: {
          steps: mockSteps,
          currentStatus: 'inProgress',
          statusOrder: mockStatusOrder,
        },
      })

      const connectors = wrapper.findAll('.progress__connector')

      expect(connectors[0].classes()).toContain('progress__connector--completed')

      expect(connectors[1].classes()).not.toContain('progress__connector--completed')

      expect(connectors[2].classes()).not.toContain('progress__connector--completed')
    })

    it('should not mark any connectors as completed when on first step', () => {
      const wrapper = mount(AppProgress, {
        props: {
          steps: mockSteps,
          currentStatus: 'draft',
          statusOrder: mockStatusOrder,
        },
      })

      const connectors = wrapper.findAll('.progress__connector')

      connectors.forEach((connector) => {
        expect(connector.classes()).not.toContain('progress__connector--completed')
      })
    })

    it('should mark connectors correctly when on last step', () => {
      const wrapper = mount(AppProgress, {
        props: {
          steps: mockSteps,
          currentStatus: 'completed',
          statusOrder: mockStatusOrder,
        },
      })

      const connectors = wrapper.findAll('.progress__connector')

      expect(connectors[0].classes()).toContain('progress__connector--completed')
      expect(connectors[1].classes()).toContain('progress__connector--completed')
      expect(connectors[2].classes()).not.toContain('progress__connector--completed')
    })
  })

  describe('edge cases', () => {
    it('should handle single step', () => {
      const singleStep = [{ key: 'only', label: 'Only Step' }]
      const wrapper = mount(AppProgress, {
        props: {
          steps: singleStep,
          currentStatus: 'only',
          statusOrder: ['only'],
        },
      })

      expect(wrapper.findAll('.progress__step')).toHaveLength(1)
      expect(wrapper.findAll('.progress__connector')).toHaveLength(0)
      expect(wrapper.find('.progress__step').classes()).toContain('progress__step--active')
    })

    it('should handle two steps', () => {
      const twoSteps = [
        { key: 'first', label: 'First' },
        { key: 'second', label: 'Second' },
      ]
      const wrapper = mount(AppProgress, {
        props: {
          steps: twoSteps,
          currentStatus: 'second',
          statusOrder: ['first', 'second'],
        },
      })

      expect(wrapper.findAll('.progress__step')).toHaveLength(2)
      expect(wrapper.findAll('.progress__connector')).toHaveLength(1)

      const steps = wrapper.findAll('.progress__step')
      expect(steps[0].classes()).toContain('progress__step--completed')
      expect(steps[1].classes()).toContain('progress__step--active')
    })

    it('should handle empty statusOrder', () => {
      const wrapper = mount(AppProgress, {
        props: {
          steps: mockSteps,
          currentStatus: 'published',
        },
      })

      expect(wrapper.findAll('.progress__step')).toHaveLength(4)

      const steps = wrapper.findAll('.progress__step')
      steps.forEach((step) => {
        expect(step.classes()).not.toContain('progress__step--completed')
      })
    })

    it('should handle unknown current status', () => {
      const wrapper = mount(AppProgress, {
        props: {
          steps: mockSteps,
          currentStatus: 'unknown',
          statusOrder: mockStatusOrder,
        },
      })

      expect(wrapper.findAll('.progress__step')).toHaveLength(4)

      const steps = wrapper.findAll('.progress__step')
      steps.forEach((step) => {
        expect(step.classes()).not.toContain('progress__step--active')
      })
    })
  })

  describe('step completion logic', () => {
    it('should correctly identify completed steps based on status order', () => {
      const wrapper = mount(AppProgress, {
        props: {
          steps: mockSteps,
          currentStatus: 'inProgress',
          statusOrder: mockStatusOrder,
        },
      })

      const steps = wrapper.findAll('.progress__step')

      expect(steps[0].classes()).toContain('progress__step--completed')
      expect(steps[1].classes()).toContain('progress__step--completed')

      expect(steps[2].classes()).toContain('progress__step--active')

      expect(steps[3].classes()).not.toContain('progress__step--completed')
      expect(steps[3].classes()).not.toContain('progress__step--active')
    })
  })

  describe('dynamic step count', () => {
    it('should handle different numbers of steps', () => {
      const manySteps = [
        { key: 'step1', label: 'Step 1' },
        { key: 'step2', label: 'Step 2' },
        { key: 'step3', label: 'Step 3' },
        { key: 'step4', label: 'Step 4' },
        { key: 'step5', label: 'Step 5' },
      ]

      const wrapper = mount(AppProgress, {
        props: {
          steps: manySteps,
          currentStatus: 'step3',
          statusOrder: ['step1', 'step2', 'step3', 'step4', 'step5'],
        },
      })

      expect(wrapper.findAll('.progress__step')).toHaveLength(5)
      expect(wrapper.findAll('.progress__connector')).toHaveLength(4)

      const circles = wrapper.findAll('.progress__circle')
      expect(circles[0].text()).toBe('✓')
      expect(circles[1].text()).toBe('✓')
      expect(circles[2].text()).toBe('3')
      expect(circles[3].text()).toBe('4')
      expect(circles[4].text()).toBe('5')
    })
  })
})
