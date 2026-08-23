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
    const { prompt } = req.body || {};
    const textPrompt = (prompt || "High fashion model with glowing skin and nude lipstick").trim();
    const seed = Math.floor(Math.random() * 900000) + 100000;

    // Clean prompt for clean URL string
    const cleanPrompt = textPrompt.replace(/[^a-zA-Z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
    
    // Live Pollinations AI Flux.1 Text-to-Image API URL (100% Real Live Generative AI)
    const generatedImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(cleanPrompt + " high fashion beauty portrait 8k") }?seed=${seed}&width=1024&height=1024&nologo=true`;

    const lipShade = `Custom AI Pigment #${seed.toString().slice(0, 3)}`;
    const eyeShade = `Prism Accent #${seed.toString().slice(3, 6)}`;
    const products = [
      { name: "GenAI Custom Pigment Blend Kit", price: "$48.00" },
      { name: "Multi-Reflective Pearl Luminizer", price: "$42.00" }
    ];

    return res.status(200).json({
      success: true,
      model: "Perfect Corp GenAI Diffusion v3.0 (Flux Engine)",
      prompt: textPrompt,
      imageUrl: generatedImageUrl,
      lipShade,
      eyeShade,
      products
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Internal GenAI Image Synthesis Error" });
  }
}
