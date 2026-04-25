import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '../store/themeStore'
import { useAuthStore } from '../store/authStore'
import { useI18nStore, type Lang } from '../store/i18nStore'
import {
  Sun, Moon, Globe, Menu, X, Search, ChevronDown,
  Gamepad2, Wrench, GraduationCap, Briefcase, ShoppingBag,
  Users, User, LogOut, Sparkles
} from 'lucide-react'

const LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'cs', label: 'CS' },
  { code: 'en', label: 'EN' },
  { code: 'de', label: 'DE' },
  { code: 'es', label: 'ES' },
  { code: 'uk', label: 'UK' },
]

export default function Navbar() {
  const { t } = useTranslation()
  const location = useLocation()
  const { toggle: toggleTheme, isDisco } = useThemeStore()
  const { user, isLoggedIn, logout } = useAuthStore()
  const { language, setLanguage } = useI18nStore()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const langRef = useRef<HTMLDivElement>(null)
  const userRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false)
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const navLinks = [
    { to: '/#apps', label: t('nav.apps') },
    { to: '/about', label: t('nav.about') },
    { to: '/roadmap', label: t('nav.roadmap') },
    { to: '/changelog', label: t('nav.changelog') },
    { to: '/contact', label: t('nav.contact') },
  ]

  const avatarUrl = user?.avatar_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.nickname || 'U')}&background=1e1e1e&color=9ca3af&bold=true`

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 h-16 border-b transition-all duration-300
      ${scrolled
        ? 'bg-bg-base/80 backdrop-blur-xl border-[var(--border-default)]'
        : 'bg-transparent border-transparent'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center
            group-hover:bg-accent/20 transition-colors">
            <Sparkles className="w-5 h-5 text-accent" strokeWidth={1.5} />
          </div>
          <span className="text-xl font-semibold text-text-pri tracking-tight">VeVit</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="relative px-4 py-2 text-sm font-medium text-text-sec hover:text-text-pri transition-colors
                after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:h-[2px] after:w-0
                hover:after:w-3/4 after:bg-accent after:rounded-full after:transition-all"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button className="p-2 rounded-lg text-text-sec hover:text-text-pri hover:bg-bg-raised transition-colors"
            title="⌘K">
            <Search className="w-5 h-5" strokeWidth={1.5} />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-text-sec hover:text-accent hover:bg-bg-raised transition-colors"
            disabled={isDisco}
          >
            {useThemeStore.getState().theme === 'dark'
              ? <Sun className="w-5 h-5" strokeWidth={1.5} />
              : <Moon className="w-5 h-5" strokeWidth={1.5} />}
          </button>

          {/* Language */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium
                text-text-sec hover:text-text-pri hover:bg-bg-raised transition-colors"
            >
              <Globe className="w-4 h-4" strokeWidth={1.5} />
              <span className="uppercase">{language}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-2 w-36 bg-bg-card border border-[var(--border-default)]
                rounded-xl shadow-lg overflow-hidden z-50">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => { setLanguage(lang.code); setLangOpen(false) }}
                    className={`w-full px-4 py-2.5 text-sm text-left transition-colors
                      ${language === lang.code
                        ? 'bg-accent/10 text-accent'
                        : 'text-text-sec hover:bg-bg-raised hover:text-text-pri'}`}
                  >
                    <Globe className="w-4 h-4 inline mr-2" strokeWidth={1.5} />
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Auth */}
          {isLoggedIn && user ? (
            <div ref={userRef} className="relative">
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-bg-raised transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-bg-raised border border-[var(--border-default)]
                  overflow-hidden flex items-center justify-center">
                  {user.avatar_url ? (
                    <img src={user.avatar_url} alt={user.nickname} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-semibold text-text-sec">{user.nickname?.[0]?.toUpperCase()}</span>
                  )}
                </div>
                <span className="hidden lg:inline text-sm font-medium text-text-pri">{user.nickname}</span>
                <span className="hidden lg:inline text-xs font-bold text-accent">Lv.{user.level}</span>
              </button>
              {userOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-bg-card border border-[var(--border-default)]
                  rounded-xl shadow-lg overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-[var(--border-default)]">
                    <p className="text-sm font-semibold text-text-pri">{user.nickname}</p>
                    <p className="text-xs text-text-muted">{user.email}</p>
                  </div>
                  <a href="https://account.vevit.fun/profile"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-text-sec hover:bg-bg-raised hover:text-text-pri transition-colors">
                    <User className="w-4 h-4" strokeWidth={1.5} />
                    Můj profil
                  </a>
                  <button onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-danger hover:bg-danger/10 transition-colors text-left">
                    <LogOut className="w-4 h-4" strokeWidth={1.5} />
                    Odhlásit se
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <a href="https://account.vevit.fun/login"
                className="px-4 py-2 text-sm font-medium text-text-sec hover:text-text-pri transition-colors">
                {t('nav.login')}
              </a>
              <a href="https://account.vevit.fun/register"
                className="px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent-h
                  rounded-[10px] transition-colors">
                {t('nav.register')}
              </a>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-text-sec hover:text-text-pri transition-colors"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-bg-base/95 backdrop-blur-xl z-40">
          <div className="p-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block px-4 py-3 text-base font-medium text-text-sec hover:text-text-pri
                  hover:bg-bg-raised rounded-xl transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {!isLoggedIn && (
              <div className="pt-4 mt-4 border-t border-[var(--border-default)]">
                <a href="https://account.vevit.fun/register"
                  className="block w-full text-center px-4 py-3 bg-accent hover:bg-accent-h text-white
                    font-medium rounded-xl transition-colors">
                  {t('nav.register')}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}