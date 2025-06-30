// Hapus server berdasarkan ID (khusus owner)
export default async function handler(req, res) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' });

  const cookie = req.headers.cookie || '';
  const role = cookie.match(/role=([^;]+)/)?.[1] || null;
  if (role !== 'owner') return res.status(403).json({ error: 'Forbidden' });

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing server ID' });

  try {
    // Contoh hapus server dari array global (simulasi)
    global.servers = (global.servers || []).filter(s => s.id !== id);
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Gagal menghapus server' });
  }
}