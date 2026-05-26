export function captureFromVideoElement(): string | null {
  const videos = document.querySelectorAll('video')
  if (videos.length === 0) {
    console.error('[Capture] Tidak ada video element')
    return null
  }
  
  const video = videos[0] as HTMLVideoElement
  console.log('[Capture] Video found, w:', video.videoWidth, 'h:', video.videoHeight, 'ready:', video.readyState)
  
  if (video.videoWidth === 0 || video.videoHeight === 0) {
    console.error('[Capture] Video belum siap dimensi')
    return null
  }
  
  if (!video.srcObject) {
    console.error('[Capture] Video srcObject kosong')
    return null
  }

  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')
  
  if (!ctx) {
    console.error('[Capture] Gagal buat canvas context')
    return null
  }
  
  ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
  const dataUrl = canvas.toDataURL('image/png')
  
  console.log('[Capture] Success, length:', dataUrl.length)
  return dataUrl
}

export function testVideoElement(): void {
  const videos = document.querySelectorAll('video')
  console.log('[Test] Jumlah video:', videos.length)
  if (videos.length > 0) {
    const v = videos[0] as HTMLVideoElement
    console.log('[Test] Video dimensi:', v.videoWidth, 'x', v.videoHeight)
    console.log('[Test] Video readyState:', v.readyState)
    console.log('[Test] Video srcObject:', v.srcObject ? 'ada' : 'kosong')
  }
}