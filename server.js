import express from "express";
import fetch from "node-fetch";
import OpenAI from "openai";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get("/", (req, res) => {
  res.send("AI Analyze API is running");
});

app.get("/analyze", async (req, res) => {
  try {
    // JSON取得
    const jsonUrl = "https://syayou.f5.si/proxy.php";
    const data = await (await fetch(jsonUrl)).json();

    // AIに分析依頼
    const prompt = `
      次のJSONは作品データです。
      興味深い特徴を持つ作品を3つ選び、その理由を簡潔に説明してください。
      JSON:
      ${JSON.stringify(data, null, 2)}
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "あなたは優秀なデータアナリストです。" },
        { role: "user", content: prompt }
      ]
    });

    res.json({ result: completion.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "分析中にエラー発生" });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
