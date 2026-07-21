// POST /api/delete_participant — Excluir participante (admin)
import { supabase, checkAuth, cors } from './_supabase.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!checkAuth(req))          return res.status(401).json({ error: 'Acesso negado' });
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method Not Allowed' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'JSON inválido' }); }
  }

  const id = String(body?.id || '');
  if (!id) return res.status(400).json({ error: 'ID inválido' });

  const { error } = await supabase.from('participants').delete().eq('id', id);
  if (error) return res.status(500).json({ error: 'Erro ao excluir' });

  return res.status(200).json({ success: true });
}
