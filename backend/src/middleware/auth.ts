import type { Request, Response, NextFunction } from 'express'
import { supabase } from '../db/supabase.js'

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        nickname: string
        fullName: string
        avatarUrl: string
        email: string
        tier: string
        xp: number
        level: number
      }
    }
  }
}

export async function authRequired(req: Request, res: Response, next: NextFunction) {
  const raw = req.cookies?.vevit_auth
  if (!raw) return res.status(401).json({ error: 'Not authenticated' })

  let userData: Record<string, unknown>
  try {
    userData = JSON.parse(decodeURIComponent(raw))
  } catch {
    return res.status(401).json({ error: 'Invalid auth cookie' })
  }

  const userId = userData.id
  if (!userId) return res.status(401).json({ error: 'Invalid auth cookie' })

  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single()

  if (error || !data) return res.status(401).json({ error: 'User not found' })

  req.user = userData as Request['user']
  next()
}