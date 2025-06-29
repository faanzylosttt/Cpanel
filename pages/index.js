
import { useState, useEffect } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [user, setUser] = useState('');
  const [ram, setRam] = useState(1024);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const email = document.cookie.split('; ').find(row => row.startsWith('user='));
    if (email) setUser(decodeURIComponent(email.split('=')[1]));
  }, []);

  const submit = async () => {
    const password = Math.random().toString(36).substring(2, 10);
    const res = await fetch('/api/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, ram, cpu: ram === 999999 ? 0 : Math.min(ram / 1024 * 50, 400) })
    });
    const data = await res.json();
    setResult({ ...data, password });
  };

  return (
    <div style={{ padding: 50 }}>
      <h2>Halo {user}</h2>
      <input placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
      <select onChange={e => setRam(Number(e.target.value))}>
        {[1,2,3,4,5,6,7,8,9,10,11,999999].map(gb => (
          <option key={gb} value={gb === 999999 ? gb : gb * 1024}>
            {gb === 999999 ? 'Unlimited' : `${gb} GB`}
          </option>
        ))}
      </select>
      <button onClick={submit}>Create</button>
      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
