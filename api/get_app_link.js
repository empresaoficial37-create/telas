// GET /api/get_app_link — Retorna link do app para download
import { getConfig, cors } from './_supabase.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const cfg = await getConfig();
  const app  = cfg.app_download || {};
  const tipo = app.tipo || 'link';
  let link   = '';

  if (tipo === 'apk' && app.apk_url) {
    link = app.apk_url;
  } else if ((tipo === 'link' || tipo === 'custom') && app.link_customizado) {
    link = app.link_customizado;
  } else {
    const ua = req.headers['user-agent'] || '';
    if (/iphone|ipad|ios/i.test(ua)) {
      link = app.app_store_url || '';
    } else {
      link = app.google_play_url || '';
    }
  }

  return res.status(200).json({ success: true, link, tipo, ativo: !!link });
}
