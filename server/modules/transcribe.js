const axios = require('axios');
const fs = require('fs');
const { Blob } = require('buffer');

const audio_exists = async (path) => {
    let fullpath = `${__dirname}/temp/${path}.wav`;
    if (fs.existsSync(fullpath)) return fullpath;
    return false;
};

const audio_to_text = (file) => {
    return new Promise(res => {
        console.log(`Transcribing text from audio`);

        const buffer = fs.readFileSync(`${__dirname}/temp/${file}.mp3`);
        const blob = new Blob([buffer]);
        axios({
            method: 'post',
            url: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT}/ai/run/@cf/openai/whisper`,
            headers: {
                Authorization: `Bearer ${process.env.CLOUDFLARE_API}`
            },
            data: blob
        }).then(data => {
            let text = data?.data?.result?.text;
            console.log(`Successfully transcribed ${text}`);
            return res(text);
        });
    });
};

module.exports = { audio_to_text, audio_exists };