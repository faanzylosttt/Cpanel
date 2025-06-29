import { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    const res = await fetch('/api/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    setLoading(false);
    setResult(data);
  };

  return (
    <div style={{ padding: 20, fontFamily: 'Arial' }}>
      <h2>Buat Akun Panel</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        /><br /><br />
        <input
          type="text"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        /><br /><br />
        <button type="submit" disabled={loading}>
          {loading ? 'Memproses...' : 'Buat Server'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: 30 }}>
          {result.success ? (
            <>
              <h3>✅ Server Berhasil Dibuat</h3>
              <p><strong>Email:</strong> {result.email}</p>
              <p><strong>Password:</strong> {result.password}</p>
              <p><strong>Panel Login:</strong> <a href="https://faanzyganteng.serverku.biz.id" target="_blank">Klik di sini</a></p>
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