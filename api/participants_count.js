const { supabase, cors } = require('./_supabase');

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();
  const { count } = await supabase.from('participants').select('*', { count: 'exact', head: true });
  return res.status(200).json({ count: count || 0 });
};
