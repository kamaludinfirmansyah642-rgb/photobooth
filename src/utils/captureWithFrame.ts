export interface CaptureResult {
  dataUrl: string
  blob: Blob | null
  filename: string
}

export interface FrameConfig {
  id: string
  name: string
  dataUrl?: string
  offsetX?: number
  offsetY?: number
  scale?: number
  opacity?: number
}

// Download frame PNG gratis:
// - https://www.vecteezy.com/free-png/photo-booth-frame
// - https://pngtree.com/so/photobooth-templates
// - https://imgbin.com/free-png/photo-booth-frame
//
// Tempatkan file PNG di folder: public/frames/

export const defaultFrames: FrameConfig[] = [
  { id: 'none', name: 'Tanpa Bingkai', offsetX: 0, offsetY: 0, scale: 1, opacity: 1 },
  // Untuk gunakan bingkai, letakkan file di public/frames/:
  // Contoh: classic.png, party.png, vintage.png, dll.
  { id: 'classic', name: 'Klasik', dataUrl: '', offsetX: 0, offsetY: 0, scale: 1, opacity: 0.9 },
  { id: 'party', name: 'Pesta', dataUrl: '', offsetX: 0, offsetY: 0, scale: 1, opacity: 0.9 },
  { id: 'vintage', name: 'Vintage', dataUrl: '', offsetX: 0, offsetY: 0, scale: 1, opacity: 0.9 },
  { id: 'neon', name: 'Neon', dataUrl: '', offsetX: 0, offsetY: 0, scale: 1, opacity: 0.9 },
  { id: 'rainbow', name: 'Pelangi', dataUrl: '', offsetX: 0, offsetY: 0, scale: 1, opacity: 0.9 },
]

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (!src || src === '') {
      reject(new Error('URL frame kosong'))
      return
    }
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error(`Gagal memuat frame: ${src}`))
    img.src = src
  })
}

export async function capturePhotoFromVideo(
  videoElement: HTMLVideoElement,
  frame?: FrameConfig,
  outputFormat: 'png' | 'jpeg' = 'png'
): Promise<CaptureResult> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    throw new Error('Tidak dapat membuat konteks canvas')
  }

  const videoWidth = videoElement.videoWidth
  const videoHeight = videoElement.videoHeight

  if (videoWidth === 0 || videoHeight === 0) {
    throw new Error('Video belum siap atau dimensi tidak valid')
  }

  canvas.width = videoWidth
  canvas.height = videoHeight

  ctx.drawImage(videoElement, 0, 0, videoWidth, videoHeight)

  if (frame && frame.id !== 'none' && frame.dataUrl) {
    try {
      const frameImg = await loadImage(frame.dataUrl)
      const scale = frame.scale || 1
      const opacity = frame.opacity ?? 0.9
      
      ctx.globalAlpha = opacity
      ctx.drawImage(
        frameImg,
        frame.offsetX || 0,
        frame.offsetY || 0,
        videoWidth * scale,
        videoHeight * scale
      )
      ctx.globalAlpha = 1
    } catch (err) {
      console.warn('Gagal memuat frame:', err)
    }
  }

  const mimeType = outputFormat === 'png' ? 'image/png' : 'image/jpeg'
  const quality = outputFormat === 'jpeg' ? 0.92 : undefined
  const dataUrl = canvas.toDataURL(mimeType, quality)

  const blob: Blob | null = await new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), mimeType, quality)
  })

  const timestamp = Date.now()
  const extension = outputFormat === 'png' ? 'png' : 'jpg'
  const filename = `photobooth_${timestamp}.${extension}`

  return {
    dataUrl,
    blob,
    filename,
  }
}

export async function captureWithFilters(
  videoElement: HTMLVideoElement,
  cssFilter: string,
  frame?: FrameConfig,
  outputFormat: 'png' | 'jpeg' = 'png'
): Promise<CaptureResult> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    throw new Error('Tidak dapat membuat konteks canvas')
  }

  const videoWidth = videoElement.videoWidth
  const videoHeight = videoElement.videoHeight

  canvas.width = videoWidth
  canvas.height = videoHeight

  ctx.filter = cssFilter !== 'none' ? cssFilter : 'none'
  ctx.drawImage(videoElement, 0, 0, videoWidth, videoHeight)
  ctx.filter = 'none'

  if (frame && frame.id !== 'none' && frame.dataUrl) {
    try {
      const frameImg = await loadImage(frame.dataUrl)
      const scale = frame.scale || 1
      ctx.globalAlpha = frame.opacity ?? 0.9
      ctx.drawImage(
        frameImg,
        frame.offsetX || 0,
        frame.offsetY || 0,
        videoWidth * scale,
        videoHeight * scale
      )
      ctx.globalAlpha = 1
    } catch (err) {
      console.warn('Gagal memuat frame:', err)
    }
  }

  const mimeType = outputFormat === 'png' ? 'image/png' : 'image/jpeg'
  const quality = outputFormat === 'jpeg' ? 0.92 : undefined
  const dataUrl = canvas.toDataURL(mimeType, quality)

  const blob: Blob | null = await new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), mimeType, quality)
  })

  const timestamp = Date.now()
  const extension = outputFormat === 'png' ? 'png' : 'jpg'
  const filename = `photobooth_${timestamp}.${extension}`

  return {
    dataUrl,
    blob,
    filename,
  }
}

export function downloadPhoto(result: CaptureResult, customFilename?: string): void {
  const link = document.createElement('a')
  link.download = customFilename || result.filename
  link.href = result.dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.download = filename
  link.href = url
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  setTimeout(() => URL.revokeObjectURL(url), 100)
}

export async function loadFrameFromFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Gagal membaca file frame'))
    reader.readAsDataURL(file)
  })
}

export async function loadFrameFromUrl(url: string): Promise<string> {
  try {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`)
    }
    const blob = await response.blob()
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = () => reject(new Error('Gagal mengkonversi frame'))
      reader.readAsDataURL(blob)
    })
  } catch (err) {
    throw new Error(`Gagal memuat frame dari ${url}: ${err}`)
  }
}

export function createFrameFromConfig(
  id: string,
  name: string,
  dataUrl?: string,
  options?: { offsetX?: number; offsetY?: number; scale?: number; opacity?: number }
): FrameConfig {
  return {
    id,
    name,
    dataUrl,
    offsetX: options?.offsetX || 0,
    offsetY: options?.offsetY || 0,
    scale: options?.scale || 1,
    opacity: options?.opacity || 0.9,
  }
}

export type CollageLayout = '2x2' | '2x4' | '4x2' | '1x4' | '1x8'

export interface CollageConfig {
  layout: CollageLayout
  gap: number
  backgroundColor: string
}

export async function captureCollage(
  photos: HTMLVideoElement[],
  config: CollageConfig
): Promise<CaptureResult> {
  const { layout, gap, backgroundColor } = config
  
  const layouts: Record<CollageLayout, { cols: number; rows: number }> = {
    '2x2': { cols: 2, rows: 2 },
    '2x4': { cols: 2, rows: 4 },
    '4x2': { cols: 4, rows: 2 },
    '1x4': { cols: 1, rows: 4 },
    '1x8': { cols: 1, rows: 8 },
  }

  const { cols, rows } = layouts[layout]
  
  if (photos.length === 0) {
    throw new Error('Tidak ada foto untuk kolase')
  }

  const photoWidth = photos[0].videoWidth || 640
  const photoHeight = photos[0].videoHeight || 480

  const totalWidth = cols * photoWidth + (cols - 1) * gap
  const totalHeight = rows * photoHeight + (rows - 1) * gap

  const canvas = document.createElement('canvas')
  canvas.width = totalWidth
  canvas.height = totalHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Tidak dapat membuat konteks canvas')
  }

  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, totalWidth, totalHeight)

  let photoIndex = 0
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (photoIndex >= photos.length) break
      
      const x = col * (photoWidth + gap)
      const y = row * (photoHeight + gap)
      
      const photo = photos[photoIndex]
      if (photo.videoWidth > 0 && photo.videoHeight > 0) {
        ctx.drawImage(photo, x, y, photoWidth, photoHeight)
      }
      
      photoIndex++
    }
  }

  const dataUrl = canvas.toDataURL('image/png')
  const timestamp = Date.now()
  const filename = `collage_${layout}_${timestamp}.png`

  return {
    dataUrl,
    blob: null,
    filename,
  }
}

export async function createCollageFromDataUrls(
  dataUrls: string[],
  config: CollageConfig
): Promise<CaptureResult> {
  const { layout, gap, backgroundColor } = config
  
  const layouts: Record<CollageLayout, { cols: number; rows: number }> = {
    '2x2': { cols: 2, rows: 2 },
    '2x4': { cols: 2, rows: 4 },
    '4x2': { cols: 4, rows: 2 },
    '1x4': { cols: 1, rows: 4 },
    '1x8': { cols: 1, rows: 8 },
  }

  const { cols, rows } = layouts[layout]
  
  if (dataUrls.length === 0) {
    throw new Error('Tidak ada foto untuk kolase')
  }

  const photoWidth = 640
  const photoHeight = 480

  const totalWidth = cols * photoWidth + (cols - 1) * gap
  const totalHeight = rows * photoHeight + (rows - 1) * gap

  const canvas = document.createElement('canvas')
  canvas.width = totalWidth
  canvas.height = totalHeight

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    throw new Error('Tidak dapat membuat konteks canvas')
  }

  ctx.fillStyle = backgroundColor
  ctx.fillRect(0, 0, totalWidth, totalHeight)

  let loadedImages: HTMLImageElement[] = []
  
  for (const dataUrl of dataUrls) {
    try {
      const img = await loadImage(dataUrl)
      img.width = photoWidth
      img.height = photoHeight
      loadedImages.push(img)
    } catch (err) {
      console.warn('Gagal memuat foto:', err)
    }
  }

  let photoIndex = 0
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (photoIndex >= loadedImages.length) break
      
      const x = col * (photoWidth + gap)
      const y = row * (photoHeight + gap)
      
      ctx.drawImage(loadedImages[photoIndex], x, y, photoWidth, photoHeight)
      photoIndex++
    }
  }

  const resultDataUrl = canvas.toDataURL('image/png')
  const timestamp = Date.now()
  const filename = `collage_${layout}_${timestamp}.png`

  return {
    dataUrl: resultDataUrl,
    blob: null,
    filename,
  }
}