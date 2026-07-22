const { supabase, checkAuth, cors } = require('./_supabase');

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!checkAuth(req)) return res.status(401).send('Acesso negado');

  const { data, error } = await supabase.from('participants').select('*').order('data_cadastro', { ascending: false });
  if (error) return res.status(500).send('Erro ao buscar dados');

  const rows = data || [];
  const header = ['ID', 'Nome', 'CPF', 'Email', 'Telefone', 'Plano', 'Ganhador', 'Data Cadastro', 'IP'];
  const escapeCSV = (v) => {
    const s = String(v || '');
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [header.join(','), ...rows.map(p => [p.id, p.nome, p.cpf, p.email, p.telefone, p.plano, p.ganhador ? 'Sim' : 'Não', p.data_cadastro, p.ip].map(escapeCSV).join(','))];
  const csv = lines.join('\n');
  const date = new Date().toISOString().split('T')[0];
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename=participantes_${date}.csv`);
  return res.status(200).send('\uFEFF' + csv);
};
