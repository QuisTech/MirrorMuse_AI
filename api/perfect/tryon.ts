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
    // 1. GET Polling Request: /api/perfect/tryon?task_id=XYZ
    if (req.method === 'GET') {
      const taskId = req.query.task_id as string;
      if (!taskId) {
        return res.status(400).json({ error: "Missing task_id query parameter" });
      }

      const pollRes = await fetch(`${baseUrl}/task/virtual-tryon/${encodeURIComponent(taskId)}`, {
        headers: { "Authorization": `Bearer ${apiKey}` }
      });

      const pollData = await pollRes.json();
      return res.status(pollRes.status).json(pollData);
    }

    // 2. POST Task Creation Request for Makeup Try-On & Face Mesh
    if (req.method === 'POST') {
      const { imageUrl, shadeSku, shadeHex, category } = req.body || {};
      const targetImageUrl = imageUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&w=1200&q=80";

      let taskPayload: any = {
        makeup_sku: shadeSku || "PC-LIP-402",
        color_hex: shadeHex || "#be123c",
        category: category || "lipstick",
        pattern: "full"
      };

      // Handle user Base64 upload by uploading to Perfect Corp File API
      if (targetImageUrl.startsWith("data:image")) {
        const base64Data = targetImageUrl.split(',')[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const uploadRes = await fetch(`${baseUrl}/file`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Content-Type": "image/jpeg"
          },
          body: buffer
        });

        const uploadData = await uploadRes.json();
        if (uploadData.data && (uploadData.data.file_id || uploadData.data.id)) {
          taskPayload.src_file_id = uploadData.data.file_id || uploadData.data.id;
        } else {
          taskPayload.src_file_url = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&w=1200&q=80";
        }
      } else {
        taskPayload.src_file_url = targetImageUrl;
      }

      const createRes = await fetch(`${baseUrl}/task/virtual-tryon`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(taskPayload)
      });

      const createData = await createRes.json();
      return res.status(createRes.status).json(createData);
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}
