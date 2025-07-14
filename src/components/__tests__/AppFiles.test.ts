import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import AppFiles from '../AppFiles.vue'
import type { AttachedFile } from '@/types/order'

vi.mock('vue-i18n', () => ({
  useI18n: () => ({
    t: (key: string) => (key === 'common.remove' ? 'Remove' : key),
  }),
}))

describe('AppFiles', () => {
  const mockFiles: AttachedFile[] = [
    {
      id: '1',
      name: 'document.pdf',
      type: 'application/pdf',
      size: 1024,
    },
    {
      id: '2',
      name: 'image.jpg',
      type: 'image/jpeg',
      size: 2048,
    },
    {
      id: '3',
      name: 'very-long-filename-that-should-be-truncated.txt',
      type: 'text/plain',
      size: 512,
    },
  ]

  describe('default behavior', () => {
    it('should render empty state when no files provided', () => {
      const wrapper = mount(AppFiles, {
        props: { files: [] },
      })

      expect(wrapper.find('.files__item').exists()).toBe(false)
      expect(wrapper.classes()).toContain('files')
    })

    it('should render files list when files provided', () => {
      const wrapper = mount(AppFiles, {
        props: { files: mockFiles },
      })

      const fileItems = wrapper.findAll('.files__item')
      expect(fileItems).toHaveLength(3)
    })

    it('should not show remove buttons when not editable', () => {
      const wrapper = mount(AppFiles, {
        props: {
          files: mockFiles,
          editable: false,
        },
      })

      expect(wrapper.find('.files__item-remove').exists()).toBe(false)
    })
  })

  describe('file display', () => {
    it('should display file names correctly', () => {
      const wrapper = mount(AppFiles, {
        props: { files: mockFiles },
      })

      const fileNames = wrapper.findAll('.files__item-name')
      expect(fileNames[0].text()).toBe('document.pdf')
      expect(fileNames[1].text()).toBe('image.jpg')
      expect(fileNames[2].text()).toBe('very-long-filename-that-should-be-truncated.txt')
    })

    it('should display formatted file sizes', () => {
      const wrapper = mount(AppFiles, {
        props: { files: mockFiles },
      })

      const fileSizes = wrapper.findAll('.files__item-size')
      expect(fileSizes[0].text()).toBe('1 KB')
      expect(fileSizes[1].text()).toBe('2 KB')
      expect(fileSizes[2].text()).toBe('512 Bytes')
    })

    it('should render file info structure correctly', () => {
      const wrapper = mount(AppFiles, {
        props: { files: [mockFiles[0]] },
      })

      const fileInfo = wrapper.find('.files__item-info')
      expect(fileInfo.exists()).toBe(true)
      expect(fileInfo.find('.files__item-name').exists()).toBe(true)
      expect(fileInfo.find('.files__item-size').exists()).toBe(true)
    })
  })

  describe('editable mode', () => {
    it('should show remove buttons when editable', () => {
      const wrapper = mount(AppFiles, {
        props: {
          files: mockFiles,
          editable: true,
        },
      })

      const removeButtons = wrapper.findAll('.files__item-remove')
      expect(removeButtons).toHaveLength(3)
    })

    it('should emit remove-file event when remove button clicked', async () => {
      const wrapper = mount(AppFiles, {
        props: {
          files: mockFiles,
          editable: true,
        },
      })

      const removeButton = wrapper.find('.files__item-remove')
      await removeButton.trigger('click')

      expect(wrapper.emitted('remove-file')).toHaveLength(1)
      expect(wrapper.emitted('remove-file')?.[0][0]).toBe('1')
    })

    it('should emit correct file ID when different remove buttons clicked', async () => {
      const wrapper = mount(AppFiles, {
        props: {
          files: mockFiles,
          editable: true,
        },
      })

      const removeButtons = wrapper.findAll('.files__item-remove')

      await removeButtons[1].trigger('click')
      expect(wrapper.emitted('remove-file')?.[0][0]).toBe('2')

      await removeButtons[2].trigger('click')
      expect(wrapper.emitted('remove-file')?.[1][0]).toBe('3')
    })

    it('should set correct title attribute on remove button', () => {
      const wrapper = mount(AppFiles, {
        props: {
          files: [mockFiles[0]],
          editable: true,
        },
      })

      const removeButton = wrapper.find('.files__item-remove')
      expect(removeButton.attributes('title')).toBe('Remove')
    })
  })

  describe('formatFileSize utility', () => {
    it('should format bytes correctly', () => {
      const testCases = [
        { bytes: 0, expected: '0 Bytes' },
        { bytes: 500, expected: '500 Bytes' },
        { bytes: 1024, expected: '1 KB' },
        { bytes: 1536, expected: '1.5 KB' },
        { bytes: 1048576, expected: '1 MB' },
        { bytes: 1572864, expected: '1.5 MB' },
        { bytes: 1073741824, expected: '1 GB' },
      ]

      testCases.forEach(({ bytes, expected }) => {
        const wrapper = mount(AppFiles, {
          props: {
            files: [
              {
                id: '1',
                name: 'test.txt',
                type: 'text/plain',
                size: bytes,
              },
            ],
          },
        })

        const sizeElement = wrapper.find('.files__item-size')
        expect(sizeElement.text()).toBe(expected)
      })
    })
  })

  describe('list rendering', () => {
    it('should render files in correct order', () => {
      const wrapper = mount(AppFiles, {
        props: { files: mockFiles },
      })

      const fileItems = wrapper.findAll('.files__item')
      const fileNames = fileItems.map((item) => item.find('.files__item-name').text())

      expect(fileNames).toEqual([
        'document.pdf',
        'image.jpg',
        'very-long-filename-that-should-be-truncated.txt',
      ])
    })

    it('should use file ID as key for v-for', () => {
      const wrapper = mount(AppFiles, {
        props: { files: mockFiles },
      })

      const fileItems = wrapper.findAll('.files__item')
      fileItems.forEach((item, index) => {
        expect(item.find('.files__item-name').text()).toBe(mockFiles[index].name)
      })
    })
  })

  describe('single file scenarios', () => {
    it('should handle single file correctly', () => {
      const singleFile: AttachedFile = {
        id: 'single',
        name: 'single-file.txt',
        type: 'text/plain',
        size: 1024,
      }

      const wrapper = mount(AppFiles, {
        props: {
          files: [singleFile],
          editable: true,
        },
      })

      expect(wrapper.findAll('.files__item')).toHaveLength(1)
      expect(wrapper.find('.files__item-name').text()).toBe('single-file.txt')
      expect(wrapper.find('.files__item-size').text()).toBe('1 KB')
      expect(wrapper.find('.files__item-remove').exists()).toBe(true)
    })
  })
})
