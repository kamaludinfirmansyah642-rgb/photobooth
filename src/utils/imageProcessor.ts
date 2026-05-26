interface FrameOverlayOptions {
  framePath?: string
  frameDataUrl?: string
  frameId?: string
}

export async function applyFrameOverlay(
  photoDataUrl: string,
  frame: FrameOverlayOptions
): Promise<string> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Failed to get canvas context')

  const photoImg = await loadImage(photoDataUrl)
  canvas.width = photoImg.width
  canvas.height = photoImg.height

  ctx.drawImage(photoImg, 0, 0)

  if (frame.frameDataUrl) {
    const frameImg = await loadImage(frame.frameDataUrl)
    ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height)
  }

  return canvas.toDataURL('image/png')
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}

export const availableFrames = [
  { id: 'none', name: 'Tanpa Bingkai', dataUrl: '' },
  { id: 'classic', name: 'Klasik', dataUrl: '' },
  { id: 'party', name: 'Pesta', dataUrl: '' },
  { id: 'vintage', name: 'Vintage', dataUrl: '' },
  { id: 'neon', name: 'Neon', dataUrl: '' },
  { id: 'rainbow', name: 'Pelangi', dataUrl: '' },
]

export function getFrameById(frameId: string): FrameOverlayOptions | null {
  const frame = availableFrames.find((f) => f.id === frameId)
  if (!frame || frame.id === 'none') return null
  return { frameId: frame.id }
}