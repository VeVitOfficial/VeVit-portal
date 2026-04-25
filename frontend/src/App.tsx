import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useThemeStore } from './store/themeStore'
import { useI18nStore } from './store/i18nStore'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import Changelog from './pages/Changelog'
import Roadmap from './pages/Roadmap'
import Status from './pages/Status'
import Support from './pages/Support'
import Legal from './pages/Legal'
import VCard from './pages/VCard'

export default function App() {
  const theme = useThemeStore((s) => s.theme)
  const initTheme = useThemeStore((s) => s.init)
  const initI18n = useI18nStore((s) => s.init)

  useEffect(() => {
    initTheme()
    initI18n()
  }, [initTheme, initI18n])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <div className="min-h-screen flex flex-col bg-bg-base text-text-pri font-sora">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/status" element={<Status />} />
          <Route path="/support" element={<Support />} />
          <Route path="/legal/terms" element={<Legal page="terms" />} />
          <Route path="/legal/privacy" element={<Legal page="privacy" />} />
          <Route path="/legal/cookies" element={<Legal page="cookies" />} />
          <Route path="/vcard/:nickname" element={<VCard />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}