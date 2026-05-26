interface ControlsProps {
  onCapture: () => void
  isCapturing: boolean
  isCountdownActive: boolean
  showHistory: boolean
  onToggleHistory: () => void
  isCollageMode?: boolean
  isAutoCaptureActive?: boolean
  onToggleCollage?: () => void
  onCancelCollage?: () => void
  autoCaptureProgress?: string
}

export function Controls({
  onCapture,
  isCapturing,
  isCountdownActive,
  showHistory,
  onToggleHistory,
  isCollageMode,
  isAutoCaptureActive,
  onToggleCollage,
  onCancelCollage,
  autoCaptureProgress,
}: ControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
      <button
        onClick={onToggleHistory}
        className={`px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 ${
          showHistory
            ? 'bg-violet-600 text-white'
            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
        }`}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        Riwayat
      </button>

      {!isCollageMode && onToggleCollage && (
        <button
          onClick={onToggleCollage}
          className="px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 bg-slate-700 text-slate-300 hover:bg-slate-600"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zm10 0a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
            />
          </svg>
          Kolase
        </button>
      )}

      {isCollageMode && (
        <div className="px-4 py-3 rounded-lg font-semibold bg-emerald-600 text-white flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
          </svg>
          Mode Kolase
        </div>
      )}

      {isCollageMode && onCancelCollage && !isAutoCaptureActive && (
        <button
          onClick={onCancelCollage}
          className="px-4 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center gap-2 bg-rose-600 text-white hover:bg-rose-700"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Batal
        </button>
      )}

      <button
        onClick={onCapture}
        disabled={isCapturing || isCountdownActive || isAutoCaptureActive}
        className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center gap-3 ${
          isAutoCaptureActive
            ? 'bg-emerald-600 text-white cursor-wait'
            : isCapturing || isCountdownActive
            ? 'bg-slate-600 text-slate-400 cursor-not-allowed opacity-50'
            : 'bg-violet-600 text-white hover:bg-violet-700 hover:scale-[1.02] glow-primary'
        }`}
      >
        {isAutoCaptureActive ? (
          <>
            <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
            </svg>
            {autoCaptureProgress || 'Auto Capture'}
          </>
        ) : isCollageMode ? (
          <>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Auto {isCollageMode ? 'Kolase' : 'Foto'}
          </>
        ) : (
          <>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0016.07 6H17a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Ambil Foto
          </>
        )}
      </button>
    </div>
  )
}