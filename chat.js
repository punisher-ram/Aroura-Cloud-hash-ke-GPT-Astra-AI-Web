const GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
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
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    if (!body || typeof body !== "object") {
      return res.status(400).json({ error: { message: "Invalid request body." } });
    }

    const model = String(body.model || "").trim();
    if (!model) {
      return res.status(400).json({ error: { message: "No Gemini model was supplied." } });
    }

    const payload = {
      systemInstruction: body.systemInstruction,
      contents: body.contents,
      generationConfig: body.generationConfig
    };

    // Do not pass arbitrary browser-supplied fields through to Gemini.
    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined) delete payload[key];
    });

    const response = await fetch(
      `${GEMINI_API_BASE}/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify(payload)
      }
    );

    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { error: { message: text || `Gemini returned HTTP ${response.status}.` } };
    }

    return res.status(response.status).json(data);
  } catch (error) {
    console.error("Astra Gemini proxy error:", error);
    return res.status(500).json({
      error: { message: "Astra could not reach Gemini. Please try again." }
    });
  }
}
