// POST /api/save — Salvar configurações (admin)
import { getConfig, saveConfig, checkAuth, cors } from './_supabase.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!checkAuth(req))          return res.status(401).json({ error: 'Acesso negado' });
  if (req.method !== 'POST')    return res.status(405).json({ error: 'Method Not Allowed' });

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'JSON inválido' }); }
  }

  const currentConfig = await getConfig();

  if (body?.sorteio) {
    currentConfig.sorteio = { ...currentConfig.sorteio, ...body.sorteio };
  }
  if (body?.app_download) {
    currentConfig.app_download = { ...currentConfig.app_download, ...body.app_download };
  }
  // Nota: mudança de senha é feita via variável de ambiente ADMIN_PASSWORD na Vercel

  await saveConfig(currentConfig);
  return res.status(200).json({ success: true });
}
