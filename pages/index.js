import { useState } from 'react';

export default function Home({ username, role }) {
  const [inputUsername, setInputUsername] = useState('');
  const [selectedRam, setSelectedRam] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const ramOptions = [1024, 2048, 3072, 4096, 5120, 6144, 7168, 8192, 9216, 10240, 11264, 999999];
  const ramLabels = ['1GB', '2GB', '3GB', '4GB', '5GB', '6GB', '7GB', '8GB', '9GB', '10GB', '11GB', 'Unlimited'];

  const calculateCPU = (ram) => ram === 999999 ? 0 : Math.min(Math.floor(ram / 1024 * 50), 400);

  const handleSubmit = async () => {
    if (!inputUsername || !selectedRam) return alert("Lengkapi semua data!");
    setLoading(true);
    setResult(null);
    const password = Math.random().toString(36).substring(2, 10);
    const res = await fetch('/api/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: inputUsername,
        password,
        ram: selectedRam,
        cpu: calculateCPU(selectedRam)
      })
    });
    const data = await res.json();
    setLoading(false);
    setResult({ ...data, password, username: inputUsername });
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Segoe UI', maxWidth: 600, margin: 'auto' }}>
      <h2 style={{ textAlign: 'center', marginBottom: 30 }}>
        🎮 Panel Builder ({username} | {role})
      </h2>

      <input
        type="text"
        placeholder="Masukkan Username"
        value={inputUsername}
        onChange={(e) => setInputUsername(e.target.value)}
        required
        style={{
          width: '100%',
          padding: 10,
          fontSize: 16,
          border: '1px solid #ccc',
          borderRadius: 6,
          marginBottom: 20
        }}
      />

      <h4>Pilih RAM:</h4>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20
      }}>
        {ramOptions.map((ram, i) => (
          <button
            key={ram}
            onClick={() => setSelectedRam(ram)}
            style={{
              padding: '8px 16px',
              backgroundColor: selectedRam === ram ? '#0070f3' : '#f0f0f0',
              color: selectedRam === ram ? '#fff' : '#000',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            {ramLabels[i]}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: '100%',
          padding: 12,
          fontSize: 16,
          backgroundColor: '#28a745',
          color: 'white',
          border: 'none',
          borderRadius: 6,
          cursor: 'pointer'
        }}
      >
        {loading ? 'Memproses...' : '🚀 Buat Server Sekarang'}
      </button>

      {result && (
        <div style={{
          marginTop: 40,
          padding: 20,
          borderRadius: 10,
          background: '#f9f9f9',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
        }}>
          {result.success ? (
            <>
              <h3 style={{ color: '#28a745' }}>✅ Server Berhasil Dibuat!</h3>
              <p><strong>Username:</strong> {result.username}</p>
              <p><strong>Email:</strong> {result.email}</p>
              <p><strong>Password:</strong> {result.password}</p>
              <p><strong>RAM:</strong> {selectedRam === 999999 ? 'Unlimited' : selectedRam / 1024 + 'GB'}</p>
              <p><strong>CPU:</strong> {calculateCPU(selectedRam)}%</p>
              <p><strong>Panel:</strong> <a href="https://faanzyganteng.serverku.biz.id" target="_blank">Login di sini</a></p>
            </>
          ) : (
            <>
              <h3 style={{ color: 'red' }}>❌ Gagal</h3>
              <pre>{JSON.stringify(result.error, null, 2)}</pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps({ req }) {
  const cookie = req.headers.cookie || '';
  const username = cookie.match(/username=([^;]+)/)?.[1] || null;
  const role = cookie.match(/role=([^;]+)/)?.[1] || null;

  if (!username || !role) {
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };
  }

  return {
    props: {
      username,
      role
    }
  };
}