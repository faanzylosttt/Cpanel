
import { users } from '../../lib/users';

export default function handler(req, res) {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Login gagal' });

  res.setHeader('Set-Cookie', [
    `username=${username}; Path=/; HttpOnly`,
    `role=${user.role}; Path=/; HttpOnly`
  ]);

  return res.json({ success: true, username, role: user.role });
}
