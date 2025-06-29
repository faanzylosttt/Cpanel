import { useState } from 'react';

export default function Home() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const data = await res.json();
    setResponse(data);
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: 30 }}>
      <h1>🚀 Create Panel 1GB Unlimited</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: 400 }}>
        <input type="text" placeholder="Username" required
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          style={{ marginBottom: 10 }}
        />
        <input type="email" placeholder="Email" required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={{ marginBottom: 10 }}
        />
        <input type="password" placeholder="Password" required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={{ marginBottom: 10 }}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Membuat akun...' : 'Buat Akun Sekarang'}
        </button>
      </form>

      {response && (
        <div style={{ marginTop: 30 }}>
          {response.success ? (
            <div style={{ color: 'green' }}>
              ✅ Akun dan server berhasil dibuat!<br /><br />
              <strong>🔑 Username:</strong> {response.user.username}<br />
              <strong>📧 Email:</strong> {response.user.email}<br />
              <strong>🔗 Login Panel:</strong> <a href="https://faanzyganteng.serverku.biz.id" target="_blank">Klik di sini</a>
            </div>
          ) : (
            <div style={{ color: 'red' }}>
              ❌ Gagal: {JSON.stringify(response.error)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}