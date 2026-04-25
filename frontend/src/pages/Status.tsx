import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '../lib/api'

type ServiceStatus = { status: string; responseTimeMs: number; lastChecked: string }
type StatusData = Record<string, ServiceStatus>

const STATUS_COLORS: Record<string, string> = {
  online: 'text-accent',
  degraded: 'text-warn',
  offline: 'text-danger',
}

const STATUS_BG: Record<string, string> = {
  online: 'bg-accent',
  degraded: 'bg-warn',
  offline: 'bg-danger',
}

const SERVICE_LABELS: Record<string, string> = {
  games: 'Games',
  tools: 'Tools',
  edu: 'Edu',
  account: 'Account',
  services: 'Services',
}

export default function Status() {
  const { t } = useTranslation()
  const [data, setData] = useState<StatusData>({})

  useEffect(() => {
    api.status().then(setData).catch(() => {})
    const interval = setInterval(() => { api.status().then(setData).catch(() => {}) }, 30000)
    return () => clearInterval(interval)
  }, [])

  const allOnline = Object.values(data).every((s) => s.status === 'online')
  const anyDegraded = Object.values(data).some((s) => s.status === 'degraded')
  const overallStatus = allOnline ? 'online' : anyDegraded ? 'degraded' : 'offline'
  const overallLabel = allOnline ? t('status.allOnline') : anyDegraded ? t('status.degraded') : t('status.outage')

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-text-pri mb-8">{t('status.title')}</h1>

        {/* Overall */}
        <div className="p-8 rounded-[16px] bg-bg-card border border-[var(--border-default)] mb-8 text-center">
          <div className={`w-4 h-4 rounded-full ${STATUS_BG[overallStatus]} mx-auto mb-4 animate-pulse`} />
          <p className={`text-2xl font-semibold ${STATUS_COLORS[overallStatus]}`}>{overallLabel}</p>
        </div>

        {/* Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(data).map(([key, service]) => (
            <div key={key}
              className="p-5 rounded-[16px] bg-bg-card border border-[var(--border-default)]">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-text-pri">
                  {SERVICE_LABELS[key] || key}
                </span>
                <span className={`flex items-center gap-1.5 text-xs font-medium ${STATUS_COLORS[service.status]}`}>
                  <span className={`w-2 h-2 rounded-full ${STATUS_BG[service.status]} ${service.status === 'online' ? 'animate-pulse' : ''}`} />
                  {service.status}
                </span>
              </div>
              <div className="text-xs text-text-muted">
                {service.responseTimeMs}ms · {new Date(service.lastChecked).toLocaleTimeString('cs-CZ')}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}