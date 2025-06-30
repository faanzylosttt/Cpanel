
export default function handler(req, res) {
  res.setHeader('Set-Cookie', [
    `username=; Path=/; Max-Age=0`,
    `role=; Path=/; Max-Age=0`
  ]);
  res.json({ success: true });
}
