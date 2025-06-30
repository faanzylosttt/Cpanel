
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.error);

    router.push('/');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f0f2f5'
    }}>
      <div style={{
        background: 'white',
        padding: 30,
        borderRadius: 10,
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        width: 350
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 20 }}>🔐 Login Panel</h2>
        <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} style={{
          width: '100%', padding: 10, marginBottom: 15, borderRadius: 6, border: '1px solid #ccc'
        }} />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} style={{
          width: '100%', padding: 10, marginBottom: 15, borderRadius: 6, border: '1px solid #ccc'
        }} />
        <button onClick={handleLogin} style={{
          width: '100%', padding: 10, background: '#0070f3', color: 'white',
          border: 'none', borderRadius: 6, cursor: 'pointer'
        }}>Login</button>
      </div>
    </div>
  );
}
