import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Shield, Heart, Zap, Code, Users } from 'lucide-react'

export default function Features() {
  const { t } = useTranslation()

  const smallCards = [
    { icon: Heart, label: t('features.noAds') },
    { icon: Zap, label: t('features.xpSystem') },
    { icon: Code, label: t('features.openSource') },
    { icon: Users, label: t('features.oneAccount') },
  ]

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-text-pri mb-8">{t('features.title')}</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Large card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-3 md:row-span-2 p-8 rounded-[16px] bg-bg-card border border-[var(--border-default)]"
          >
            <Shield className="w-12 h-12 text-accent mb-6" strokeWidth={1.5} />
            <h3 className="text-xl font-semibold text-text-pri mb-3">{t('features.dataInCz')}</h3>
            <p className="text-text-sec leading-relaxed">{t('features.dataInCzDesc')}</p>
          </motion.div>

          {/* Small cards */}
          {smallCards.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i + 1) * 0.1 }}
              className="md:col-span-1 p-6 rounded-[16px] bg-bg-card border border-[var(--border-default)]
                flex flex-col items-start gap-3"
            >
              <card.icon className="w-8 h-8 text-accent" strokeWidth={1.5} />
              <p className="text-sm font-medium text-text-pri">{card.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}