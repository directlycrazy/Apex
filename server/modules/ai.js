const axios = require('axios');
const { db } = require('./db');

const ai = (text, c) => {
    return new Promise(async (res) => {
        console.log(`Generating AI response to: ${text}`);
        let d = new Date().toString();

        let chat = {
            messages: [
                { role: 'system', content: 'You are Apex, a friendly desk side assistant. Your answers should be very short. The current time is ' + d }
            ]
        };

        let messages = await db.fetch_chat(c);

        if (messages?.items) {
            messages.items.forEach(item => {
                chat.messages.push({ role: "user", content: item.message });
                chat.messages.push({ role: "assistant", content: item.response });
            });
        }

        chat.messages.push({ role: 'user', content: text });

        axios({
            method: 'post',
            url: `https://api.cloudflare.com/client/v4/accounts/${process.env.CLOUDFLARE_ACCOUNT}/ai/run/@cf/meta/llama-2-7b-chat-int8`,
            headers: {
                Authorization: `Bearer ${process.env.CLOUDFLARE_API}`
            },
            data: JSON.stringify(chat)
        }).then(data => {
            return res(data.data?.result?.response?.replace(/\*([^*]+)\*/g, ""));
        });
    });
};

module.exports = { ai };