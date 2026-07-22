const { getConfig, cors } = require('./_supabase');

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  const cfg = await getConfig();
  if (cfg.admin) { delete cfg.admin.senha; delete cfg.admin.senha_hash; }
  return res.status(200).json(cfg);
};
