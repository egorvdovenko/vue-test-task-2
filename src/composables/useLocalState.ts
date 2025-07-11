import { ref, watch, type Ref } from 'vue'

export function useLocalState<T>(
  sourceData: Ref<T | null | undefined>,
  isEditMode: Ref<boolean>,
  initialValue: T,
) {
  const localData = ref<T>(initialValue)

  watch(
    sourceData,
    (newData) => {
      if (newData) {
        localData.value = typeof newData === 'object' ? { ...newData } : newData
      }
    },
    { immediate: true },
  )

  watch(isEditMode, (isEdit) => {
    if (isEdit && sourceData.value) {
      localData.value =
        typeof sourceData.value === 'object' ? { ...sourceData.value } : sourceData.value
    }
  })

  return localData
}
