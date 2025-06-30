export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const cookie = req.headers.cookie || '';
  const role = cookie.match(/role=([^;]+)/)?.[1] || null;
  if (role !== 'owner') return res.status(403).json({ error: 'Unauthorized' });

  try {
    const response = await fetch('https://faanzyganteng.serverku.biz.id/api/application/servers', {
      headers: {
        'Authorization': 'Bearer ptlc_z42nlEhAyB5cHeEZwgJSuIn0EsYB9J7HlK20DdHk7bi',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });

    const data = await response.json();
    const servers = data.data || [];
    res.status(200).json({ servers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal mengambil daftar server.' });
  }
}