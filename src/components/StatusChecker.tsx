import { useState, useEffect } from 'react'

interface StatusInfo {
  protocol: string
  hostname: string
  port: string
  fullUrl: string
  mediaDevicesAvailable: boolean
  isSecureContext: boolean
  isLocalhost: boolean
}

export function StatusChecker() {
  const [status, setStatus] = useState<StatusInfo | null>(null)
  const [showInstructions, setShowInstructions] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const info: StatusInfo = {
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      port: window.location.port,
      fullUrl: window.location.href,
      mediaDevicesAvailable: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      isSecureContext: window.location.protocol === 'https:' || 
                   window.location.hostname === 'localhost' || 
                   window.location.hostname === '127.0.0.1',
      isLocalhost: window.location.hostname === 'localhost' || 
                 window.location.hostname === '127.0.0.1',
    }
    setStatus(info)
  }, [])

  if (!status) return null

  const getProtocolStatus = () => {
    if (status.protocol === 'https:') {
      return { text: 'HTTPS (Aman)', color: 'text-emerald-400', bg: 'bg-emerald-500/20' }
    }
    return { text: 'HTTP (Tidak Aman)', color: 'text-amber-400', bg: 'bg-amber-500/20' }
  }

  const getMediaStatus = () => {
    if (status.mediaDevicesAvailable) {
      return { text: 'Tersedia', color: 'text-emerald-400', bg: 'bg-emerald-500/20' }
    }
    return { text: 'Tidak Tersedia', color: 'text-red-400', bg: 'bg-red-500/20' }
  }

  const protocolStatus = getProtocolStatus()
  const mediaStatus = getMediaStatus()
  const needsFix = !status.isSecureContext && !status.isLocalhost

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="w-12 h-12 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center hover:bg-slate-700 transition-colors shadow-lg"
        title="Status Koneksi"
      >
        <svg className={`w-6 h-6 ${needsFix ? 'text-amber-400' : 'text-emerald-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      </button>

      {isVisible && (
        <div className="absolute bottom-14 right-0 w-80 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl p-4">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Status Koneksi
          </h3>

          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Protokol</span>
              <span className={`px-2 py-0.5 rounded ${protocolStatus.bg} ${protocolStatus.color}`}>
                {protocolStatus.text}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Kamera API</span>
              <span className={`px-2 py-0.5 rounded ${mediaStatus.bg} ${mediaStatus.color}`}>
                {mediaStatus.text}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Alamat</span>
              <span className="text-slate-200 text-xs truncate max-w-48" title={status.fullUrl}>
                {status.hostname}:{status.port}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">URL</span>
              <span className="text-slate-200 text-xs truncate max-w-48" title={status.fullUrl}>
                {window.location.pathname}
              </span>
            </div>
          </div>

          {needsFix && (
            <div className="mt-3 pt-3 border-t border-slate-700">
              <button
                onClick={() => setShowInstructions(!showInstructions)}
                className="w-full px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Aktifkan Kamera (HTTP)
              </button>

              {showInstructions && (
                <div className="mt-2 p-3 bg-slate-900 rounded-lg text-xs space-y-2">
                  <p className="text-amber-300 font-medium">Chrome Android:</p>
                  <ol className="text-slate-300 list-decimal list-inside space-y-1">
                    <li>Buka Chrome, ketik di address bar:</li>
                    <li className="text-amber-400 font-mono text-[10px]">chrome://flags/#unsafely-treat-insecure-origin-as-secure</li>
                    <li>Cari input, masukkan:</li>
                    <li className="text-amber-400 font-mono text-[10px]">http://{status.hostname}:{status.port}</li>
                    <li>Pilih <span className="text-emerald-400">Enabled</span></li>
                    <li>Tekan <span className="text-emerald-400">Relaunch</span></li>
                  </ol>

                  <p className="text-amber-300 font-medium mt-3">Laptop/PC:</p>
                  <ol className="text-slate-300 list-decimal list-inside space-y-1">
                    <li>Buka Command Prompt as Admin</li>
                    <li>Jalankan:</li>
                    <li className="text-amber-400 font-mono text-[10px]">cd C:\Users\User\Documents\trae_projects\Photobooth</li>
                    <li className="text-amber-400 font-mono text-[10px]">set PATH=C:\Program Files\nodejs;%PATH%</li>
                    <li className="text-amber-400 font-mono text-[10px]">npx vite --host</li>
                    <li>Buka <span className="text-emerald-400">https://localhost:3001</span> atau</li>
                    <li>Gunakan ngrok untuk HTTPS tunnel</li>
                  </ol>
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setIsVisible(false)}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-slate-500 hover:text-slate-300 rounded"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}