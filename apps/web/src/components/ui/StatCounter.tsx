import { useEffect, useRef, useState } from 'react'

interface StatCounterProps {
  value: number
  label: string
  prefix?: string
  suffix?: string
}

export default function StatCounter({ value, label, prefix = '', suffix = '' }: StatCounterProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const steps = 40
          const increment = value / steps
          let current = 0
          const timer = setInterval(() => {
            current += increment
            if (current >= value) { setCount(value); clearInterval(timer) }
            else setCount(Math.floor(current))
          }, 1500 / steps)
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return (
    <div ref={ref} className="text-center py-2">
      <div className="font-display font-bold text-forest"
           style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', lineHeight: 1.1 }}>
        {prefix}{value >= 1000 && value <= 9999 ? count.toString() : count.toLocaleString()}{suffix}
      </div>
      <div className="font-body text-xs text-muted mt-1.5 max-w-[120px] mx-auto leading-snug">
        {label}
      </div>
    </div>
  )
}
