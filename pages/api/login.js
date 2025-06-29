
import { isAdmin } from "../../lib/auth";

export default async function handler(req, res) {
  const email = req.cookies.user;
  if (!isAdmin(email)) return res.status(403).json({ error: "Forbidden" });

  const { id } = req.query;
  const result = await fetch("https://faanzyganteng.serverku.biz.id/api/application/servers/" + id, {
    method: "DELETE",
    headers: { Authorization: "Bearer ptlc_rGI5LSar8Gm7OsczGrP0zKJSySOMcR9qTpEmw1N9Zwm" }
  });

  if (result.status === 204) {
    res.json({ success: true });
  } else {
    const data = await result.json();
    res.status(result.status).json(data);
  }
}
