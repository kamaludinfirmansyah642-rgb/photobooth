export type FilterType = 
  | 'none'
  | 'grayscale'
  | 'sepia'
  | 'brightness'
  | 'vintage'
  | 'cool'
  | 'warm'

export interface FilterConfig {
  id: FilterType
  name: string
  cssFilter: string
}

export const filters: FilterConfig[] = [
  { id: 'none', name: 'Normal', cssFilter: 'none' },
  { id: 'grayscale', name: 'Hitam Putih', cssFilter: 'grayscale(100%)' },
  { id: 'sepia', name: 'Sepia', cssFilter: 'sepia(100%)' },
  { id: 'brightness', name: 'Terang', cssFilter: 'brightness(150%)' },
  { id: 'vintage', name: 'Vintage', cssFilter: 'sepia(50%) brightness(90%) contrast(110%)' },
  { id: 'cool', name: 'Dingin', cssFilter: 'saturate(80%) hue-rotate(180deg)' },
  { id: 'warm', name: 'Hangat', cssFilter: 'saturate(120%) sepia(20%)' },
]

export function getFilterById(filterId: FilterType): FilterConfig {
  return filters.find((f) => f.id === filterId) || filters[0]
}

export function getFilterStyle(filterId: FilterType): string {
  return getFilterById(filterId).cssFilter
}

export function applyCssFilter(
  container: HTMLElement,
  filterId: FilterType
): void {
  const filter = getFilterById(filterId)
  container.style.filter = filter.cssFilter
}

export function clearCssFilter(container: HTMLElement): void {
  container.style.filter = 'none'
}