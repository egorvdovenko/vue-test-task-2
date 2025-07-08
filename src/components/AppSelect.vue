<script setup lang="ts">
import { computed } from 'vue'

interface Option {
  value: string | number
  label: string
  disabled?: boolean
}

interface Props {
  modelValue: string | number
  label?: string
  placeholder?: string
  options: Option[]
  error?: string
  disabled?: boolean
  required?: boolean
  readonly?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
  (e: 'blur'): void
  (e: 'focus'): void
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  required: false,
  readonly: false,
})

const emit = defineEmits<Emits>()

const updateValue = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const value = target.value
  emit('update:modelValue', value)
  emit('change', value)
}

const handleBlur = () => emit('blur')
const handleFocus = () => emit('focus')

const selectId = computed(() => `select-${crypto.randomUUID()}`)

const selectedOption = computed(() => {
  return props.options.find((option) => String(option.value) === String(props.modelValue))
})
</script>

<template>
  <div class="form-group">
    <label v-if="props.label" :for="selectId" class="form-group__label">
      {{ props.label }}
      <span v-if="props.required" class="form-group__required">*</span>
    </label>
    <div v-if="props.readonly" class="form-group__value">
      <slot name="readonly" :value="props.modelValue" :selected-option="selectedOption">
        {{ selectedOption?.label || props.modelValue || '-' }}
      </slot>
    </div>
    <select
      v-else
      :id="selectId"
      :value="props.modelValue"
      :disabled="props.disabled"
      :required="props.required"
      class="form-group__input form-group__select"
      :class="{ 'form-group__input--error': props.error }"
      @change="updateValue"
      @blur="handleBlur"
      @focus="handleFocus"
    >
      <option v-if="props.placeholder" value="" disabled>
        {{ props.placeholder }}
      </option>
      <option
        v-for="option in props.options"
        :key="option.value"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.label }}
      </option>
    </select>
    <div v-if="props.error" class="form-group__error">
      {{ props.error }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.form-group__select {
  cursor: pointer;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
  appearance: none;

  &:disabled {
    cursor: not-allowed;
  }
}
</style>
