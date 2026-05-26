interface CountdownProps {
  count: number
  isActive: boolean
}

export function Countdown({ count, isActive }: CountdownProps) {
  if (!isActive || count === 0) return null

  return (
    <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/40 rounded-2xl">
      <div className="countdown-number animate-pulse-countdown">
        {count}
      </div>
    </div>
  )
}