import { useTranslation } from 'react-i18next'
import ContactNewsletter from '../components/ContactNewsletter'
import { Mail, MessageCircle } from 'lucide-react'

export default function Contact() {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-text-pri mb-4">{t('nav.contact')}</h1>
        <p className="text-text-sec mb-12">{t('contact.subtitle')}</p>

        {/* Contact info */}
        <div className="p-6 rounded-[16px] bg-bg-card border border-[var(--border-default)] mb-8">
          <div className="flex items-start gap-3 mb-4">
            <Mail className="w-5 h-5 text-accent" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-medium text-text-pri">Email</p>
              <a href="mailto:info@vevit.fun" className="text-sm text-text-sec hover:text-accent transition-colors">
                info@vevit.fun
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-accent" strokeWidth={1.5} />
            <div>
              <p className="text-sm font-medium text-text-pri">Discord</p>
              <a href="https://discord.gg/3X7H4xd8" target="_blank" rel="noopener noreferrer"
                className="text-sm text-text-sec hover:text-accent transition-colors">
                discord.gg/3X7H4xd8
              </a>
            </div>
          </div>
        </div>

        <ContactNewsletter />
      </div>
    </div>
  )
}