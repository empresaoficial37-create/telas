// GET /api/config — Ler configurações (público)
import { getConfig, cors } from './_supabase.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const cfg = await getConfig();
  // Nunca expor a senha
  if (cfg.admin) {
    delete cfg.admin.senha;
    delete cfg.admin.senha_hash;
  }
  return res.status(200).json(cfg);
}
