import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from "cors"; // 👈 Importa cors

dotenv.config();

const app = express();
const port = 3000;

// Middleware para JSON
app.use(bodyParser.json());
app.use(cors({ origin: "*" })); // 👈 Permite llamadas desde cualquier origen
// app.use(cors({ origin: "URL_DOMAIN" }));
// Inicializar cliente Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Endpoint MCP de ejemplo
app.get("/", async (req, res) => {
  // llama tu lógica de MCP aquí...
  res.json("Desde el home");
});
app.post("/ask", async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ error: "Falta el campo 'question'" });
    }

    // Llamada a Gemini
    const result = await model.generateContent(question);

    res.json({
      question,
      answer: result.response.text(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error procesando la pregunta" });
  }
});

app.listen(port, () => {
  console.log(`✅ MCP server corriendo en http://localhost:${port}`);
});
