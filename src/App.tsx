import { useState, useEffect, useRef } from 'react'
import { Header } from './components/Header'
import { Camera, type CameraRef } from './components/Camera'
import { Controls } from './components/Controls'
import { PhotoPreview } from './components/PhotoPreview'
import { CollageSelector } from './components/CollageSelector'
import { SessionHistory } from './components/SessionHistory'
import { StatusChecker } from './components/StatusChecker'
import { useCamera } from './hooks/useCamera'
import { CollageLayout, createCollageFromDataUrls } from './utils/captureWithFrame'


interface StoredSession {
  id: string
  filename: string
  imageData: string
  capturedAt: string
  filter: string | null
  frame: string | null
}

function captureNow(video: HTMLVideoElement | null): string | null {
  try {
    if (!video) return null
    if (video.videoWidth === 0 || video.videoHeight === 0) return null

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    ctx.drawImage(video, 0, 0)
    return canvas.toDataURL('image/png')
  } catch {
    return null
  }
}


function App() {
  const { stream, isActive, error, errorType, retryCamera } = useCamera()
  
  const [showHistory, setShowHistory] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('')
  const [sessions, setSessions] = useState<StoredSession[]>([])
  
  const [isCollageMode, setIsCollageMode] = useState(false)
  const [collageLayout, setCollageLayout] = useState<CollageLayout>('2x2')
  const [, setCollagePhotos] = useState<string[]>([])
  const [showCollageSelector, setShowCollageSelector] = useState(false)
  const [collageCount, setCollageCount] = useState(0)
  const [countdownNum, setCountdownNum] = useState(3)
  const [isAutoRunning, setIsAutoRunning] = useState(false)

  const timerRef = useRef<any>(null)
  const isCapturing = useRef(false)

  const cameraRef = useRef<CameraRef | null>(null)
  const collagePhotosRef = useRef<string[]>([])


  useEffect(() => {
    const stored = localStorage.getItem('photobooth_sessions')
    if (stored) setSessions(JSON.parse(stored))
  }, [])

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  const getTotal = (layout: CollageLayout) => {
    const map: Record<CollageLayout, number> = { '2x2': 4, '2x4': 8, '4x2': 8, '1x4': 4, '1x8': 8 }
    return map[layout]
  }

  const doSingleCapture = () => {
    if (isCapturing.current) return
    isCapturing.current = true

    const video = cameraRef.current?.getVideoElement() ?? null
    const dataUrl = captureNow(video)

    if (dataUrl) {
      setPreviewDataUrl(dataUrl)
      setShowPreview(true)
    }

    isCapturing.current = false
  }


  const doCollage = () => {
    if (!isActive || isCapturing.current) return

    isCapturing.current = true

    collagePhotosRef.current = []
    setCollagePhotos([])
    setCollageCount(0)

    const total = getTotal(collageLayout)

    const tick = (idx: number) => {
      if (idx >= total) {
        isCapturing.current = false
        finishCollage(collagePhotosRef.current)
        return
      }

      setCountdownNum(3)
      setIsAutoRunning(true)

      let sec = 3
      timerRef.current = setInterval(() => {
        sec--

        if (sec > 0) {
          setCountdownNum(sec)
          return
        }

        clearInterval(timerRef.current)
        setIsAutoRunning(false)

        // Beri sedikit waktu agar frame video benar-benar siap
        setTimeout(() => {
          const video = cameraRef.current?.getVideoElement() ?? null
          const dataUrl = captureNow(video)

          if (!dataUrl) {
            isCapturing.current = false
            return
          }

          collagePhotosRef.current = [...collagePhotosRef.current, dataUrl]
          setCollagePhotos((prev: string[]) => [...prev, dataUrl])
          setCollageCount((prev: number) => prev + 1)

          tick(idx + 1)
        }, 100)
      }, 1000)
    }

    tick(0)
  }


  const finishCollage = async (photos: string[]) => {
    if (!photos || photos.length === 0) return

    try {
      const result = await createCollageFromDataUrls(photos, {
        layout: collageLayout,
        gap: 10,
        backgroundColor: '#1e293b',
      })
      setPreviewDataUrl(result.dataUrl)
      setShowPreview(true)
      setCollagePhotos([])
      setCollageCount(0)
    } catch (err) {
      console.error('Gagal buat kolase:', err)
    }
  }


  const stopCapture = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    isCapturing.current = false
    setIsAutoRunning(false)
    setCollagePhotos([])
    setCollageCount(0)
    setCountdownNum(3)
  }

  const handleRetake = () => {
    setShowPreview(false)
    setPreviewDataUrl('')
  }

  const handleSave = (dataUrl: string) => {
    const session: StoredSession = {
      id: `s_${Date.now()}`,
      filename: `p_${Date.now()}.png`,
      imageData: dataUrl,
      capturedAt: new Date().toISOString(),
      filter: null,
      frame: null
    }
    const updated = [session, ...sessions]
    setSessions(updated)
    localStorage.setItem('photobooth_sessions', JSON.stringify(updated))
    handleRetake()
  }

  const handleDelete = (id: string) => {
    const updated = sessions.filter((s: StoredSession) => s.id !== id)
    setSessions(updated)
    localStorage.setItem('photobooth_sessions', JSON.stringify(updated))
  }

  const selectLayout = (layout: CollageLayout) => {
    setCollageLayout(layout)
    setIsCollageMode(true)
    setShowCollageSelector(false)
  }

  const cancelCollage = () => {
    stopCapture()
    setIsCollageMode(false)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="relative">
          <Camera ref={cameraRef} stream={stream} isActive={isActive} error={error} errorType={errorType} onRetry={retryCamera} />

          
          {isAutoRunning && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20 rounded-2xl">
              <div className="text-center">
                <div className="text-[8rem] font-bold text-white animate-pulse">{countdownNum}</div>
                <div className="text-xl text-white/80">Foto {collageCount + 1} / {getTotal(collageLayout)}</div>
              </div>
            </div>
          )}
        </div>

        <Controls
          onCapture={isCollageMode ? doCollage : doSingleCapture}
          isCapturing={false}
          isCountdownActive={isAutoRunning}
          showHistory={showHistory}
          onToggleHistory={() => setShowHistory(!showHistory)}
          isCollageMode={isCollageMode}
          onToggleCollage={() => setShowCollageSelector(true)}
          onCancelCollage={cancelCollage}
        />
      </main>

      {showPreview && previewDataUrl && (
        <PhotoPreview photoDataUrl={previewDataUrl} onRetake={handleRetake} onSave={handleSave} />
      )}

      <CollageSelector isOpen={showCollageSelector} onClose={() => setShowCollageSelector(false)} onSelectLayout={selectLayout} />
      <SessionHistory isOpen={showHistory} onClose={() => setShowHistory(false)} sessions={sessions} onDelete={handleDelete} />
      <StatusChecker />
    </div>
  )
}

export default App