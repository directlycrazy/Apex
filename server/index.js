require('dotenv').config();

const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');

const { ai } = require('./modules/ai');
const { tts } = require('./modules/tts');
const { db } = require('./modules/db');
const { encode } = require('./modules/encode');
const { audio_to_text, audio_exists } = require('./modules/transcribe');

const app = express();

app.use(cors());

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './modules/temp');
    },
    filename: function (req, file, callback) {
        callback(null, `${req.params.id}.wav`);
    }
});

const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    return res.sendStatus(200);
});

app.get('/chat/:id', async (req, res) => {
    let chat = await db.fetch_chat(req.params.id);
    if (!chat) return res.sendStatus(500);
    return res.send(chat);
});

app.post('/upload/:id', upload.single('audio'), async (req, res) => {
    let id;
    if (!req.query.chat) {
        id = await db.create_chat();
        await encode(req.params.id);
        return res.send({ id: id });
    } else {
        id = req.query.chat;
        await encode(req.params.id);
        return res.send({ id: id });
    }
});

app.get('/transcribe/:id', async (req, res) => {
    let path = await audio_exists(req.params.id);
    if (!path) return res.sendStatus(404);
    let text = await audio_to_text(req.params.id);
    return res.send({ response: text });
});

app.get('/text', async (req, res) => {
    if (!req.query.q) return res.sendStatus(401);
    let response = await ai(req.query.q);
    return res.send(response);
});

app.get('/audio', async (req, res) => {
    if (!req.query.q) return res.sendStatus(401);
    if (!req.query.chat) return res.sendStatus(401);
    let response = await ai(req.query.q, req.query.chat);
    let tts_res = await tts(response);
    await db.create_message(req.query.chat, req.query.q, response);
    return res.send(tts_res);
});

app.get('/stream/:id', (req, res) => {
    let filename = `${__dirname}/modules/temp/${req.params.id}.mp3`;
    if (!fs.existsSync(filename)) return res.sendStatus(404);
    return res.sendFile(filename);
});

process.on('uncaughtException', function (err) {
    console.error(err);
    console.log("An error occurred.");
});

app.listen(process.env.PORT || 3000, () => console.log('Server Started Successfully'));