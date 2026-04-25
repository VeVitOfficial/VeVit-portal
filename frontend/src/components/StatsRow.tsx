import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Users, BookOpen, Gamepad2, Wrench } from 'lucide-react'
import { api } from '../lib/api'

const DEFAULT_STATS = { users: 1340, gamesPlayed: 48230, lessonsCompleted: 7812, toolsAvailable: 94 }

function useCountUp(target: number, duration = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const startTime = Date.now()
        const tick = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min(elapsed / duration, 1)
          setCount(Math.floor(progress * target))
          if (progress < 1) requestAnimationFrame(tick)
        }
        tick()
      }
    }, { threshold: 0.3 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target, duration])

  return { count, ref }
}

export default function StatsRow() {
  const { t } = useTranslation()
  const [stats, setStats] = useState(DEFAULT_STATS)

  useEffect(() => {
    api.stats().then(setStats).catch(() => {})
  }, [])

  const statItems = [
    { key: 'users', value: stats.users, icon: Users, label: t('stats.users'), live: true },
    { key: 'lessons', value: stats.lessonsCompleted, icon: BookOpen, label: t('stats.lessonsCompleted') },
    { key: 'games', value: stats.gamesPlayed, icon: Gamepad2, label: t('stats.gamesPlayed') },
    { key: 'tools', value: stats.toolsAvailable, icon: Wrench, label: t('stats.toolsAvailable') },
  ]

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="bg-bg-card rounded-[24px] p-10 border border-[var(--border-default)]">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {statItems.map((item) => (
              <StatCard key={item.key} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function StatCard({ value, icon: Icon, label, live }: {
  value: number; icon: React.ElementType; label: string; live?: boolean
}) {
  const { count, ref } = useCountUp(value)
  const formatted = count.toLocaleString('cs-CZ')

  return (
    <div ref={ref} className="text-center">
      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6 text-accent" strokeWidth={1.5} />
      </div>
      <div className="text-3xl font-bold text-text-pri mb-1">{formatted}</div>
      <div className="text-sm text-text-muted flex items-center justify-center gap-1.5">
        {live && <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />}
        {label}
      </div>
    </div>
  )
}