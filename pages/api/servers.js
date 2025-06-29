
import { isAdmin } from "../../lib/auth";

export default async function handler(req, res) {
  const email = req.cookies.user;
  if (!isAdmin(email)) return res.status(403).json({ error: "Forbidden" });

  const result = await fetch("https://faanzyganteng.serverku.biz.id/api/application/servers", {
    headers: { Authorization: "Bearer ptlc_rGI5LSar8Gm7OsczGrP0zKJSySOMcR9qTpEmw1N9Zwm" }
  });
  const data = await result.json();
  res.json(data);
}
