// GET /api/list — Listar participantes (admin)
import { supabase, checkAuth, cors } from './_supabase.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!checkAuth(req)) return res.status(401).json({ error: 'Acesso negado' });

  const search      = String(req.query?.search || '').toLowerCase();
  const planoFiltro = String(req.query?.plano  || '');
  const status      = String(req.query?.status || '');

  let query = supabase.from('participants').select('*').order('data_cadastro', { ascending: false });

  if (planoFiltro) query = query.eq('plano', planoFiltro);
  if (status === 'winner') query = query.eq('ganhador', true);
  if (status === 'active') query = query.eq('ganhador', false);

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: 'Erro ao buscar participantes' });

  let result = data || [];

  if (search) {
    result = result.filter(p =>
      (p.nome     || '').toLowerCase().includes(search) ||
      (p.cpf      || '').includes(search) ||
      (p.email    || '').toLowerCase().includes(search) ||
      (p.telefone || '').includes(search)
    );
  }

  return res.status(200).json({ success: true, total: result.length, participants: result });
}
