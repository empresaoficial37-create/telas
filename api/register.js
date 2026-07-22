const { supabase, cors } = require('./_supabase');

function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  for (let t = 9; t < 11; t++) {
    let d = 0;
    for (let c = 0; c < t; c++) d += parseInt(cpf[c]) * ((t + 1) - c);
    d = ((10 * d) % 11) % 10;
    if (parseInt(cpf[t]) !== d) return false;
  }
  return true;
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'JSON inválido' }); }
  }

  const nome     = String(body?.nome || '').trim().slice(0, 255);
  const cpf      = String(body?.cpf || '').replace(/\D/g, '');
  const email    = String(body?.email || '').trim().toLowerCase();
  const telefone = String(body?.telefone || '').replace(/\D/g, '');
  const planoRaw = String(body?.plano || 'Flex').trim();
  const planosValidos = ['Flex', 'Prático', 'Pratico', 'Ideal'];
  const plano = planosValidos.includes(planoRaw) ? planoRaw : 'Flex';

  if (!nome || nome.length < 2)   return res.status(400).json({ error: 'Nome inválido' });
  if (!validarCPF(cpf))           return res.status(400).json({ error: 'CPF inválido' });
  if (!email.includes('@'))       return res.status(400).json({ error: 'E-mail inválido' });
  if (telefone.length < 10)       return res.status(400).json({ error: 'Telefone inválido' });

  const { data: existente } = await supabase.from('participants').select('id').eq('cpf', cpf).single();
  if (existente) return res.status(409).json({ error: 'CPF já cadastrado', duplicate: true });

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0] || req.socket?.remoteAddress || '';

  const novo = {
    id: 'sp_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    nome, cpf, email, telefone, plano,
    ganhador: false,
    data_cadastro: new Date().toISOString(),
    ip
  };

  const { error } = await supabase.from('participants').insert(novo);
  if (error) return res.status(500).json({ error: 'Erro ao salvar cadastro.' });

  return res.status(200).json({ success: true, id: novo.id, message: 'Cadastro realizado com sucesso!' });
};
