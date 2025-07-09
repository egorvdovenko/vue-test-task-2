import { computed, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'

export interface ValidationRule {
  required?: boolean
  minLength?: number
  email?: boolean
  phone?: boolean
}

export interface FieldValidation {
  error: Ref<string>
  isValid: Ref<boolean>
}

export function useFieldValidation(
  value: Ref<string | number>,
  rules: ValidationRule = {},
  isEditMode: Ref<boolean>,
  customMessages?: {
    required?: string
    minLength?: string
    email?: string
    phone?: string
  },
): FieldValidation {
  const { t } = useI18n()

  const error = computed(() => {
    if (!isEditMode.value) return ''

    const stringValue = String(value.value || '').trim()

    if (rules.required && !stringValue) {
      return customMessages?.required || t('orderForm.validation.fieldRequired')
    }

    if (rules.minLength && stringValue.length < rules.minLength) {
      return (
        customMessages?.minLength || t('orderForm.validation.minLength', { count: rules.minLength })
      )
    }

    if (rules.email && stringValue && !isValidEmail(stringValue)) {
      return customMessages?.email || t('orderForm.validation.invalidEmail')
    }

    if (rules.phone && stringValue && !isValidPhone(stringValue)) {
      return customMessages?.phone || t('orderForm.validation.invalidPhone')
    }

    return ''
  })

  const isValid = computed(() => !error.value)

  return {
    error,
    isValid,
  }
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))
}
