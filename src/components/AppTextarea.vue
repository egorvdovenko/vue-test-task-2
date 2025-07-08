<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string | number
  label?: string
  placeholder?: string
  error?: string
  disabled?: boolean
  required?: boolean
  rows?: number
  readonly?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'blur'): void
  (e: 'focus'): void
}

withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  rows: 3,
  readonly: false,
})

const emit = defineEmits<Emits>()

const updateValue = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}

const handleBlur = () => emit('blur')
const handleFocus = () => emit('focus')

const inputId = computed(() => `textarea-${Math.random().toString(36).substr(2, 9)}`)
</script>

<template>
  <div class="form-group">
    <label v-if="label" :for="inputId" class="form-group__label">
      {{ label }}
      <span v-if="required" class="form-group__required">*</span>
    </label>
    <div v-if="readonly" class="form-group__value form-group__value--multiline">
      <slot name="readonly" :value="modelValue">
        {{ modelValue || '-' }}
      </slot>
    </div>
    <textarea
      v-else
      :id="inputId"
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      :rows="rows"
      class="form-group__input form-group__textarea"
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

<style lang="scss" scoped>
@use '@/assets/styles/components/form-group.scss';

.form-group__textarea {
  min-height: 120px;
  resize: vertical;
  font-family: inherit;
}

.form-group__value--multiline {
  line-height: 1.6;
  white-space: pre-wrap;
}
</style>
