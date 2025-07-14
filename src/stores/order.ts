import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { OrderStatus, type OrderData, type OrderFormData, type AttachedFile } from '@/types/order'
import orderData from '@/data/order.json'

export const useOrderStore = defineStore('order', () => {
  const isEditMode = ref(false)
  const originalOrderData = ref<OrderData | null>(null)
  const editableOrderData = ref<OrderFormData | null>(null)
  const isLoadingOrder = ref(false)

  async function getOrderData(): Promise<OrderData> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...orderData,
          status: OrderStatus.Published,
          createdAt: new Date(orderData.createdAt),
          updatedAt: new Date(orderData.updatedAt),
        })
      }, 1000)
    })
  }

  async function loadOrder() {
    isLoadingOrder.value = true
    try {
      const stored = localStorage.getItem('orderData')
      if (stored) {
        const parsedData = JSON.parse(stored)
        originalOrderData.value = {
          ...parsedData,
          createdAt: new Date(parsedData.createdAt),
          updatedAt: new Date(parsedData.updatedAt),
        }
      } else {
        originalOrderData.value = await getOrderData()
      }
    } catch (error) {
      console.error('Failed to load order data:', error)
      originalOrderData.value = await getOrderData()
    } finally {
      isLoadingOrder.value = false
    }
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
        attachedFiles: [...originalOrderData.value.attachedFiles],
        manufacturer: { ...originalOrderData.value.manufacturer },
        organization: { ...originalOrderData.value.organization },
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

  return {
    isEditMode,
    originalOrderData,
    editableOrderData,
    currentOrderData,
    hasUnsavedChanges,
    isLoadingOrder,
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
    loadOrder,
  }
})
