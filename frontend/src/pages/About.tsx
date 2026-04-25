import { useTranslation } from 'react-i18next'
import { Shield, Heart, Zap } from 'lucide-react'

const TIMELINE = [
  { year: '2023', label: 'VeVit v1 launched on Wedos' },
  { year: '2024', label: 'Tools, Games, Edu subdomains go live' },
  { year: '2025', label: 'VPS migration, SSO, XP system, v2 rewrite' },
  { year: '2026', label: 'Premium, VeVibe community, mobile PWA' },
]

export default function About() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-text-pri mb-4">{t('about.title')}</h1>
        <p className="text-text-sec max-w-2xl mb-12">{t('about.mission')}</p>

        {/* Timeline */}
        <div className="relative border-l-2 border-[var(--border-default)] ml-4 mb-16">
          {TIMELINE.map((item) => (
            <div key={item.year} className="relative pl-8 pb-8">
              <div className="absolute -left-2.5 top-0 w-5 h-5 rounded-full bg-accent border-4 border-bg-base" />
              <p className="text-accent font-semibold text-sm mb-1">{item.year}</p>
              <p className="text-text-sec">{item.label}</p>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Shield, title: t('features.dataInCz'), desc: t('features.dataInCzDesc') },
            { icon: Heart, title: t('features.noAds'), desc: '' },
            { icon: Zap, title: t('features.xpSystem'), desc: '' },
          ].map((f, i) => (
            <div key={i} className="p-6 rounded-[16px] bg-bg-card border border-[var(--border-default)]">
              <f.icon className="w-8 h-8 text-accent mb-4" strokeWidth={1.5} />
              <h3 className="text-base font-semibold text-text-pri mb-2">{f.title}</h3>
              {f.desc && <p className="text-sm text-text-muted">{f.desc}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}