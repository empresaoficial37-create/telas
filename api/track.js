const { supabase, cors } = require('./_supabase');

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  const ua = String(req.headers['user-agent'] || '').slice(0, 200);
  try { await supabase.from('visitors_stats').insert({ ip, user_agent: ua, timestamp: new Date().toISOString() }); } catch {}
  return res.status(200).json({ success: true });
};
