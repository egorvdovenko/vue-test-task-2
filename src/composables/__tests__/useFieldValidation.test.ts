import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { useFieldValidation } from '../useFieldValidation'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string, params?: { count?: number }) => {
      const translations: Record<string, string> = {
        'orderForm.validation.fieldRequired': 'Field is required',
        'orderForm.validation.minLength': `Minimum ${params?.count} characters required`,
        'orderForm.validation.invalidEmail': 'Invalid email format',
        'orderForm.validation.invalidPhone': 'Invalid phone format',
      }
      return translations[key] || key
    },
  }),
}))

describe('useFieldValidation', () => {
  describe('required validation', () => {
    it('should show error when required field is empty in edit mode', () => {
      const value = ref('')
      const isEditMode = ref(true)
      const rules = { required: true }

      const validation = useFieldValidation(value, rules, isEditMode)

      expect(validation.error.value).toBe('Field is required')
      expect(validation.isValid.value).toBe(false)
    })

    it('should not show error when not in edit mode', () => {
      const value = ref('')
      const isEditMode = ref(false)
      const rules = { required: true }

      const validation = useFieldValidation(value, rules, isEditMode)

      expect(validation.error.value).toBe('')
      expect(validation.isValid.value).toBe(true)
    })

    it('should not show error when required field has value', () => {
      const value = ref('some value')
      const isEditMode = ref(true)
      const rules = { required: true }

      const validation = useFieldValidation(value, rules, isEditMode)

      expect(validation.error.value).toBe('')
      expect(validation.isValid.value).toBe(true)
    })

    it('should use custom error message when provided', () => {
      const value = ref('')
      const isEditMode = ref(true)
      const rules = { required: true }
      const customMessages = { required: 'Custom required message' }

      const validation = useFieldValidation(value, rules, isEditMode, customMessages)

      expect(validation.error.value).toBe('Custom required message')
    })
  })

  describe('minLength validation', () => {
    it('should show error when value is shorter than minimum length', () => {
      const value = ref('abc')
      const isEditMode = ref(true)
      const rules = { minLength: 5 }

      const validation = useFieldValidation(value, rules, isEditMode)

      expect(validation.error.value).toBe('Minimum 5 characters required')
      expect(validation.isValid.value).toBe(false)
    })

    it('should not show error when value meets minimum length', () => {
      const value = ref('abcdef')
      const isEditMode = ref(true)
      const rules = { minLength: 5 }

      const validation = useFieldValidation(value, rules, isEditMode)

      expect(validation.error.value).toBe('')
      expect(validation.isValid.value).toBe(true)
    })
  })

  describe('email validation', () => {
    it('should validate correct email formats', () => {
      const validEmails = ['user@example.com', 'test.email@domain.co.uk', 'user+tag@example.org']

      validEmails.forEach((email) => {
        const value = ref(email)
        const isEditMode = ref(true)
        const rules = { email: true }

        const validation = useFieldValidation(value, rules, isEditMode)

        expect(validation.error.value).toBe('')
        expect(validation.isValid.value).toBe(true)
      })
    })

    it('should reject invalid email formats', () => {
      const invalidEmails = [
        'invalid-email',
        'user@',
        '@domain.com',
        'user@domain',
        'user.domain.com',
      ]

      invalidEmails.forEach((email) => {
        const value = ref(email)
        const isEditMode = ref(true)
        const rules = { email: true }

        const validation = useFieldValidation(value, rules, isEditMode)

        expect(validation.error.value).toBe('Invalid email format')
        expect(validation.isValid.value).toBe(false)
      })
    })

    it('should not validate empty email field', () => {
      const value = ref('')
      const isEditMode = ref(true)
      const rules = { email: true }

      const validation = useFieldValidation(value, rules, isEditMode)

      expect(validation.error.value).toBe('')
      expect(validation.isValid.value).toBe(true)
    })
  })

  describe('phone validation', () => {
    it('should validate correct phone formats', () => {
      const validPhones = ['+1234567890', '1234567890', '+1 (555) 123-4567', '555-123-4567']

      validPhones.forEach((phone) => {
        const value = ref(phone)
        const isEditMode = ref(true)
        const rules = { phone: true }

        const validation = useFieldValidation(value, rules, isEditMode)

        expect(validation.error.value).toBe('')
        expect(validation.isValid.value).toBe(true)
      })
    })

    it('should reject invalid phone formats', () => {
      const invalidPhones = ['abc123', '+', '0123456789']

      invalidPhones.forEach((phone) => {
        const value = ref(phone)
        const isEditMode = ref(true)
        const rules = { phone: true }

        const validation = useFieldValidation(value, rules, isEditMode)

        expect(validation.error.value).toBe('Invalid phone format')
        expect(validation.isValid.value).toBe(false)
      })
    })
  })

  describe('combined validation', () => {
    it('should prioritize required validation over other rules', () => {
      const value = ref('')
      const isEditMode = ref(true)
      const rules = { required: true, email: true, minLength: 5 }

      const validation = useFieldValidation(value, rules, isEditMode)

      expect(validation.error.value).toBe('Field is required')
    })

    it('should check other rules after required validation passes', () => {
      const value = ref('abc')
      const isEditMode = ref(true)
      const rules = { required: true, minLength: 5 }

      const validation = useFieldValidation(value, rules, isEditMode)

      expect(validation.error.value).toBe('Minimum 5 characters required')
    })
  })
})
