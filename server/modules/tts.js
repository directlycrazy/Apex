const ElevenLabs = require("elevenlabs-node");

//clyde 2EiwWnXFnvU5JabPnv8n
//matthew Yko7PKHZNXotIFUBG7I9

const voice = new ElevenLabs(
    {
        apiKey: process.env.ELEVENLABS_API,
        voiceId: "onwK4e9ZLuTAKqWW03F9",
    }
);

const tts = (text) => {
    return new Promise((res, rej) => {
        console.log(`Speech Processing`);

        let d = (new Date()).getTime();

        voice.textToSpeech({
            fileName: `${__dirname}/temp/${d}.mp3`,
            textInput: text,
        }).then((r) => {
            console.log('Speech Processing Complete');
            return res({ id: d, text: text });
        });
    });
};

module.exports = { tts };