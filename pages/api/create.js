export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { username, email, password } = req.body;

  const panelUrl = 'https://faanzyganteng.serverku.biz.id';
  const adminApiKey = 'ptla_z42nlEhAyB5cHeEZwgJSuIn0EsYB9J7HlK20DdHk7bi';

  try {
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
          USER_UPLOAD: "1"
        },
        allocation: {
          default: 1
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
      user: user.attributes,
      server: server.attributes
    });

  } catch (err) {
    return res.status(500).json({ error: 'Internal server error', message: err.message });
  }
}