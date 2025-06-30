import { useEffect, useState } from 'react';

export default function ServerList({ role }) {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServers = async () => {
    const res = await fetch('/api/list');
    const data = await res.json();
    if (data.servers) setServers(data.servers);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Yakin mau hapus server ini?')) return;
    await fetch(`/api/delete?id=${id}`, { method: 'DELETE' });
    fetchServers();
  };

  useEffect(() => {
    fetchServers();
  }, []);

  if (role !== 'owner') return <p>Akses ditolak</p>;

  return (
    <div style={{ padding: 20, fontFamily: 'Segoe UI' }}>
      <h2>📋 Daftar Server</h2>
      {loading ? <p>Loading...</p> : (
        <ul>
          {servers.map((s, i) => (
            <li key={s.id}>
              <b>{s.username}</b> - {s.ram / 1024}GB
              <button onClick={() => handleDelete(s.id)} style={{ marginLeft: 10 }}>🗑 Hapus</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const cookie = req.headers.cookie || '';
  const role = cookie.match(/role=([^;]+)/)?.[1] || null;

  return {
    props: { role }
  };
}