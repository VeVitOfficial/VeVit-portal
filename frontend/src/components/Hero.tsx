import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Sparkles, ArrowRight, Shield, Check } from 'lucide-react'
import type { User } from '../store/authStore'

interface HeroProps {
  isLoggedIn: boolean
  user: User | null
}

export default function Hero({ isLoggedIn, user }: HeroProps) {
  const { t } = useTranslation()

  if (isLoggedIn && user) {
    return <PersonalizedHero user={user} />
  }
  return <MarketingHero />
}

function MarketingHero() {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-[560px] pt-24 pb-16 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-5 gap-12 items-center">
        {/* Text — 60% */}
        <div className="lg:col-span-3 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-glow text-accent
              text-xs font-medium mb-6">
              <Sparkles className="w-4 h-4" strokeWidth={1.5} />
              {t('hero.pill')}
            </div>

            <h1 className="text-5xl sm:text-6xl font-bold text-text-pri tracking-tight leading-[1.1] mb-4">
              {t('hero.title')}
            </h1>

            <p className="text-lg text-text-sec leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              {t('hero.subtitle')}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-6">
              <a href="https://account.vevit.fun/register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-[10px] bg-accent hover:bg-accent-h text-white
                  font-medium transition-colors flex items-center justify-center gap-2">
                {t('hero.ctaPrimary')}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#apps"
                className="w-full sm:w-auto px-8 py-3.5 rounded-[10px] border border-[var(--border-default)]
                  hover:border-accent/50 text-text-pri font-medium transition-colors">
                {t('hero.ctaSecondary')}
              </a>
            </div>

            {/* Trust row */}
            <p className="text-sm text-text-muted">
              {t('hero.trust').split('·').map((item, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 mr-3">
                  <Check className="w-3 h-3 text-accent" />
                  {item.trim()}
                </span>
              ))}
            </p>
          </motion.div>
        </div>

        {/* Constellation visual — 40% */}
        <div className="lg:col-span-2 flex items-center justify-center">
          <ConstellationVisual />
        </div>
      </div>
    </section>
  )
}

function PersonalizedHero({ user }: { user: User }) {
  const { t } = useTranslation()

  return (
    <section className="relative min-h-[320px] pt-24 pb-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-4xl font-bold text-text-pri mb-2">
            {t('hero.welcomeBack', { nickname: user.nickname })}
          </h1>
          <p className="text-text-muted mb-8">
            {t('hero.userStats', { xp: user.xp, level: user.level, timeAgo: '5 min' })}
          </p>

          {/* Continue strip */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Course card */}
            <div className="p-5 rounded-[16px] bg-bg-card border border-accent/30 col-span-1 md:col-span-2">
              <p className="text-text-pri font-medium mb-2">{t('hero.continueCourse', { course: 'Python' })}</p>
              <div className="w-full h-2 bg-bg-raised rounded-full mb-2 overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: '38%' }} />
              </div>
              <p className="text-xs text-text-muted mb-3">23 / 60 lekcí</p>
              <a href="https://edu.vevit.fun/python"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-accent hover:bg-accent-h
                  text-white text-sm font-medium transition-colors">
                {t('hero.continueCourseCta')}
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Record card */}
            <div className="p-5 rounded-[16px] bg-bg-card border border-[var(--border-default)]">
              <p className="text-text-pri font-medium mb-2">{t('hero.yourRecord', { game: 'Tetris', score: '12 400' })}</p>
              <a href="https://games.vevit.fun/tetris"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-[10px] bg-bg-raised
                  border border-[var(--border-default)] text-text-pri text-sm font-medium hover:border-accent/50 transition-colors">
                {t('hero.beatRecord')}
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function ConstellationVisual() {
  const satellites = [
    { label: 'Hry', icon: '🎮', href: 'https://games.vevit.fun' },
    { label: 'Tools', icon: '🔧', href: 'https://tools.vevit.fun' },
    { label: 'Edu', icon: '🎓', href: 'https://edu.vevit.fun' },
    { label: 'Services', icon: '💼', href: 'https://services.vevit.fun' },
    { label: 'Store', icon: '🛍️', href: 'https://store.vevit.fun' },
    { label: 'Account', icon: '👤', href: 'https://account.vevit.fun' },
  ]

  return (
    <motion.div
      className="relative w-72 h-72"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {/* Center logo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20
        rounded-full bg-accent/10 border border-accent/30 flex items-center justify-center
        shadow-[var(--shadow-glow)]">
        <span className="text-2xl font-bold text-accent">V</span>
      </div>

      {/* Satellites */}
      {satellites.map((sat, i) => {
        const angle = (i / satellites.length) * Math.PI * 2 - Math.PI / 2
        const radius = 110
        const x = Math.cos(angle) * radius + 136 - 24
        const y = Math.sin(angle) * radius + 136 - 24

        return (
          <motion.a
            key={sat.label}
            href={sat.href}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute w-12 h-12 rounded-full bg-bg-card border border-[var(--border-default)]
              flex items-center justify-center text-lg hover:border-accent/50 transition-colors"
            style={{ left: x, top: y }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
            title={sat.label}
          >
            {sat.icon}
          </motion.a>
        )
      })}

      {/* Connection lines SVG */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 272 272">
        {satellites.map((_, i) => {
          const angle = (i / satellites.length) * Math.PI * 2 - Math.PI / 2
          const radius = 110
          const x = Math.cos(angle) * radius + 136
          const y = Math.sin(angle) * radius + 136
          return (
            <line key={i} x1="136" y1="136" x2={x} y2={y}
              stroke="rgba(16,185,129,0.15)" strokeWidth="1" strokeDasharray="4 4" />
          )
        })}
      </svg>
    </motion.div>
  )
}