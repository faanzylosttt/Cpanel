
import { useEffect, useState } from 'react';

export default function Servers() {
  const [servers, setServers] = useState([]);

  useEffect(() => {
    fetch('/api/servers')
      .then(res => res.json())
      .then(data => setServers(data.data || []));
  }, []);

  const remove = async (id) => {
    await fetch('/api/delete?id=' + id);
    setServers(s => s.filter(sv => sv.attributes.id !== id));
  };

  return (
    <div style={{ padding: 50 }}>
      <h2>List Server</h2>
      {servers.map(s => (
        <div key={s.attributes.id} style={{ marginBottom: 10 }}>
          <b>{s.attributes.name}</b>
          <button onClick={() => remove(s.attributes.id)}>Hapus</button>
        </div>
      ))}
    </div>
  );
}
