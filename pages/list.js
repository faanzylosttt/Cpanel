import { useEffect, useState } from 'react';

export default function List({ username, role }) { const [servers, setServers] = useState([]); const [loading, setLoading] = useState(true);

useEffect(() => { const fetchServers = async () => { const res = await fetch('/api/list'); const data = await res.json(); setServers(data.servers || []); setLoading(false); }; fetchServers(); }, []);

const handleDelete = async (id) => { if (!confirm('Yakin ingin menghapus server ini?')) return; const res = await fetch(/api/delete?id=${id}, { method: 'DELETE' }); const data = await res.json(); if (data.success) { alert('Server dihapus.'); setServers(servers.filter(s => s.id !== id)); } else { alert('Gagal menghapus server.'); } };

return ( <div style={{ padding: 20, fontFamily: 'Segoe UI', maxWidth: 800, margin: 'auto' }}> <h2 style={{ textAlign: 'center' }}>📋 Daftar Semua Server</h2> <p style={{ textAlign: 'center', color: '#555' }}>Login sebagai: <b>{username}</b> ({role})</p> {loading ? <p>Loading...</p> : ( servers.length === 0 ? ( <p style={{ textAlign: 'center', marginTop: 20 }}>Belum ada server.</p> ) : ( <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20 }}> <thead> <tr style={{ backgroundColor: '#f0f0f0' }}> <th style={cell}>Username</th> <th style={cell}>RAM</th> <th style={cell}>CPU</th> <th style={cell}>Email</th> <th style={cell}>Action</th> </tr> </thead> <tbody> {servers.map(server => ( <tr key={server.id}> <td style={cell}>{server.username}</td> <td style={cell}>{server.ram} MB</td> <td style={cell}>{server.cpu}%</td> <td style={cell}>{server.email}</td> <td style={cell}> <button onClick={() => handleDelete(server.id)} style={{ backgroundColor: 'red', color: 'white', border: 'none', borderRadius: 4, padding: '5px 10px', cursor: 'pointer' }}>Hapus</button> </td> </tr> ))} </tbody> </table> ) )} </div> ); }

const cell = { padding: 10, border: '1px solid #ccc', textAlign: 'center' };

export async function getServerSideProps({ req }) { const cookie = req.headers.cookie || ''; const username = cookie.match(/username=([^;]+)/)?.[1] || null; const role = cookie.match(/role=([^;]+)/)?.[1] || null;

if (!username || !role || role !== 'owner') { return { redirect: { destination: '/login', permanent: false } }; }

return { props: { username, role } }; }

