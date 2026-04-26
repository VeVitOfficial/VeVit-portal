import { Router } from 'express'
import { supabase } from '../db/supabase.js'
import { authRequired } from '../middleware/auth.js'

export const limitsRouter = Router()

limitsRouter.get('/limits', authRequired, async (req, res) => {
  const userId = req.user!.id

  const [usageResult, creditsResult] = await Promise.all([
    supabase
      .from('ai_usage_log')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false }),
    supabase
      .from('ai_tool_credits')
      .select('*')
      .eq('user_id', userId)
      .single(),
  ])

  if (usageResult.error) return res.status(500).json({ error: 'Failed to fetch usage' })
  if (creditsResult.error && creditsResult.error.code !== 'PGRST116') {
    return res.status(500).json({ error: 'Failed to fetch credits' })
  }

  res.json({
    usage: usageResult.data,
    credits: creditsResult.data ?? null,
  })
})