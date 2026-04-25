import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Activity, ChevronDown, ChevronUp } from 'lucide-react'
import { api } from '../lib/api'
import { getSocket } from '../lib/socket'

interface ActivityItem {
  id: number
  kind: string
  user_nickname: string | null
  user_avatar: string | null
  payload: Record<string, unknown>
  created_at: string
}

export default function ActivityFeed() {
  const { t } = useTranslation()
  const [visible, setVisible] = useState(true)
  const [items, setItems] = useState<ActivityItem[]>([])

  useEffect(() => {
    api.activity(20).then(setItems).catch(() => {})
  }, [])

  useEffect(() => {
    const socket = getSocket()
    const onNew = (item: ActivityItem) => {
      setItems((prev) => [item, ...prev].slice(0, 50))
    }
    socket.on('activity:new', onNew)
    return () => { socket.off('activity:new', onNew) }
  }, [])

  const formatTimeAgo = (dateStr: string) => {
    const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000)
    return t('activity.timeAgo', { minutes: diff })
  }

  const getEventText = (item: ActivityItem) => {
    const p = item.payload
    const nick = item.user_nickname || t('activity.anonymous')
    switch (item.kind) {
      case 'level_up': return t('activity.levelUp', { nickname: nick, level: p.level })
      case 'game_highscore': return t('activity.highscore', { nickname: nick, game: p.game_slug, score: p.score })
      case 'lesson_completed': return t('activity.lessonCompleted', { nickname: nick, lesson: p.lesson, course: p.course_slug })
      case 'course_started': return t('activity.courseStarted', { nickname: nick, course: p.course_slug })
      case 'tool_used': return t('activity.toolUsed', { nickname: nick, tool: p.tool })
      default: return `${nick} — ${item.kind}`
    }
  }

  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-text-pri">{t('activity.title')}</h2>
            <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-accent/10 text-xs font-medium text-accent">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Live
            </span>
          </div>
          <button
            onClick={() => setVisible(!visible)}
            className="flex items-center gap-1 text-sm text-text-muted hover:text-text-pri transition-colors"
          >
            {visible ? t('activity.hide') : t('activity.show')}
            {visible ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

        <AnimatePresence>
          {visible && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex-shrink-0 min-w-[280px] p-4 rounded-xl bg-bg-raised
                      border border-[var(--border-default)]"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-7 h-7 rounded-full bg-bg-card flex items-center justify-center overflow-hidden">
                        {item.user_avatar ? (
                          <img src={item.user_avatar} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-xs font-semibold text-text-muted">
                            {(item.user_nickname || 'A')[0].toUpperCase()}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-medium text-text-pri truncate">
                        {item.user_nickname || t('activity.anonymous')}
                      </span>
                    </div>
                    <p className="text-sm text-text-sec mb-1 line-clamp-2">{getEventText(item)}</p>
                    <p className="text-xs text-text-muted text-right">{formatTimeAgo(item.created_at)}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}