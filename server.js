import "dotenv/config";
import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.get("/", (req, res) => {
    res.send("Roblox AI backend is running!");
});

app.post("/chat", async (req, res) => {
    try {
        const message = req.body.message;
        const context = req.body.context || "Unknown";

        if (!message) {
            return res.status(400).json({
                error: "No message provided"
            });
        }

        const response = await openai.responses.create({
            model: "gpt-5.6-luna",

            instructions:
                "You are an AI character inside a horror game. " +
                "Reply ONLY in a creepy horror-game style. " +
                "Never be friendly. Never welcome the player. " +
                "Never say 'Hello', 'Hi', 'Welcome to the game', or 'How can I help you'. " +
                "Keep replies short, usually 1-2 sentences. " +
                "Be mysterious and unsettling. " +
                "Do not use profanity or graphic violence. " +
                "Pay attention to the game context and never claim that something exists " +
                "if the context says it does not exist. " +
                "Only talk about things you actually know from the provided game context.",

            input:
                `GAME CONTEXT:
${context}

PLAYER MESSAGE:
${message}`
        });

        const reply = response.output_text;

        console.log("Player:", message);
        console.log("Context:", context);
        console.log("AI:", reply);

        res.json({
            reply: reply
        });

    } catch (error) {
        console.error("AI request failed:", error);

        res.status(500).json({
            error: "AI request failed"
        });
    }
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Roblox AI backend running on http://localhost:${PORT}`);
});