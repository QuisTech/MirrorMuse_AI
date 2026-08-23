export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = process.env.PERFECT_CORP_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "PERFECT_CORP_API_KEY environment variable is not configured on server" });
  }
  const baseUrl = "https://yce-api-01.makeupar.com/s2s/v2.0";

  try {
    // 1. GET Polling Request: /api/perfect/skin-analysis?task_id=XYZ
    if (req.method === 'GET') {
      const taskId = req.query.task_id as string;
      if (!taskId) {
        return res.status(400).json({ error: "Missing task_id query parameter" });
      }

      const pollRes = await fetch(`${baseUrl}/task/skin-analysis/${encodeURIComponent(taskId)}`, {
        headers: { "Authorization": `Bearer ${apiKey}` }
      });

      const pollData = await pollRes.json();
      return res.status(pollRes.status).json(pollData);
    }

    // 2. POST Task Creation Request
    if (req.method === 'POST') {
      const { imageUrl, actions } = req.body || {};
      const targetActions = actions || ["wrinkle", "texture", "pore", "redness", "acne", "moisture", "firmness", "radiance"];
      const targetImageUrl = imageUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=1000&auto=format&fit=crop&q=80";

      const createRes = await fetch(`${baseUrl}/task/skin-analysis`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          src_file_url: targetImageUrl,
          dst_actions: targetActions
        })
      });

      const createData = await createRes.json();
      return res.status(createRes.status).json(createData);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}
