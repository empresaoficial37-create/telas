// POST /api/login — Login admin
import { cors } from './_supabase.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'JSON inválido' }); }
  }

  const usuario = String(body?.usuario || body?.username || '').trim();
  const senha   = String(body?.senha   || body?.password || '');

  const adminUser = process.env.ADMIN_USER     || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';

  if (usuario === adminUser && senha === adminPass) {
    const token = Buffer.from(`${usuario}:${senha}`).toString('base64');
    return res.status(200).json({ success: true, token });
  }

  return res.status(401).json({ error: 'Usuário ou senha incorretos' });
}
