export enum OrderStatus {
  Draft = 'draft',
  Published = 'published',
  InProgress = 'inProgress',
  Completed = 'completed',
}

export interface AttachedFile {
  id: string
  name: string
  type: string
  size: number
  url?: string
}

export interface Manufacturer {
  name: string
  contact: string
  rating: number
}

export interface Organization {
  name: string
  address: string
  phone: string
  email: string
}

export interface OrderData {
  id: string
  title: string
  description: string
  photo?: string
  attachedFiles: AttachedFile[]
  manufacturer: Manufacturer
  organization: Organization
  status: OrderStatus
  createdAt: Date
  updatedAt: Date
}

export type OrderFormData = Omit<OrderData, 'id' | 'createdAt' | 'updatedAt'>
