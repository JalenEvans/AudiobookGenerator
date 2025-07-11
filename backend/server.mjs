import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import pdf from 'pdf-parse';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const upload = multer({ dest: 'uploads/' });

const client = new TextToSpeechClient();

app.use(cors());
app.use(express.static('public'));


app.post('/upload', upload.single('pdf'), async (req, res) => {
    try {
        const pdfPath = req.file.path
        const pdfBuffer = fs.readFileSync(pdfPath);
        const pdfData = await pdf(pdfBuffer);
        const text = pdfData.text.slice(0, 4500);

        const request = {
            input: { text },
            voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' },
            audioConfig: { audioEncoding: 'MP3' },
        };

        const [response] = await client.synthesizeSpeech(request);
        const outputPath = `public/audio/${req.file.filename}.mp3`;
        fs.writeFileSync(outputPath, response.audioContent);

        fs.unlinkSync(pdfPath);

        res.json({
            audioUrl: `/audio/${req.file.filename}.mp3`
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).send(`Failed to process PDF`);
    }
});

app.listen(process.env.PORT, () => { console.log(`Server running on http://localhost:${process.env.PORT}`)})