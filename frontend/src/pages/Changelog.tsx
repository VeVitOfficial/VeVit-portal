import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { api } from '../lib/api'

interface ChangelogEntry {
  id: number
  subdomain: string
  version: string | null
  title: string
  body_md: string | null
  kind: string
  published_at: string
}

const KIND_COLORS: Record<string, string> = {
  feature: 'text-accent',
  fix: 'text-warn',
  improvement: 'text-info',
  security: 'text-danger',
}

const SUBDOMAINS = ['all', 'games', 'tools', 'edu', 'portal', 'account', 'services']

export default function Changelog() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<ChangelogEntry[]>([])
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    api.changelog(filter, 50).then(setEntries).catch(() => {})
  }, [filter])

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-text-pri mb-8">{t('nav.changelog')}</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {SUBDOMAINS.map((sub) => (
            <button key={sub} onClick={() => setFilter(sub)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                ${filter === sub
                  ? 'bg-accent/10 text-accent border border-accent/30'
                  : 'bg-bg-card border border-[var(--border-default)] text-text-muted hover:text-text-pri'}`}>
              {sub === 'all' ? 'All' : sub}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="space-y-4">
          {entries.map((entry) => (
            <div key={entry.id}
              className="p-5 rounded-[16px] bg-bg-card border border-[var(--border-default)]
                hover:border-[var(--border-hover)] transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-semibold uppercase ${KIND_COLORS[entry.kind] || 'text-text-muted'}`}>
                  {entry.kind}
                </span>
                <span className="text-xs text-text-muted">·</span>
                <span className="text-xs text-text-muted">{entry.subdomain}</span>
                {entry.version && (
                  <>
                    <span className="text-xs text-text-muted">·</span>
                    <span className="text-xs text-text-muted">{entry.version}</span>
                  </>
                )}
              </div>
              <h3 className="text-base font-semibold text-text-pri mb-1">{entry.title}</h3>
              {entry.body_md && (
                <p className="text-sm text-text-muted line-clamp-3">{entry.body_md}</p>
              )}
              <p className="text-xs text-text-muted mt-2">
                {new Date(entry.published_at).toLocaleDateString('cs-CZ')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}