const { supabase, checkAuth, cors } = require('./_supabase');

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (!checkAuth(req)) return res.status(401).json({ error: 'Acesso negado' });

  try {
    const { count: totalAcessos } = await supabase.from('visitors_stats').select('*', { count: 'exact', head: true });
    const today = new Date().toISOString().split('T')[0];
    const { count: acessosHoje } = await supabase.from('visitors_stats').select('*', { count: 'exact', head: true })
      .gte('timestamp', today + 'T00:00:00').lte('timestamp', today + 'T23:59:59');
    const { data: logs } = await supabase.from('visitors_stats').select('ip, timestamp, user_agent').order('timestamp', { ascending: false }).limit(10);
    return res.status(200).json({ total_acessos: totalAcessos || 0, acessos_hoje: acessosHoje || 0, logs: logs || [] });
  } catch {
    return res.status(200).json({ total_acessos: 0, acessos_hoje: 0, logs: [] });
  }
};
