<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Props {
  modelValue: string | number
  label?: string
  placeholder?: string
  type?: string
  error?: string
  disabled?: boolean
  required?: boolean
  readonly?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'blur'): void
  (e: 'focus'): void
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false,
  readonly: false,
})

const emit = defineEmits<Emits>()

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = () => emit('blur')
const handleFocus = () => emit('focus')

const inputId = computed(() => `input-${crypto.randomUUID()}`)
</script>

<template>
  <div class="form-group">
    <label v-if="label" :for="inputId" class="form-group__label">
      {{ label }}
      <span v-if="required" class="form-group__required">*</span>
    </label>
    <div v-if="readonly" class="form-group__value">
      <slot name="readonly" :value="modelValue">
        {{ modelValue || t('common.noData') }}
      </slot>
    </div>
    <input
      v-else
      :id="inputId"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      class="form-group__input"
      :class="{ 'form-group__input--error': error }"
      @input="updateValue"
      @blur="handleBlur"
      @focus="handleFocus"
    />
    <div v-if="error" class="form-group__error">
      {{ error }}
    </div>
  </div>
</template>
