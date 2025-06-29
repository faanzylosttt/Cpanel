export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, password } = req.body;

  const panelUrl = 'https://faanzyganteng.serverku.biz.id';
  const adminApiKey = 'ptla_z42nlEhAyB5cHeEZwgJSuIn0EsYB9J7HlK20DdHk7bi';

  // 🎲 Buat email acak agar tidak bentrok
  const random = Math.floor(Math.random() * 100000);
  const email = `user${random}@faanzy.com`;

  try {
    // 1. Buat user baru
    const userRes = await fetch(`${panelUrl}/api/application/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminApiKey}`,
        'Accept': 'Application/vnd.pterodactyl.v1+json'
      },
      body: JSON.stringify({
        username,
        email,
        first_name: username,
        last_name: 'User',
        password
      })
    });

    if (!userRes.ok) {
      const error = await userRes.json();
      return res.status(userRes.status).json({ error });
    }

    const user = await userRes.json();

    // 2. Ambil allocation kosong dari Node ID 1
    const allocRes = await fetch(`${panelUrl}/api/application/nodes/1/allocations`, {
      headers: {
        'Authorization': `Bearer ${adminApiKey}`,
        'Accept': 'Application/vnd.pterodactyl.v1+json'
      }
    });

    if (!allocRes.ok) {
      const error = await allocRes.json();
      return res.status(allocRes.status).json({ error });
    }

    const allocations = await allocRes.json();
    const freeAlloc = allocations.data.find(a => !a.attributes.assigned);

    if (!freeAlloc) return res.status(400).json({ error: 'Tidak ada allocation kosong di node 1' });

    // 3. Buat server dengan CMD_RUN dan allocation otomatis
    const serverRes = await fetch(`${panelUrl}/api/application/servers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminApiKey}`,
        'Accept': 'Application/vnd.pterodactyl.v1+json'
      },
      body: JSON.stringify({
        name: `${username}-server`,
        user: user.attributes.id,
        egg: 15,
        nest: 5,
        location: 1,
        docker_image: "ghcr.io/pterodactyl/yolks:nodejs_18",
        startup: "npm start",
        limits: {
          memory: 1024,
          swap: 0,
          disk: 999999,
          io: 500,
          cpu: 0
        },
        feature_limits: {
          databases: 5,
          backups: 5,
          allocations: 1
        },
        environment: {
          USER_UPLOAD: "1",
          CMD_RUN: "npm start"
        },
        allocation: {
          default: freeAlloc.attributes.id
        },
        start_on_completion: true
      })
    });

    if (!serverRes.ok) {
      const error = await serverRes.json();
      return res.status(serverRes.status).json({ error });
    }

    const server = await serverRes.json();

    return res.status(200).json({
      success: true,
      message: 'Akun dan server berhasil dibuat!',
      email,
      user: user.attributes,
      server: server.attributes
    });

  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
}