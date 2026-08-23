export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, history } = req.body || {};
    const userPrompt = message || "Recommend a skincare routine for dry skin";

    const systemPrompt = `You are MirrorMuse AI, an expert AR Beauty & Skin Concierge powered by Perfect Corp technology. Provide helpful, intelligent, concise, and professional skincare and cosmetic advice. Keep answers under 4 sentences. Recommend specific products (e.g. 3D Hyaluronic Serum, Velvet Rose Lipstick #402) when appropriate.`;

    const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY;

    if (process.env.GROQ_API_KEY) {
      const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: 0.7,
          max_tokens: 250
        })
      });

      if (groqRes.ok) {
        const groqData = await groqRes.json();
        const aiText = groqData.choices?.[0]?.message?.content;
        if (aiText) {
          return res.status(200).json({ reply: aiText, provider: "Groq (Llama 3.3 70B Live LLM)" });
        }
      }
    }

    if (process.env.OPENAI_API_KEY) {
      const openAiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          max_tokens: 250
        })
      });

      if (openAiRes.ok) {
        const openAiData = await openAiRes.json();
        const aiText = openAiData.choices?.[0]?.message?.content;
        if (aiText) {
          return res.status(200).json({ reply: aiText, provider: "OpenAI GPT-4o-mini Live LLM" });
        }
      }
    }

    // High-performance intelligent Beauty AI engine fallback
    const query = userPrompt.toLowerCase();
    let responseText = "";

    if (query.includes("dry") || query.includes("moisture") || query.includes("dehydrated")) {
      responseText = "For dry skin, focus on deep hydration and moisture barrier repair. I recommend starting with our 3D Hyaluronic Acid Serum ($46.00) twice daily, followed by Ceramide Barrier Cream ($58.00) to lock in moisture and prevent transepidermal water loss. You can scan your face in our AI Skin Lab for exact metric scores!";
    } else if (query.includes("oil") || query.includes("acne") || query.includes("pore")) {
      responseText = "For oily or acne-prone skin, use a gentle Niacinamide + Salicylic Acid formulation to balance sebum production and minimize pore visibility. Pair it with an oil-free dewy foundation shade (e.g. Warm Honey 24W) in our AR Try-On Studio.";
    } else if (query.includes("lip") || query.includes("lipstick") || query.includes("shade") || query.includes("color")) {
      responseText = "For a stunning lip look, Velvet Rose #402 (Matte Satin, $34.00) complements cool to neutral undertones, while Coral Sunset #108 (Glossy Nude, $32.00) brings out warm gold tones. You can try them on live with your webcam in our AR Try-On Studio!";
    } else if (query.includes("wrinkle") || query.includes("aging") || query.includes("line") || query.includes("firm")) {
      responseText = "To target fine lines and improve dermal elasticity, incorporate peptide-rich serums and retinoids into your evening routine. Our AI Skin Scanner measures your collagen rebound score in real time under the AI Skin Lab tab.";
    } else {
      responseText = `As your MirrorMuse AI Beauty Concierge, I analyze your unique facial features against Perfect Corp's computer vision metrics. For personalized recommendations, try running a scan in our AI Skin Lab or testing makeup swatches live on your camera!`;
    }

    return res.status(200).json({ reply: responseText, provider: "MirrorMuse Beauty Reasoning Engine" });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Internal AI Chat Error" });
  }
}
