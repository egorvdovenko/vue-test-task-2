import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useOrderStore } from '../order'
import { OrderStatus, type AttachedFile } from '@/types/order'

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
})

// Mock order data
const mockOrderData = {
  id: '1',
  title: 'Test Order',
  description: 'Test Description',
  photo: 'test-photo.jpg',
  attachedFiles: [
    {
      id: 'file1',
      name: 'test.pdf',
      type: 'application/pdf',
      size: 1024,
    },
  ] as AttachedFile[],
  manufacturer: {
    name: 'Test Manufacturer',
    contact: '+1234567890',
    rating: 4.5,
  },
  organization: {
    name: 'Test Organization',
    address: '123 Test St',
    phone: '+0987654321',
    email: 'test@example.com',
  },
  status: OrderStatus.Published,
  createdAt: new Date('2023-01-01'),
  updatedAt: new Date('2023-01-02'),
}

describe('useOrderStore', () => {
  let orderStore: ReturnType<typeof useOrderStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    orderStore = useOrderStore()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('initial state', () => {
    it('should have correct initial state', () => {
      expect(orderStore.isEditMode).toBe(false)
      expect(orderStore.originalOrderData).toBeNull()
      expect(orderStore.editableOrderData).toBeNull()
      expect(orderStore.isLoadingOrder).toBe(false)
      expect(orderStore.hasUnsavedChanges).toBe(false)
    })

    it('should return null for currentOrderData when no data loaded', () => {
      expect(orderStore.currentOrderData).toBeNull()
    })
  })

  describe('loadOrder', () => {
    it('should load order from localStorage when available', async () => {
      const storedData = JSON.stringify(mockOrderData)
      mockLocalStorage.getItem.mockReturnValue(storedData)

      await orderStore.loadOrder()

      expect(mockLocalStorage.getItem).toHaveBeenCalledWith('orderData')
      expect(orderStore.originalOrderData).toEqual({
        ...mockOrderData,
        createdAt: new Date(mockOrderData.createdAt),
        updatedAt: new Date(mockOrderData.updatedAt),
      })
      expect(orderStore.isLoadingOrder).toBe(false)
    })

    it('should set loading state during load operation', async () => {
      mockLocalStorage.getItem.mockReturnValue(null)

      const loadPromise = orderStore.loadOrder()
      expect(orderStore.isLoadingOrder).toBe(true)

      await loadPromise
      expect(orderStore.isLoadingOrder).toBe(false)
    })

    it('should handle localStorage errors gracefully', async () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error')
      })

      await orderStore.loadOrder()

      expect(orderStore.originalOrderData).toBeTruthy()
      expect(orderStore.isLoadingOrder).toBe(false)
    })
  })

  describe('edit mode', () => {
    beforeEach(() => {
      orderStore.originalOrderData = mockOrderData
    })

    it('should start edit mode correctly', () => {
      orderStore.startEdit()

      expect(orderStore.isEditMode).toBe(true)
      expect(orderStore.editableOrderData).toEqual({
        title: mockOrderData.title,
        description: mockOrderData.description,
        photo: mockOrderData.photo,
        attachedFiles: [...mockOrderData.attachedFiles],
        manufacturer: { ...mockOrderData.manufacturer },
        organization: { ...mockOrderData.organization },
        status: mockOrderData.status,
      })
    })

    it('should not start edit mode when no original data', () => {
      orderStore.originalOrderData = null
      orderStore.startEdit()

      expect(orderStore.isEditMode).toBe(false)
      expect(orderStore.editableOrderData).toBeNull()
    })

    it('should cancel edit mode correctly', () => {
      orderStore.startEdit()
      orderStore.cancelEdit()

      expect(orderStore.isEditMode).toBe(false)
      expect(orderStore.editableOrderData).toBeNull()
    })

    it('should return editable data when in edit mode', () => {
      orderStore.startEdit()

      expect(orderStore.currentOrderData).toEqual(orderStore.editableOrderData)
    })

    it('should return original data when not in edit mode', () => {
      expect(orderStore.currentOrderData).toEqual(orderStore.originalOrderData)
    })
  })

  describe('hasUnsavedChanges', () => {
    beforeEach(() => {
      orderStore.originalOrderData = mockOrderData
      orderStore.startEdit()
    })

    it('should return false when no changes made', () => {
      expect(orderStore.hasUnsavedChanges).toBe(false)
    })

    it('should return true when title is changed', () => {
      orderStore.updateField('title', 'Modified Title')
      expect(orderStore.hasUnsavedChanges).toBe(true)
    })

    it('should return true when description is changed', () => {
      orderStore.updateField('description', 'Modified Description')
      expect(orderStore.hasUnsavedChanges).toBe(true)
    })

    it('should return false when not in edit mode', () => {
      orderStore.updateField('title', 'Modified Title')
      orderStore.cancelEdit()
      expect(orderStore.hasUnsavedChanges).toBe(false)
    })
  })

  describe('field updates', () => {
    beforeEach(() => {
      orderStore.originalOrderData = mockOrderData
      orderStore.startEdit()
    })

    it('should update basic fields correctly', () => {
      orderStore.updateField('title', 'New Title')
      orderStore.updateField('description', 'New Description')
      orderStore.updateField('photo', 'new-photo.jpg')

      expect(orderStore.editableOrderData?.title).toBe('New Title')
      expect(orderStore.editableOrderData?.description).toBe('New Description')
      expect(orderStore.editableOrderData?.photo).toBe('new-photo.jpg')
    })

    it('should update manufacturer fields correctly', () => {
      orderStore.updateManufacturer('name', 'New Manufacturer')
      orderStore.updateManufacturer('contact', '+1111111111')
      orderStore.updateManufacturer('rating', 5.0)

      expect(orderStore.editableOrderData?.manufacturer.name).toBe('New Manufacturer')
      expect(orderStore.editableOrderData?.manufacturer.contact).toBe('+1111111111')
      expect(orderStore.editableOrderData?.manufacturer.rating).toBe(5.0)
    })

    it('should update organization fields correctly', () => {
      orderStore.updateOrganization('name', 'New Organization')
      orderStore.updateOrganization('address', '456 New St')
      orderStore.updateOrganization('phone', '+2222222222')
      orderStore.updateOrganization('email', 'new@example.com')

      expect(orderStore.editableOrderData?.organization.name).toBe('New Organization')
      expect(orderStore.editableOrderData?.organization.address).toBe('456 New St')
      expect(orderStore.editableOrderData?.organization.phone).toBe('+2222222222')
      expect(orderStore.editableOrderData?.organization.email).toBe('new@example.com')
    })

    it('should update photo correctly', () => {
      orderStore.updatePhoto('updated-photo.jpg')
      expect(orderStore.editableOrderData?.photo).toBe('updated-photo.jpg')
    })

    it('should update status correctly', () => {
      orderStore.updateStatus(OrderStatus.Completed)
      expect(orderStore.editableOrderData?.status).toBe(OrderStatus.Completed)
    })
  })

  describe('file management', () => {
    beforeEach(() => {
      orderStore.originalOrderData = mockOrderData
      orderStore.startEdit()
    })

    it('should add file correctly', () => {
      const newFile: AttachedFile = {
        id: 'file2',
        name: 'new-file.txt',
        type: 'text/plain',
        size: 512,
      }

      orderStore.addFile(newFile)

      expect(orderStore.editableOrderData?.attachedFiles).toHaveLength(2)
      expect(orderStore.editableOrderData?.attachedFiles.find((f) => f.id === 'file2')).toEqual(
        newFile,
      )
    })

    it('should remove file correctly', () => {
      orderStore.removeFile('file1')

      expect(orderStore.editableOrderData?.attachedFiles).toHaveLength(0)
      expect(
        orderStore.editableOrderData?.attachedFiles.find((f) => f.id === 'file1'),
      ).toBeUndefined()
    })

    it('should not remove non-existent file', () => {
      const initialLength = orderStore.editableOrderData?.attachedFiles.length || 0
      orderStore.removeFile('non-existent')

      expect(orderStore.editableOrderData?.attachedFiles).toHaveLength(initialLength)
    })
  })

  describe('saveChanges', () => {
    beforeEach(() => {
      orderStore.originalOrderData = mockOrderData
      orderStore.startEdit()
    })

    it('should save changes and update original data', () => {
      orderStore.updateField('title', 'Updated Title')
      orderStore.updateField('description', 'Updated Description')

      orderStore.saveChanges()

      expect(orderStore.originalOrderData?.title).toBe('Updated Title')
      expect(orderStore.originalOrderData?.description).toBe('Updated Description')
      expect(orderStore.originalOrderData?.updatedAt).toBeInstanceOf(Date)
      expect(orderStore.isEditMode).toBe(false)
      expect(orderStore.editableOrderData).toBeNull()
    })

    it('should save to localStorage', () => {
      orderStore.updateField('title', 'Updated Title')
      orderStore.saveChanges()

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'orderData',
        JSON.stringify(orderStore.originalOrderData),
      )
    })

    it('should not save when no editable data', () => {
      orderStore.editableOrderData = null
      orderStore.saveChanges()

      expect(mockLocalStorage.setItem).not.toHaveBeenCalled()
    })

    it('should not save when no original data', () => {
      orderStore.originalOrderData = null
      orderStore.saveChanges()

      expect(mockLocalStorage.setItem).not.toHaveBeenCalled()
    })
  })

  describe('edge cases', () => {
    it('should handle field updates when not in edit mode', () => {
      orderStore.updateField('title', 'Should Not Update')
      expect(orderStore.editableOrderData).toBeNull()
    })

    it('should handle manufacturer updates when not in edit mode', () => {
      orderStore.updateManufacturer('name', 'Should Not Update')
      expect(orderStore.editableOrderData).toBeNull()
    })

    it('should handle organization updates when not in edit mode', () => {
      orderStore.updateOrganization('name', 'Should Not Update')
      expect(orderStore.editableOrderData).toBeNull()
    })

    it('should handle file operations when not in edit mode', () => {
      const newFile: AttachedFile = {
        id: 'test',
        name: 'test.txt',
        type: 'text/plain',
        size: 100,
      }

      orderStore.addFile(newFile)
      orderStore.removeFile('test')

      expect(orderStore.editableOrderData).toBeNull()
    })
  })
})
