// Ini handler untuk API, bukan React Component
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const cookie = req.headers.cookie || '';
  const role = cookie.match(/role=([^;]+)/)?.[1] || null;
  if (role !== 'owner') return res.status(403).json({ error: 'Unauthorized' });

  try {
    const servers = global.servers || [];
    res.status(200).json({ servers });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil server' });
  }
}