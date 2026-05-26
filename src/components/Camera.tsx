import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'

interface CameraProps {
  stream: MediaStream | null
  isActive: boolean
  error: string | null
  errorType?: 'not-supported' | 'permission-denied' | 'not-found' | null
  onRetry?: () => void
}

export interface CameraRef {
  getVideoElement: () => HTMLVideoElement | null
}

export const Camera = forwardRef<CameraRef, CameraProps>(
  ({ stream, isActive, error, errorType, onRetry }, ref) => {
    const internalRef = useRef<HTMLVideoElement>(null)

    useImperativeHandle(ref, () => ({
      getVideoElement: () => internalRef.current
    }))

    useEffect(() => {
      if (internalRef.current && stream) {
        internalRef.current.srcObject = stream
      }
    }, [stream])

    const getErrorIcon = () => {
      if (errorType === 'permission-denied') {
        return (
          <svg className="w-16 h-16 mx-auto mb-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12m2.333-6.667V16a2.667 2.667 0 10-5.333 0v1.333M6.667 16A2.667 2.667 0 014 13.333v-2.22a2.636 2.636 0 011.243-2.128M8 7.333V5.667a2.636 2.636 0 015.333 0V16" />
          </svg>
        )
      }
      return (
        <svg className="w-16 h-16 mx-auto mb-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )
    }

    const getErrorTitle = () => {
      switch (errorType) {
        case 'permission-denied': return 'Izin Kamera Ditolak'
        case 'not-found': return 'Kamera Tidak Ditemukan'
        case 'not-supported': return 'Browser Tidak Didukung'
        default: return 'Kamera Tidak Tersedia'
      }
    }

    const getSuggestion = () => {
      switch (errorType) {
        case 'permission-denied': return 'Klik ikon kamera/lock di address bar, lalu izinkan akses.'
        case 'not-found': return 'Pastikan kamera terpasang dan tidak digunakan aplikasi lain.'
        case 'not-supported': return 'Gunakan Chrome, Firefox, atau Edge terbaru.'
        default: return 'Tekan tombol Coba Lagi di bawah.'
      }
    }

    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-slate-900 border-2 border-slate-700">
        {!isActive && !error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-400">Memuat kamera...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-6 max-w-md">
              {getErrorIcon()}
              <h3 className="text-xl font-semibold text-slate-200 mb-2">{getErrorTitle()}</h3>
              <p className="text-slate-400 text-sm mb-2">{error}</p>
              <p className="text-slate-500 text-xs mb-4">{getSuggestion()}</p>
              {onRetry && (
                <button onClick={onRetry} className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-medium rounded-lg">
                  Coba Lagi
                </button>
              )}
            </div>
          </div>
        )}

<video
           ref={internalRef}
           autoPlay
           playsInline
           muted
           disablePictureInPicture
          className={`absolute inset-0 w-full h-full object-cover ${isActive ? 'opacity-100' : 'opacity-0'}`}
          style={{ visibility: isActive ? 'visible' : 'hidden' }}
        />

        {isActive && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/20" />
          </div>
        )}
      </div>
    )
  }
)

Camera.displayName = 'Camera'