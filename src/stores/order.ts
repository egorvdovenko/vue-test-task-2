import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { OrderStatus, type OrderData, type OrderFormData, type AttachedFile } from '@/types/order'

export const useOrderStore = defineStore('order', () => {
  const isEditMode = ref(false)
  const originalOrderData = ref<OrderData | null>(null)
  const editableOrderData = ref<OrderFormData | null>(null)

  const mockOrder: OrderData = {
    id: '1',
    title: 'Изготовление металлических деталей',
    description: `Требуется изготовить металлические детали согласно техническому заданию.

Основные требования:
• Материал: сталь 45
• Количество: 100 штук
• Срок изготовления: 2 недели
• Дополнительная обработка: оцинковка

Все детали должны соответствовать ГОСТ стандартам.`,
    photo: 'https://placehold.co/350x300',
    attachedFiles: [
      {
        id: '1',
        name: 'technical-specifications.pdf',
        type: 'application/pdf',
        size: 2048576,
        url: '/files/technical-specifications.pdf',
      },
      {
        id: '2',
        name: 'blueprint.dwg',
        type: 'application/acad',
        size: 1024768,
        url: '/files/blueprint.dwg',
      },
    ],
    manufacturer: {
      name: 'ООО "МеталлПром"',
      contact: '+7 (495) 123-45-67',
      rating: 4.8,
    },
    organization: {
      name: 'ООО "ТехноСтрой"',
      address: 'г. Москва, ул. Промышленная, д. 15',
      phone: '+7 (495) 987-65-43',
      email: 'orders@technostroy.ru',
    },
    status: OrderStatus.Published,
    createdAt: new Date('2025-01-01'),
    updatedAt: new Date('2025-01-05'),
  }

  if (!originalOrderData.value) {
    originalOrderData.value = mockOrder
  }

  const currentOrderData = computed(() => {
    if (isEditMode.value && editableOrderData.value) {
      return editableOrderData.value
    }
    return originalOrderData.value
  })

  const hasUnsavedChanges = computed(() => {
    if (!isEditMode.value || !editableOrderData.value || !originalOrderData.value) {
      return false
    }

    return (
      JSON.stringify(editableOrderData.value) !==
      JSON.stringify({
        title: originalOrderData.value.title,
        description: originalOrderData.value.description,
        photo: originalOrderData.value.photo,
        attachedFiles: originalOrderData.value.attachedFiles,
        manufacturer: originalOrderData.value.manufacturer,
        organization: originalOrderData.value.organization,
        status: originalOrderData.value.status,
      })
    )
  })

  const startEdit = () => {
    if (originalOrderData.value) {
      editableOrderData.value = {
        title: originalOrderData.value.title,
        description: originalOrderData.value.description,
        photo: originalOrderData.value.photo,
        attachedFiles: [...originalOrderData.value.attachedFiles],
        manufacturer: { ...originalOrderData.value.manufacturer },
        organization: { ...originalOrderData.value.organization },
        status: originalOrderData.value.status,
      }
      isEditMode.value = true
    }
  }

  const cancelEdit = () => {
    editableOrderData.value = null
    isEditMode.value = false
  }

  const saveChanges = () => {
    if (editableOrderData.value && originalOrderData.value) {
      originalOrderData.value = {
        ...originalOrderData.value,
        ...editableOrderData.value,
        updatedAt: new Date(),
      }

      localStorage.setItem('orderData', JSON.stringify(originalOrderData.value))

      editableOrderData.value = null
      isEditMode.value = false
    }
  }

  const updateField = <K extends keyof OrderFormData>(field: K, value: OrderFormData[K]) => {
    if (editableOrderData.value) {
      editableOrderData.value[field] = value
    }
  }

  const updateManufacturer = <K extends keyof OrderFormData['manufacturer']>(
    field: K,
    value: OrderFormData['manufacturer'][K],
  ) => {
    if (editableOrderData.value) {
      editableOrderData.value.manufacturer[field] = value
    }
  }

  const updateOrganization = <K extends keyof OrderFormData['organization']>(
    field: K,
    value: OrderFormData['organization'][K],
  ) => {
    if (editableOrderData.value) {
      editableOrderData.value.organization[field] = value
    }
  }

  const addFile = (file: AttachedFile) => {
    if (editableOrderData.value) {
      editableOrderData.value.attachedFiles.push(file)
    }
  }

  const removeFile = (fileId: string) => {
    if (editableOrderData.value) {
      editableOrderData.value.attachedFiles = editableOrderData.value.attachedFiles.filter(
        (f) => f.id !== fileId,
      )
    }
  }

  const updatePhoto = (photoUrl: string) => {
    if (editableOrderData.value) {
      editableOrderData.value.photo = photoUrl
    }
  }

  const updateStatus = (status: OrderStatus) => {
    if (editableOrderData.value) {
      editableOrderData.value.status = status
    }
  }

  const loadFromStorage = () => {
    const stored = localStorage.getItem('orderData')
    if (stored) {
      try {
        const parsedData = JSON.parse(stored)
        originalOrderData.value = {
          ...parsedData,
          createdAt: new Date(parsedData.createdAt),
          updatedAt: new Date(parsedData.updatedAt),
        }
      } catch (error) {
        console.error('Failed to load order data from localStorage:', error)
      }
    }
  }

  loadFromStorage()

  return {
    isEditMode,
    originalOrderData,
    editableOrderData,
    currentOrderData,
    hasUnsavedChanges,
    startEdit,
    cancelEdit,
    saveChanges,
    updateField,
    updateManufacturer,
    updateOrganization,
    addFile,
    removeFile,
    updatePhoto,
    updateStatus,
    loadFromStorage,
  }
})
