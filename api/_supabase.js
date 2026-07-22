// Supabase Client compartilhado
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

const DEFAULT_CONFIG = {
  admin: { usuario: 'admin', senha: process.env.ADMIN_PASSWORD || 'admin123' },
  sorteio: { whatsapp: '5511999999999', pdf_flex: '', pdf_pratico: '', pdf_ideal: '', ativo: true },
  app_download: { tipo: 'link', google_play_url: '', app_store_url: '', apk_url: '', link_customizado: '', texto_botao: 'Baixar Aplicativo' }
};

async function getConfig() {
  try {
    const { data, error } = await supabase.from('settings').select('key_name, val');
    if (error || !data || data.length === 0) return { ...DEFAULT_CONFIG };
    const cfg = { ...DEFAULT_CONFIG };
    for (const row of data) {
      try { cfg[row.key_name] = JSON.parse(row.val); } catch {}
    }
    return cfg;
  } catch { return { ...DEFAULT_CONFIG }; }
}

async function saveConfig(cfg) {
  for (const [key, val] of Object.entries(cfg)) {
    await supabase.from('settings').upsert({ key_name: key, val: JSON.stringify(val) }, { onConflict: 'key_name' });
  }
}

function checkAuth(req) {
  const auth = req.headers['authorization'] || '';
  const match = auth.match(/^Basic\s+(.+)$/i);
  if (!match) return false;
  const decoded = Buffer.from(match[1], 'base64').toString('utf8');
  const [user, pass] = decoded.split(':', 2);
  return user === (process.env.ADMIN_USER || 'admin') && pass === (process.env.ADMIN_PASSWORD || 'admin123');
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

module.exports = { supabase, getConfig, saveConfig, checkAuth, cors, DEFAULT_CONFIG };
