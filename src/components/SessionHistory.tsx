interface Session {
  id: string
  filename: string
  imageData: string
  capturedAt: string
  filter: string | null
  frame: string | null
}

interface SessionHistoryProps {
  isOpen: boolean
  onClose: () => void
  sessions: Session[]
  onDelete: (id: string) => void
}

function downloadSession(session: Session) {
  const link = document.createElement('a')
  link.download = session.filename || `photo_${Date.now()}.png`
  link.href = session.imageData
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function SessionHistory({ isOpen, onClose, sessions, onDelete }: SessionHistoryProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md h-full bg-slate-800 shadow-xl overflow-hidden">
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Riwayat Foto</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 overflow-auto h-[calc(100%-64px)]">
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 mx-auto mb-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-slate-500">Belum ada foto tersimpan</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {sessions.map((session) => (
                <div key={session.id} className="relative group bg-slate-900 rounded-xl overflow-hidden">
                  <img src={session.imageData} alt="" className="w-full aspect-video object-cover" />
                  
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                    <button
                      onClick={() => downloadSession(session)}
                      className="p-2 bg-emerald-600 hover:bg-emerald-700 rounded-full transition-colors"
                      title="Unduh"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                    <button
                      onClick={() => onDelete(session.id)}
                      className="p-2 bg-rose-600 hover:bg-rose-700 rounded-full transition-colors"
                      title="Hapus"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="p-2 bg-slate-800">
                    <p className="text-xs text-slate-400">
                      {new Date(session.capturedAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}