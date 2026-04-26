import { Router } from 'express'
import { supabase } from '../db/supabase.js'
import { authRequired } from '../middleware/auth.js'

export const xpStoreRouter = Router()

xpStoreRouter.get('/xp', authRequired, async (req, res) => {
  const userId = req.user!.id

  const { data, error } = await supabase
    .from('users')
    .select('xp, level')
    .eq('id', userId)
    .single()

  if (error) return res.status(500).json({ error: 'Failed to fetch XP' })

  res.json(data)
})

xpStoreRouter.post('/xp/purchase', authRequired, async (req, res) => {
  const userId = req.user!.id
  const { itemId, cost } = req.body

  if (!itemId || !cost) return res.status(400).json({ error: 'Missing itemId or cost' })

  const { data: user, error: fetchError } = await supabase
    .from('users')
    .select('xp')
    .eq('id', userId)
    .single()

  if (fetchError || !user) return res.status(500).json({ error: 'Failed to fetch user' })
  if (user.xp < cost) return res.status(400).json({ error: 'Insufficient XP' })

  const newXP = user.xp - cost

  const { error: updateError } = await supabase
    .from('users')
    .update({ xp: newXP })
    .eq('id', userId)

  if (updateError) return res.status(500).json({ error: 'Failed to deduct XP' })

  const { error: insertError } = await supabase
    .from('xp_store_purchases')
    .insert({ user_id: userId, item_id: itemId, cost })

  if (insertError) return res.status(500).json({ error: 'Failed to record purchase' })

  res.json({ ok: true, remainingXp: newXP })
})