import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Gamepad2, Wrench, GraduationCap, Briefcase,
  ShoppingBag, User, Users, Search,
  ArrowRight, TrendingUp
} from 'lucide-react'

interface AppCard {
  id: string
  icon: React.ElementType
  titleKey: string
  descKey: string
  href: string
  status: 'online' | 'soon'
  featured?: boolean
  colSpan?: string
  accent?: boolean
  extra?: string
}

const APPS: AppCard[] = [
  { id: 'games', icon: Gamepad2, titleKey: 'bento.games', descKey: 'bento.gamesDesc', href: 'https://games.vevit.fun', status: 'online', featured: true, colSpan: 'md:col-span-2', accent: true, extra: '127' },
  { id: 'tools', icon: Wrench, titleKey: 'bento.tools', descKey: 'bento.toolsDesc', href: 'https://tools.vevit.fun', status: 'online', featured: true, colSpan: 'md:col-span-2' },
  { id: 'edu', icon: GraduationCap, titleKey: 'bento.edu', descKey: 'bento.eduDesc', href: 'https://edu.vevit.fun', status: 'online' },
  { id: 'services', icon: Briefcase, titleKey: 'bento.services', descKey: '', href: 'https://services.vevit.fun', status: 'online', colSpan: 'md:col-span-2' },
  { id: 'store', icon: ShoppingBag, titleKey: 'bento.store', descKey: '', href: 'https://store.vevit.fun', status: 'soon' },
  { id: 'account', icon: User, titleKey: 'bento.account', descKey: '', href: 'https://account.vevit.fun', status: 'online' },
  { id: 'vevibe', icon: Users, titleKey: 'bento.vevibe', descKey: '', href: '#', status: 'soon' },
  { id: 'search', icon: Search, titleKey: 'bento.search', descKey: '', href: 'https://search.vevit.fun', status: 'online' },
]

export default function BentoGrid() {
  const { t } = useTranslation()

  return (
    <section id="apps" className="py-16 px-4 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-text-pri mb-2">{t('bento.title')}</h2>
          <p className="text-sm text-text-muted">{t('bento.subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
          {APPS.map((app, i) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className={`${app.colSpan || ''} group`}
            >
              <a
                href={app.status === 'soon' ? undefined : app.href}
                target={app.status === 'soon' ? undefined : '_blank'}
                rel="noopener noreferrer"
                className={`block h-full p-6 rounded-[16px] bg-bg-card border
                  ${app.accent ? 'border-accent/20' : 'border-[var(--border-default)]'}
                  hover:border-[var(--border-hover)] hover:-translate-y-0.5
                  ${app.status === 'soon' ? 'opacity-60 cursor-not-allowed grayscale' : 'hover:shadow-[var(--shadow-glow)]'}
                  transition-all duration-200`}
              >
                {/* Icon */}
                <div className={`p-2.5 rounded-lg mb-4 w-fit
                  ${app.accent ? 'bg-accent/10' : 'bg-bg-raised'}`}>
                  <app.icon className={`w-10 h-10 ${app.accent ? 'text-accent' : 'text-text-sec'}`} strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-text-pri mb-1 group-hover:text-accent transition-colors">
                  {t(app.titleKey)}
                </h3>

                {/* Description */}
                {app.descKey && t(app.descKey) && (
                  <p className="text-sm text-text-muted mb-4">{t(app.descKey)}</p>
                )}

                {/* Status + CTA */}
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${app.status === 'online' ? 'bg-accent animate-pulse' : 'bg-warn'}`} />
                    <span className="text-xs font-medium text-text-muted">
                      {app.status === 'online' ? t('bento.online') : t('bento.soon')}
                    </span>
                  </div>
                  {app.status === 'online' && (
                    <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-accent
                      group-hover:translate-x-1 transition-all" strokeWidth={1.5} />
                  )}
                </div>

                {/* Extra stat for Games */}
                {app.extra && (
                  <div className="flex items-center gap-1.5 mt-3 text-sm text-text-muted">
                    <TrendingUp className="w-4 h-4" strokeWidth={1.5} />
                    {t('bento.activityToday', { count: app.extra })}
                  </div>
                )}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}