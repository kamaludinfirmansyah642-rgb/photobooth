export function captureFromVideoElement(): string | null {
  try {
    const videos = document.querySelectorAll('video')
    if (videos.length === 0) {
      alert('Kamera belum aktif!')
      return null
    }
    
    const video = videos[0] as HTMLVideoElement
    
    // Tunggu video ready
    if (video.readyState < 2) {
      alert('Kamera belum siap! Tunggu sebentar.')
      return null
    }
    
    // Cek dimensi
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      alert('Resolusi kamera 0! Gunakan kamera lain.')
      return null
    }

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      alert('Gagal akses canvas!')
      return null
    }
    
    // Gambar video ke canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    
    const dataUrl = canvas.toDataURL('image/png')
    
    if (dataUrl.length < 1000) {
      alert('Gagal capture foto!')
      return null
    }
    
    return dataUrl
  } catch (e) {
    alert('Error capture: ' + (e as Error).message)
    return null
  }
}

export function downloadImage(dataUrl: string, filename: string): void {
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}