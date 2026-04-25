import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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
  feature: 'bg-accent text-accent',
  fix: 'bg-warn text-warn',
  improvement: 'bg-info text-info',
  security: 'bg-danger text-danger',
}

export default function ChangelogTeaser() {
  const { t } = useTranslation()
  const [entries, setEntries] = useState<ChangelogEntry[]>([])

  useEffect(() => {
    api.changelog('all', 3).then(setEntries).catch(() => {})
  }, [])

  if (entries.length === 0) return null

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xl font-semibold text-text-pri">{t('changelogTeaser.title')}</h2>
          <Link to="/changelog"
            className="text-sm text-text-muted hover:text-accent transition-colors">
            {t('changelogTeaser.viewAll')} &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {entries.map((entry) => (
            <div key={entry.id}
              className="p-6 rounded-[16px] bg-bg-card border border-[var(--border-default)]
                hover:border-[var(--border-hover)] transition-colors">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium
                  ${KIND_COLORS[entry.kind] || 'bg-bg-raised text-text-muted'}`}>
                  {entry.kind}
                </span>
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-bg-raised text-text-muted">
                  {entry.subdomain}
                </span>
              </div>
              <h3 className="text-base font-semibold text-text-pri mb-2 line-clamp-1">{entry.title}</h3>
              {entry.body_md && (
                <p className="text-sm text-text-muted line-clamp-3 mb-3">{entry.body_md}</p>
              )}
              <p className="text-xs text-text-muted">
                {new Date(entry.published_at).toLocaleDateString('cs-CZ')}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}