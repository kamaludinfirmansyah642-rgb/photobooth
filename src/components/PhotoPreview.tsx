import { useState, useCallback } from 'react'
import { FilterType, getFilterById } from '../utils/filters'
import { FrameConfig, defaultFrames } from '../utils/captureWithFrame'
import { captureFromVideoElement } from '../utils/captureHelper'

interface PhotoPreviewProps {
  photoDataUrl: string
  onRetake: () => void
  onSave: (dataUrl: string) => void
}

function applyFrameToImage(photoUrl: string, frameUrl: string, opacity: number = 0.9): string {
  return new Promise((resolve) => {
    const img1 = new Image()
    img1.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img1.width
      canvas.height = img1.height
      const ctx = canvas.getContext('2d')
      if (!ctx) { resolve(photoUrl); return }
      
      ctx.drawImage(img1, 0, 0)
      
      if (frameUrl) {
        const img2 = new Image()
        img2.crossOrigin = 'anonymous'
        img2.onload = () => {
          ctx.globalAlpha = opacity
          ctx.drawImage(img2, 0, 0, canvas.width, canvas.height)
          resolve(canvas.toDataURL('image/png'))
        }
        img2.onerror = () => resolve(photoUrl)
        img2.src = frameUrl
      } else {
        resolve(photoUrl)
      }
    }
    img1.onerror = () => resolve(photoUrl)
    img1.src = photoUrl
  }) as any
}

export function PhotoPreview({ photoDataUrl, onRetake, onSave }: PhotoPreviewProps) {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('none')
  const [selectedFrame, setSelectedFrame] = useState<FrameConfig>(defaultFrames[0])
  const [showFrames, setShowFrames] = useState(false)
  const [isApplying, setIsApplying] = useState(false)

  const filter = getFilterById(selectedFilter)

  const handleDownload = useCallback(() => {
    const link = document.createElement('a')
    link.download = `photobooth_${Date.now()}.png`
    link.href = photoDataUrl
    link.click()
  }, [photoDataUrl])

  const handleSaveWithFrame = useCallback(async () => {
    setIsApplying(true)
    
    let finalDataUrl = photoDataUrl
    
    // Jika ada frame dan frame memiliki URL
    if (selectedFrame.id !== 'none' && selectedFrame.dataUrl && selectedFrame.dataUrl.trim() !== '') {
      try {
        // Ambil fresh photo dari video karena fungsi captureFromVideoElement ada di util
        const video = document.querySelector('video') as HTMLVideoElement
        if (video && video.videoWidth > 0) {
          // Buat canvas baru
          const canvas = document.createElement('canvas')
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          const ctx = canvas.getContext('2d')
          if (ctx) {
            // Gambar video
            ctx.drawImage(video, 0, 0)
            
            // Load dan gambar frame
            const frameImg = new Image()
            frameImg.crossOrigin = 'anonymous'
            await new Promise<void>((resolve, reject) => {
              frameImg.onload = () => {
                ctx.globalAlpha = selectedFrame.opacity || 0.9
                ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height)
                resolve()
              }
              frameImg.onerror = () => resolve()
              frameImg.src = selectedFrame.dataUrl!
            })
            
            finalDataUrl = canvas.toDataURL('image/png')
          }
        }
      } catch (e) {
        console.error('Gagal apply frame:', e)
      }
    }
    
    setIsApplying(false)
    onSave(finalDataUrl)
  }, [photoDataUrl, selectedFrame, onSave])

  const filters: { id: FilterType; name: string }[] = [
    { id: 'none', name: 'Normal' },
    { id: 'grayscale', name: 'B&W' },
    { id: 'sepia', name: 'Sepia' },
    { id: 'brightness', name: 'Terang' },
    { id: 'vintage', name: 'Vintage' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Pratinjau Foto</h2>
          <button onClick={() => setShowFrames(!showFrames)} className={`px-4 py-2 rounded-lg text-sm font-medium ${showFrames ? 'bg-violet-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
            {showFrames ? 'Filter' : 'Bingkai'}
          </button>
        </div>

        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 mb-4">
          <img src={photoDataUrl} alt="Preview" className="w-full h-full object-contain" style={{ filter: filter.cssFilter }} />
          {selectedFrame.id !== 'none' && selectedFrame.dataUrl && (
            <img src={selectedFrame.dataUrl} alt={selectedFrame.name} className="absolute inset-0 w-full h-full object-contain pointer-events-none" style={{ opacity: selectedFrame.opacity || 0.9 }} />
          )}
        </div>

        {showFrames ? (
          <div className="mb-4">
            <label className="text-slate-400 text-sm mb-2 block">Bingkai (pilih lalu Simpan):</label>
            <div className="grid grid-cols-3 gap-2">
              {defaultFrames.map((frame) => (
                <button key={frame.id} onClick={() => setSelectedFrame(frame)} className={`p-3 rounded-lg text-sm font-medium ${selectedFrame.id === frame.id ? 'bg-violet-600 text-white ring-2 ring-violet-400' : 'bg-slate-700 text-slate-300'}`}>
                  {frame.name}
                </button>
              ))}
            </div>
            <p className="text-xs text-amber-400 mt-2">⚠️ tambahkan file PNG di public/frames/</p>
          </div>
        ) : (
          <div className="mb-4">
            <label className="text-slate-400 text-sm mb-2 block">Filter:</label>
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button key={f.id} onClick={() => setSelectedFilter(f.id)} className={`px-4 py-2 rounded-lg text-sm font-medium ${selectedFilter === f.id ? 'bg-violet-600 text-white' : 'bg-slate-700 text-slate-300'}`}>
                  {f.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={onRetake} className="flex-1 px-6 py-3 rounded-xl font-semibold bg-slate-700 text-slate-300">Ambil Ulang</button>
          <button onClick={handleDownload} className="flex-1 px-6 py-3 rounded-xl font-semibold bg-rose-600 text-white">Unduh</button>
          <button onClick={handleSaveWithFrame} disabled={isApplying} className="flex-1 px-6 py-3 rounded-xl font-semibold bg-emerald-600 text-white disabled:opacity-50">
            {isApplying ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>
    </div>
  )
}