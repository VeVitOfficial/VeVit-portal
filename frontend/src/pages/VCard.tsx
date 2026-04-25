import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Download, Share2, Mail, MessageCircle } from 'lucide-react'

interface UserProfile {
  nickname: string
  full_name?: string
  avatar_url?: string
  level: number
  xp: number
}

export default function VCard() {
  const { nickname } = useParams<{ nickname: string }>()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [shared, setShared] = useState(false)

  useEffect(() => {
    if (!nickname) return
    fetch(`/api/v2/portal/vcard/${nickname}`)
      .then((r) => r.json())
      .then((data) => setProfile(data))
      .catch(() => {})
  }, [nickname])

  const handleDownload = () => {
    if (!profile) return
    const vcf = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${profile.full_name || profile.nickname}`,
      `NICKNAME:${profile.nickname}`,
      profile.avatar_url ? `PHOTO;VALUE=URI:${profile.avatar_url}` : '',
      'URL:https://vevit.fun',
      'END:VCARD',
    ].filter(Boolean).join('\n')

    const blob = new Blob([vcf], { type: 'text/vcard;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${profile.nickname}.vcf`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    const url = window.location.href
    if (navigator.share) {
      await navigator.share({ title: profile?.nickname || 'VeVit', url })
    } else {
      await navigator.clipboard.writeText(url)
      setShared(true)
      setTimeout(() => setShared(false), 2000)
    }
  }

  if (!profile) {
    return (
      <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted">Profil nenalezen</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="p-8 rounded-[16px] bg-bg-card border border-[var(--border-default)]">
          {/* Avatar */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 rounded-full bg-bg-raised border border-[var(--border-default)]
              overflow-hidden mb-4 flex items-center justify-center">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.nickname} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-bold text-text-muted">{profile.nickname[0].toUpperCase()}</span>
              )}
            </div>
            <h2 className="text-xl font-semibold text-text-pri">{profile.full_name || profile.nickname}</h2>
            <p className="text-accent text-sm font-medium">Lv.{profile.level}</p>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={handleDownload}
              className="flex items-center justify-center gap-2 py-3 rounded-[10px] bg-accent hover:bg-accent-h
                text-white font-medium transition-colors">
              <Download className="w-4 h-4" />
              Uložit kontakt
            </button>
            <button onClick={handleShare}
              className="flex items-center justify-center gap-2 py-3 rounded-[10px] bg-bg-raised
                border border-[var(--border-default)] text-text-pri font-medium
                hover:border-[var(--border-hover)] transition-colors">
              {shared ? 'Zkopírováno!' : <><Share2 className="w-4 h-4" /> Sdílet</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}