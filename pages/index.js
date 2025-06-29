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
    return ram === 999999 ? 0 : Math.min(Math.floor(ram / 1024 * 50), 400); // 50% per GB max 400
  };

  const handleSubmit = async () => {
    if (!username || !selectedRam) return alert("Lengkapi semua data!");

    setLoading(true);
    setResult(null);

    const password = Math.random().toString(36).substring(2, 10); // random pw
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
    setResult({ ...data, password });
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h2>Buat Server Panel</h2>
      <input
        type="text"
        placeholder="Masukkan Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <h4>Pilih RAM:</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
        {ramOptions.map((ram, i) => (
          <button
            key={ram}
            onClick={() => setSelectedRam(ram)}
            style={{
              padding: '5px 10px',
              backgroundColor: selectedRam === ram ? '#4caf50' : '#eee',
              color: selectedRam === ram ? '#fff' : '#000',
              border: '1px solid #ccc',
              borderRadius: 5
            }}
          >
            {ramLabels[i]}
          </button>
        ))}
      </div><br />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? 'Memproses...' : 'Buat Server'}
      </button>

      {result && (
        <div style={{ marginTop: 30 }}>
          {result.success ? (
            <>
              <h3>✅ Server Berhasil Dibuat</h3>
              <p><strong>Email:</strong> {result.email}</p>
              <p><strong>Password:</strong> {result.password}</p>
              <p><strong>RAM:</strong> {selectedRam === 999999 ? 'Unlimited' : selectedRam / 1024 + 'GB'}</p>
              <p><strong>CPU:</strong> {calculateCPU(selectedRam)}%</p>
              <p><strong>Panel:</strong> <a href="https://faanzyganteng.serverku.biz.id" target="_blank">Login di sini</a></p>
            </>
          ) : (
            <>
              <h3>❌ Gagal</h3>
              <pre>{JSON.stringify(result.error, null, 2)}</pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}