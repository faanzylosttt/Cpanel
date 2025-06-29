import { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [selectedRam, setSelectedRam] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const ramOptions = [
    1024, 2048, 3072, 4096, 5120,
    6144, 7168, 8192, 9216, 10240,
    11264, 999999
  ];

  const ramLabels = [
    '1GB', '2GB', '3GB', '4GB', '5GB',
    '6GB', '7GB', '8GB', '9GB', '10GB',
    '11GB', 'Unlimited'
  ];

  const calculateCPU = (ram) => {
    return ram === 999999 ? 0 : Math.min(Math.floor(ram / 1024 * 50), 400);
  };

  const handleSubmit = async () => {
    if (!username || !selectedRam) return alert("Lengkapi semua data!");

    setLoading(true);
    setResult(null);

    const password = Math.random().toString(36).substring(2, 10);
    const res = await fetch('/api/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        password,
        ram: selectedRam,
        cpu: calculateCPU(selectedRam)
      })
    });

    const data = await res.json();
    setLoading(false);
    setResult({ ...data, password, username });
  };

  return (
    <div style={{
      background: 'linear-gradient(135deg, #1f1c2c, #928dab)',
      minHeight: '100vh',
      padding: 30,
      fontFamily: 'Segoe UI, sans-serif',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: '#2e2e42',
        padding: 30,
        borderRadius: 12,
        boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
        width: '100%',
        maxWidth: 500
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 30 }}>⚙️ Buat Server Panel</h2>

        <input
          type="text"
          placeholder="Masukkan Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{
            width: '100%',
            padding: 12,
            fontSize: 16,
            border: '1px solid #444',
            borderRadius: 8,
            marginBottom: 20,
            background: '#1c1c2e',
            color: 'white'
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
                backgroundColor: selectedRam === ram ? '#4CAF50' : '#444',
                color: 'white',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 'bold'
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
            padding: 14,
            fontSize: 16,
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer',
            marginBottom: 10
          }}
        >
          {loading ? '🚀 Memproses...' : '💾 Buat Server'}
        </button>

        {result && (
          <div style={{
            marginTop: 30,
            padding: 20,
            borderRadius: 10,
            background: '#1c1c2e',
            boxShadow: '0 0 10px rgba(255,255,255,0.1)'
          }}>
            {result.success ? (
              <>
                <h3 style={{ color: '#4CAF50' }}>✅ Berhasil</h3>
                <p><strong>Username:</strong> {result.username}</p>
                <p><strong>Email:</strong> {result.email}</p>
                <p><strong>Password:</strong> {result.password}</p>
                <p><strong>RAM:</strong> {selectedRam === 999999 ? 'Unlimited' : selectedRam / 1024 + 'GB'}</p>
                <p><strong>CPU:</strong> {calculateCPU(selectedRam)}%</p>
                <p><strong>🔗 Panel:</strong> <a href="https://faanzyganteng.serverku.biz.id" target="_blank" style={{ color: '#03A9F4' }}>Klik untuk login</a></p>
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
    </div>
  );
}