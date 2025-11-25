import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const OPENROUTER_KEY = process.env.OPENROUTER_KEY;   // ⬅ secure key

app.post("/chat", async (req, res) => {
  const { system, message } = req.body;

  try {
    const payload = {
      model: "qwen/qwen-2.5-7b-instruct",
      messages: [
        { role: "system", content: system || "" },
        { role: "user", content: message }
      ]
    };

    const result = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await result.json();
    const reply = data?.choices?.[0]?.message?.content || "No response.";

    res.json({ reply });

  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(3000, () =>
  console.log("OpenRouter Proxy running!")
);
