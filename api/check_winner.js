const { supabase, getConfig, cors } = require('./_supabase');

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const cpf = String(req.query?.cpf || '').replace(/\D/g, '');
  if (cpf.length !== 11) return res.status(400).json({ error: 'CPF inválido' });

  const { data: participant } = await supabase.from('participants').select('*').eq('cpf', cpf).eq('ganhador', true).single();
  if (!participant) return res.status(200).json({ winner: false });

  const cfg = await getConfig();
  const sorteio = cfg.sorteio || {};

  return res.status(200).json({
    winner: true,
    nome: participant.nome,
    cpf,
    plano: participant.plano,
    whatsapp: sorteio.whatsapp || '5511999999999',
    pdf_url: sorteio['pdf_' + (participant.plano || 'flex').toLowerCase().replace(/[áâã]/g, 'a')] || ''
  });
};
