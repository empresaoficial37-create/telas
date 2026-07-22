const { getConfig, cors } = require('./_supabase');

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const cfg  = await getConfig();
  const app  = cfg.app_download || {};
  const tipo = app.tipo || 'link';
  let link   = '';

  if (tipo === 'apk' && app.apk_url) {
    link = app.apk_url;
  } else if ((tipo === 'link' || tipo === 'custom') && app.link_customizado) {
    link = app.link_customizado;
  } else {
    const ua = req.headers['user-agent'] || '';
    link = /iphone|ipad|ios/i.test(ua) ? (app.app_store_url || '') : (app.google_play_url || '');
  }

  return res.status(200).json({ success: true, link, tipo, ativo: !!link });
};
