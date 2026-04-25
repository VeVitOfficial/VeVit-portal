import { useTranslation } from 'react-i18next'

const ROADMAP_ITEMS = {
  planning: [
    { title: 'VeVibe Community Platform', eta: 'Q3 2026' },
    { title: 'Mobile PWA', eta: 'Q4 2026' },
    { title: 'Real-time Chat', eta: '2027' },
  ],
  inProgress: [
    { title: 'Premium Subscriptions', eta: 'Q2 2026' },
    { title: 'XP Store', eta: 'Q2 2026' },
  ],
  done: [
    { title: 'SSO Auth System', eta: 'Done' },
    { title: 'VPS Migration', eta: 'Done' },
    { title: 'Portal v2 Rewrite', eta: 'Done' },
  ],
}

export default function Roadmap() {
  const { t } = useTranslation()

  const columns = [
    { key: 'planning', items: ROADMAP_ITEMS.planning, color: 'border-warn' },
    { key: 'inProgress', items: ROADMAP_ITEMS.inProgress, color: 'border-info' },
    { key: 'done', items: ROADMAP_ITEMS.done, color: 'border-accent' },
  ]

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-text-pri mb-8">{t('roadmap.title')}</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {columns.map((col) => (
            <div key={col.key}>
              <h2 className="text-lg font-semibold text-text-pri mb-4 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full border-2 ${col.color}`} />
                {t(`roadmap.${col.key}`)}
              </h2>
              <div className="space-y-3">
                {col.items.map((item) => (
                  <div key={item.title}
                    className="p-4 rounded-[16px] bg-bg-card border border-[var(--border-default)]
                      hover:border-[var(--border-hover)] transition-colors">
                    <p className="text-sm font-medium text-text-pri mb-1">{item.title}</p>
                    <p className="text-xs text-text-muted">{item.eta}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}