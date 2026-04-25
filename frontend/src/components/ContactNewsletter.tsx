import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Mail, Send, CheckCircle, Loader2 } from 'lucide-react'
import { api } from '../lib/api'

export default function ContactNewsletter() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-4">
        <ContactForm />
        <NewsletterBox />
      </div>
    </section>
  )
}

function ContactForm() {
  const { t } = useTranslation()
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      subject: (form.elements.namedItem('subject') as HTMLInputElement)?.value || undefined,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
      honeypot: (form.elements.namedItem('website') as HTMLInputElement)?.value || undefined,
    }
    try {
      await api.contact(data)
      setStatus('success')
      form.reset()
      setTimeout(() => setStatus('idle'), 5000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  return (
    <div className="md:col-span-3 p-8 rounded-[16px] bg-bg-card border border-[var(--border-default)]">
      <h2 className="text-2xl font-semibold text-text-pri mb-2">{t('contact.title')}</h2>
      <p className="text-sm text-text-muted mb-6">{t('contact.subtitle')}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Honeypot */}
        <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-sec mb-1.5">{t('contact.name')}</label>
            <input name="name" required
              className="w-full px-4 py-2.5 rounded-[6px] bg-bg-base border border-[var(--border-default)]
                text-text-pri placeholder-text-muted focus:border-accent focus:outline-none transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-sec mb-1.5">{t('contact.email')}</label>
            <input name="email" type="email" required
              className="w-full px-4 py-2.5 rounded-[6px] bg-bg-base border border-[var(--border-default)]
                text-text-pri placeholder-text-muted focus:border-accent focus:outline-none transition-colors" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-sec mb-1.5">{t('contact.subjectOptional')}</label>
          <input name="subject"
            className="w-full px-4 py-2.5 rounded-[6px] bg-bg-base border border-[var(--border-default)]
              text-text-pri placeholder-text-muted focus:border-accent focus:outline-none transition-colors" />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-sec mb-1.5">{t('contact.message')}</label>
          <textarea name="message" rows={4} required
            className="w-full px-4 py-2.5 rounded-[6px] bg-bg-base border border-[var(--border-default)]
              text-text-pri placeholder-text-muted focus:border-accent focus:outline-none transition-colors resize-none" />
        </div>

        <button type="submit" disabled={status === 'sending'}
          className="w-full py-3 rounded-[10px] bg-accent hover:bg-accent-h text-white font-medium
            transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
          {status === 'sending' && <Loader2 className="w-4 h-4 animate-spin" />}
          {status === 'success' && <CheckCircle className="w-4 h-4" />}
          {status === 'idle' && <Send className="w-4 h-4" />}
          {status === 'sending' ? t('contact.sending') :
           status === 'success' ? t('contact.success') : t('contact.send')}
        </button>
      </form>
    </div>
  )
}

function NewsletterBox() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [lang, setLang] = useState('cs')
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      await api.newsletterSubscribe({ email, language: lang })
      setStatus('success')
    } catch {
      setStatus('idle')
    }
  }

  return (
    <div className="md:col-span-2 p-8 rounded-[16px] bg-bg-card border border-[var(--border-default)]
      flex flex-col items-center justify-center text-center">
      <Mail className="w-8 h-8 text-accent mb-4" strokeWidth={1.5} />
      <h2 className="text-xl font-semibold text-text-pri mb-2">{t('newsletter.title')}</h2>
      <p className="text-sm text-text-muted mb-6">{t('newsletter.subtitle')}</p>

      {status === 'success' ? (
        <p className="text-accent text-sm">{t('newsletter.checkEmail')}</p>
      ) : (
        <form onSubmit={handleSubmit} className="w-full space-y-3">
          <div className="flex gap-2">
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required
              placeholder={t('newsletter.placeholder')}
              className="flex-1 px-4 py-2.5 rounded-[6px] bg-bg-base border border-[var(--border-default)]
                text-text-pri placeholder-text-muted focus:border-accent focus:outline-none transition-colors text-sm" />
            <select value={lang} onChange={(e) => setLang(e.target.value)}
              className="px-3 py-2.5 rounded-[6px] bg-bg-base border border-[var(--border-default)]
                text-text-pri focus:border-accent focus:outline-none transition-colors text-sm">
              {['cs', 'en', 'de', 'es', 'uk'].map((l) => (
                <option key={l} value={l}>{l.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={status === 'sending'}
            className="w-full py-2.5 rounded-[10px] bg-accent hover:bg-accent-h text-white text-sm
              font-medium transition-colors disabled:opacity-50">
            {t('newsletter.subscribe')}
          </button>
        </form>
      )}
    </div>
  )
}