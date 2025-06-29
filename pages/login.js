
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    router.push('/');
  };

  return (
    <div style={{ padding: 50 }}>
      <h2>Login Admin / User</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
