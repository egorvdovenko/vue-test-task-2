import { computed, type Ref } from 'vue'

export function useTextFormatting() {
  const formatDescription = (text: string | undefined): string => {
    if (!text) return ''

    return text
      .replace(/\n/g, '<br>')
      .replace(/^• (.+)$/gm, '<ul><li>$1</li></ul>')
      .replace(/<\/ul>\s*<ul>/g, '')
  }

  const useFormattedDescription = (description: Ref<string | undefined>) => {
    return computed(() => formatDescription(description.value))
  }

  const truncateText = (text: string, maxLength: number): string => {
    if (!text || text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  const toTitleCase = (text: string): string => {
    return text.replace(
      /\w\S*/g,
      (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
    )
  }

  return {
    formatDescription,
    useFormattedDescription,
    truncateText,
    toTitleCase,
  }
}
