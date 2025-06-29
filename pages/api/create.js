
import { isAdmin } from "../../lib/auth";

export default async function handler(req, res) {
  const email = req.cookies.user;
  const is_owner = isAdmin(email);
  const { username, password, ram, cpu } = req.body;

  const egg = is_owner ? 15 : 15;
  const env = {
    DB_HOST: "localhost",
    DB_USER: "user",
    DB_PASS: "pass",
    DB_NAME: "db",
    CMD_RUN: "npm start"
  };

  const payload = {
    name: username,
    user: 1,
    egg,
    docker_image: "ghcr.io/pterodactyl/yolks:nodejs_18",
    startup: "npm start",
    environment: env,
    limits: { memory: ram, swap: 0, disk: 10240, io: 500, cpu },
    feature_limits: { databases: 0, allocations: 1, backups: 0 },
    deploy: { locations: [1], dedicated_ip: false, port_range: [] },
    start_on_completion: true
  };

  const result = await fetch("https://faanzyganteng.serverku.biz.id/api/application/servers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer ptla_z42nlEhAyB5cHeEZwgJSuIn0EsYB9J7HlK20DdHk7bi"
    },
    body: JSON.stringify(payload)
  });

  const data = await result.json();
  if (data.errors) return res.status(400).json({ error: data.errors });
  res.json({ success: true, email, password });
}
