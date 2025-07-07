import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const TTS_API_KEY = process.env.TTS_API_KEY;

app.post("/tts", async (req, res) => {
    const { text } = req.body;

    const response = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${TTS_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            input: { text },
            voice: { languageCode: 'en-US', name: 'en-US-Wavenet-D' },
            audioConfig: { audioEncoding: 'MP3' }
        })
    });

    const data = await response.json();
    res.json({ audioContent: data.audioContent });
});

app.listen(process.env.PORT, () => { console.log(`Server running on http://localhost:${process.env.PORT}`)})