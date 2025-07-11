import { describe, it, expect } from 'vitest'
import { ref, nextTick } from 'vue'
import { useLocalState } from '../useLocalState'

describe('useLocalState', () => {
  it('should initialize with initial value when source data is null', () => {
    const sourceData = ref(null)
    const isEditMode = ref(false)
    const initialValue = { title: 'initial', description: 'test' }

    const localData = useLocalState(sourceData, isEditMode, initialValue)

    expect(localData.value).toEqual(initialValue)
  })

  it('should sync with source data when it changes', async () => {
    const sourceData = ref<{ title: string; description: string } | null>(null)
    const isEditMode = ref(false)
    const initialValue = { title: '', description: '' }

    const localData = useLocalState(sourceData, isEditMode, initialValue)

    sourceData.value = { title: 'New Title', description: 'New Description' }
    await nextTick()

    expect(localData.value).toEqual({
      title: 'New Title',
      description: 'New Description',
    })
  })

  it('should update local data when entering edit mode', async () => {
    const sourceData = ref({ title: 'Source Title', description: 'Source Description' })
    const isEditMode = ref(false)
    const initialValue = { title: '', description: '' }

    const localData = useLocalState(sourceData, isEditMode, initialValue)

    isEditMode.value = true
    await nextTick()

    expect(localData.value).toEqual({
      title: 'Source Title',
      description: 'Source Description',
    })
  })

  it('should work with primitive values', async () => {
    const sourceData = ref<string | null>('initial')
    const isEditMode = ref(false)
    const initialValue = ''

    const localData = useLocalState(sourceData, isEditMode, initialValue)

    expect(localData.value).toBe('initial')

    sourceData.value = 'updated'
    await nextTick()

    expect(localData.value).toBe('updated')
  })

  it('should create deep copy of objects to prevent mutations', async () => {
    const originalData = { title: 'Original', description: 'Test' }
    const sourceData = ref(originalData)
    const isEditMode = ref(false)
    const initialValue = { title: '', description: '' }

    const localData = useLocalState(sourceData, isEditMode, initialValue)

    localData.value.title = 'Modified'

    expect(originalData.title).toBe('Original')
    expect(sourceData.value.title).toBe('Original')
  })
})
