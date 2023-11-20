const PocketBase = require('pocketbase/cjs');

const pb = new PocketBase(`https://apexai.pockethost.io/`);

const auth = pb.admins.authWithPassword(process.env.PB_EMAIL, process.env.PB_PASSWORD);

const db = {};

db.fetch_chat = async (id) => {
	if (!pb.authStore.isValid) return false;
	try {
		let chat = await pb.collection('chats').getOne(id);
		let messages = await pb.collection('messages').getList(1, 5, {
			filter: `chat.id = "${id}"`,
			sort: '+created'
		});
		return messages;
	} catch (e) {
		return false;
	}
};

db.create_message = async (chat, message, response) => {
	if (!pb.authStore.isValid) return false;
	try {
		const record = await pb.collection('messages').create({
			message: message,
			response: response,
			chat: chat
		});
		return record.id;
	} catch (e) {
		return false;
	}
};

db.create_chat = async () => {
	if (!pb.authStore.isValid) return false;
	try {
		const record = await pb.collection('chats').create({
			time: new Date().getTime()
		});
		return record.id;
	} catch (e) {
		return false;
	}
};

module.exports = { db };