// pages/api/list.js export default async function handler(req, res) { if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

const cookie = req.headers.cookie || ''; const role = cookie.match(/role=([^;]+)/)?.[1] || null; if (role !== 'owner') return res.status(403).json({ error: 'Unauthorized' });

try { const response = await fetch('https://faanzyganteng.serverku.biz.id/api/application/servers', { method: 'GET', headers: { 'Authorization': 'Bearer ptlc_z42nlEhAyB5cHeEZwgJSuIn0EsYB9J7HlK20DdHk7bi', 'Accept': 'application/json' } });

const json = await response.json();

const servers = (json.data || []).map(item => ({
  id: item.attributes.id,
  name: item.attributes.name,
  uuid: item.attributes.uuid,
  user: item.attributes.user,
  createdAt: item.attributes.created_at
}));

res.status(200).json({ servers });

} catch (err) { console.error(err); res.status(500).json({ error: 'Gagal mengambil data server' }); } }

