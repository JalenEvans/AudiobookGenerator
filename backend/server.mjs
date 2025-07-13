import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { TextToSpeechClient } from '@google-cloud/text-to-speech';
import PDFParser from 'pdf2json';
import multer from 'multer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const upload = multer({ dest: 'uploads/' });

const client = new TextToSpeechClient();

app.use(cors());
app.use(express.static('public'));

function extractTextFromPDF(filepath) {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser();

        pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
        pdfParser.on("pdfParser_dataReady", pdfData => {
            if (!pdfData?.FormImage?.Pages) {
                return reject(new Error("Could not extract pages from PDF"));
            }
            
            const texts = [];

            pdfData.FormImage.Pages.forEach(page => {
                page.Texts.forEach(textObj => {
                    const line = textObj.R.map(r => decodeURIComponent(r.T)).join('');
                    texts.push(line);
                })
            });

            resolve(texts.join(' '));
        });

        pdfParser.loadPDF(filepath);
    });
}


app.post('/upload', upload.single('pdf'), async (req, res) => {
    try {
        const pdfPath = req.file.path
        const text = await extractTextFromPDF(pdfPath);
        const trimmedText = text.slice(0, 4500)

        const request = {
            input: { text: trimmedText },
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