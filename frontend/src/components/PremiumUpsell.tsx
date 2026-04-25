import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Crown, ArrowRight } from 'lucide-react'

export default function PremiumUpsell() {
  const { t } = useTranslation()

  const plans = [
    { name: 'Bronze', price: t('premium.bronze') },
    { name: 'Silver', price: t('premium.silver') },
    { name: 'Gold', price: t('premium.gold') },
  ]

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-[16px] bg-bg-card border border-[var(--border-default)] p-8
            grid grid-cols-1 md:grid-cols-5 gap-8 items-center"
        >
          {/* Left — text */}
          <div className="md:col-span-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent
              text-xs font-medium mb-4">
              <Crown className="w-4 h-4" strokeWidth={1.5} />
              {t('premium.pill')}
            </div>
            <h2 className="text-2xl font-semibold text-text-pri mb-3">{t('premium.title')}</h2>
            <p className="text-text-sec mb-6">{t('premium.body')}</p>
            <a href="https://account.vevit.fun/premium"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-[10px] bg-accent hover:bg-accent-h
                text-white font-medium transition-colors">
              {t('premium.cta')}
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Right — plan chips */}
          <div className="md:col-span-2 flex flex-col gap-3">
            {plans.map((plan) => (
              <div key={plan.name}
                className="flex items-center justify-between px-5 py-3 rounded-xl bg-bg-raised
                  border border-[var(--border-default)]">
                <span className="text-sm font-medium text-text-pri">{plan.name}</span>
                <span className="text-sm text-text-muted">{plan.price}</span>
              </div>
            ))}
            <p className="text-xs text-text-muted mt-1">{t('premium.note')}</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}