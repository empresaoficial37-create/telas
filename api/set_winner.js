// POST /api/set_winner — Marcar/remover ganhador (admin)
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

  const id   = String(body?.id   || '');
  const acao = String(body?.acao || 'sortear');

  if (!id) return res.status(400).json({ error: 'ID inválido' });

  // Buscar participante
  const { data: participante } = await supabase
    .from('participants')
    .select('*')
    .eq('id', id)
    .single();

  if (!participante) return res.status(404).json({ error: 'Participante não encontrado' });

  if (acao === 'remover') {
    // Remover status de ganhador
    const { error } = await supabase
      .from('participants')
      .update({ ganhador: false })
      .eq('id', id);

    if (error) return res.status(500).json({ error: 'Erro ao atualizar' });
    return res.status(200).json({ success: true, message: 'Ganhador removido' });

  } else {
    // Remover ganhadores anteriores do mesmo plano e marcar o novo
    await supabase
      .from('participants')
      .update({ ganhador: false })
      .eq('plano', participante.plano)
      .neq('id', id);

    const { error } = await supabase
      .from('participants')
      .update({ ganhador: true })
      .eq('id', id);

    if (error) return res.status(500).json({ error: 'Erro ao atualizar' });
    return res.status(200).json({ success: true, message: '🏆 Ganhador declarado!' });
  }
}
