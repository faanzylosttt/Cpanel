export default async function handler(req, res) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const cookie = req.headers.cookie || '';
  const role = cookie.match(/role=([^;]+)/)?.[1] || null;
  if (role !== 'owner') {
    return res.status(403).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Server ID wajib disertakan' });

  try {
    const response = await fetch(`https://faanzyganteng.serverku.biz.id/api/application/servers/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': 'Bearer ptlc_z42nlEhAyB5cHeEZwgJSuIn0EsYB9J7HlK20DdHk7bi',
        'Accept': 'application/json'
      }
    });

    if (response.status === 204) {
      return res.status(200).json({ success: true, message: 'Server berhasil dihapus' });
    } else {
      const error = await response.json();
      return res.status(response.status).json({ error });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Gagal menghapus server' });
  }
}