import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Github, MessageCircle, Instagram, Mail, Heart } from 'lucide-react'

export default function Footer() {
  const { t } = useTranslation()

  const platformLinks = [
    { label: 'Hry', href: 'https://games.vevit.fun' },
    { label: 'Nástroje', href: 'https://tools.vevit.fun' },
    { label: 'Edu', href: 'https://edu.vevit.fun' },
    { label: 'Store', href: 'https://store.vevit.fun' },
    { label: 'Services', href: 'https://services.vevit.fun' },
  ]

  const supportLinks = [
    { label: t('nav.contact'), to: '/contact' },
    { label: 'FAQ', to: '/contact#faq' },
    { label: t('status.title'), to: '/status' },
    { label: t('nav.changelog'), to: '/changelog' },
    { label: t('nav.roadmap'), to: '/roadmap' },
  ]

  const legalLinks = [
    { label: t('nav.about'), to: '/about' },
    { label: t('footer.terms'), to: '/legal/terms' },
    { label: t('footer.privacy'), to: '/legal/privacy' },
    { label: t('footer.cookies'), to: '/legal/cookies' },
    { label: t('footer.gdpr'), to: '/legal/privacy#gdpr' },
  ]

  const socials = [
    { icon: MessageCircle, href: 'https://discord.gg/3X7H4xd8', label: 'Discord' },
    { icon: Github, href: 'https://github.com/vevit-fun', label: 'GitHub' },
    { icon: Instagram, href: 'https://instagram.com/vevit.fun', label: 'Instagram' },
    { icon: Mail, href: 'mailto:info@vevit.fun', label: 'Email' },
  ]

  return (
    <footer className="mt-24 bg-[#0a0a0a] dark:bg-[#0a0a0a] border-t border-[var(--border-default)] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                <span className="text-accent font-bold text-sm">V</span>
              </div>
              <span className="text-lg font-semibold text-text-pri">VeVit</span>
            </div>
            <p className="text-sm text-text-muted leading-relaxed mb-4">{t('footer.desc')}</p>
            <div className="flex gap-2">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-bg-card border border-[var(--border-default)]
                    text-text-muted hover:text-text-pri hover:border-[var(--border-hover)] transition-colors"
                  aria-label={s.label}>
                  <s.icon className="w-4 h-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-text-pri mb-4">{t('footer.platforma')}</h4>
            <ul className="space-y-2">
              {platformLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-text-muted hover:text-text-pri transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-text-pri mb-4">{t('footer.podpora')}</h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="text-sm text-text-muted hover:text-text-pri transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-text-pri mb-4">{t('footer.firemní')}</h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}
                    className="text-sm text-text-muted hover:text-text-pri transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href="https://ko-fi.com/F1F41UHFTK" target="_blank" rel="noopener noreferrer"
                  className="text-sm text-text-muted hover:text-accent transition-colors">
                  Ko-fi
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-[var(--border-default)] pt-8 flex flex-col sm:flex-row items-center
          justify-between gap-4">
          <p className="text-sm text-text-muted">{t('footer.copyright')}</p>
          <p className="text-sm text-text-muted flex items-center gap-1">
            Vytvořeno s <Heart className="w-3 h-3 text-danger fill-danger" /> v ČR
          </p>
        </div>
      </div>
    </footer>
  )
}