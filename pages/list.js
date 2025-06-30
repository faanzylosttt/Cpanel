import { useEffect, useState } from 'react';

export default function ServerList({ role }) {
  const [servers, setServers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServers = async () => {
    setLoading(true);
    const res = await fetch('/api/list');
    const data = await res.json();
    setServers(data.servers || []);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const confirmDelete = confirm('Yakin ingin menghapus server ini?');
    if (!confirmDelete) return;

    const res = await fetch(`/api/delete?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      alert('✅ Server berhasil dihapus!');
      fetchServers();
    } else {
      alert('❌ Gagal menghapus server');
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);

  if (role !== 'owner') {
    return (
      <div style={styles.container}>
        <h2 style={{ color: 'red' }}>🚫 Akses ditolak</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>📋 Daftar Server Pterodactyl</h1>

      {loading ? (
        <p style={{ color: '#ccc' }}>🔄 Mengambil data server...</p>
      ) : servers.length === 0 ? (
        <p style={{ color: '#ccc' }}>⚠ Tidak ada server ditemukan.</p>
      ) : (
        <div style={styles.cardContainer}>
          {servers.map((server) => (
            <div key={server.id} style={styles.card}>
              <h3>{server.name || 'Tanpa Nama'}</h3>
              <p><b>ID:</b> {server.id}</p>
              <p><b>User ID:</b> {server.user}</p>
              <p><b>UUID:</b> {server.uuid}</p>
              <p><b>Dibuat:</b> {new Date(server.createdAt).toLocaleString()}</p>

              <button style={styles.deleteButton} onClick={() => handleDelete(server.id)}>
                🗑 Hapus
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: 20,
    fontFamily: 'Segoe UI, sans-serif',
    backgroundColor: '#121212',
    color: '#fff',
    minHeight: '100vh'
  },
  title: {
    textAlign: 'center',
    fontSize: 26,
    marginBottom: 20
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: 20
  },
  card: {
    backgroundColor: '#1e1e1e',
    padding: 20,
    borderRadius: 10,
    boxShadow: '0 0 12px rgba(0,0,0,0.4)'
  },
  deleteButton: {
    marginTop: 10,
    padding: '8px 12px',
    backgroundColor: '#e53935',
    color: 'white',
    border: 'none',
    borderRadius: 6,
    cursor: 'pointer'
  }
};

export async function getServerSideProps({ req }) {
  const cookie = req.headers.cookie || '';
  const role = cookie.match(/role=([^;]+)/)?.[1] || null;

  return {
    props: { role }
  };
}