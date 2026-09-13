const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: { message: "Method not allowed." } });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: {
        message: "GEMINI_API_KEY is not configured on Vercel. Add it in Project Settings → Environment Variables, then redeploy."
      }
    });
  }

  try {
    const response = await fetch(`${GEMINI_API_BASE}/models`, {
      headers: { "x-goog-api-key": apiKey }
    });

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: { message: text || `Gemini returned HTTP ${response.status}.` } };
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Astra Gemini models proxy error:", error);
    return res.status(500).json({
      error: { message: "Astra could not reach Gemini model discovery." }
    });
  }
}
