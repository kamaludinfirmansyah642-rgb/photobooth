import { useState } from 'react'
import { CollageLayout } from '../utils/captureWithFrame'

interface CollageSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectLayout: (layout: CollageLayout) => void
}

const collageLayouts: { layout: CollageLayout; name: string; description: string }[] = [
  { layout: '2x2', name: '4 Foto', description: 'Grid 2x2' },
  { layout: '2x4', name: '8 Foto', description: 'Grid 2x4' },
  { layout: '4x2', name: '8 Foto', description: 'Grid 4x2' },
  { layout: '1x4', name: '4 Foto', description: 'Grid 1x4' },
  { layout: '1x8', name: '8 Foto', description: 'Grid 1x8' },
]

export function CollageSelector({ isOpen, onClose, onSelectLayout }: CollageSelectorProps) {
  const [selectedLayout, setSelectedLayout] = useState<CollageLayout>('2x2')

  if (!isOpen) return null

  const handleConfirm = () => {
    onSelectLayout(selectedLayout)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-4">Pilih Layout Kolase</h2>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          {collageLayouts.map((item) => (
            <button
              key={item.layout}
              onClick={() => setSelectedLayout(item.layout)}
              className={`p-4 rounded-xl transition-all ${
                selectedLayout === item.layout
                  ? 'bg-violet-600 text-white ring-2 ring-violet-400'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              <div className="font-semibold mb-1">{item.name}</div>
              <div className="text-xs opacity-75">{item.description}</div>
            </button>
          ))}
        </div>

        <div className="bg-slate-900 rounded-xl p-4 mb-4">
          <LayoutPreview layout={selectedLayout} />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-xl font-semibold bg-slate-700 text-slate-300 hover:bg-slate-600 transition-all"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-6 py-3 rounded-xl font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition-all"
          >
            Mulai Ambil
          </button>
        </div>
      </div>
    </div>
  )
}

function LayoutPreview({ layout }: { layout: CollageLayout }) {
  const configs: Record<CollageLayout, { cols: number; rows: number }> = {
    '2x2': { cols: 2, rows: 2 },
    '2x4': { cols: 2, rows: 4 },
    '4x2': { cols: 4, rows: 2 },
    '1x4': { cols: 1, rows: 4 },
    '1x8': { cols: 1, rows: 8 },
  }

  const { cols, rows } = configs[layout]
  const cellSize = Math.min(40, 120 / Math.max(cols, rows))
  const gap = 2

  return (
    <div className="flex justify-center">
      <div
        className="grid gap-1 bg-slate-800 p-2 rounded"
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
        }}
      >
        {Array.from({ length: rows * cols }).map((_, i) => (
          <div
            key={i}
            className="bg-violet-500/30 rounded-sm border border-violet-500/50"
          />
        ))}
      </div>
    </div>
  )
}