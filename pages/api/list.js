// List semua server (khusus owner)
export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  // Proteksi via cookie (opsional)
  const cookie = req.headers.cookie || '';
  const role = cookie.match(/role=([^;]+)/)?.[1] || null;
  if (role !== 'owner') return res.status(403).json({ error: 'Forbidden' });

  try {
    // Simulasi data dari database atau API panel
    const servers = global.servers || []; // kalau kamu pakai database, ganti bagian ini
    res.status(200).json({ servers });
  } catch (err) {
    res.status(500).json({ error: 'Gagal mengambil data server' });
  }
}