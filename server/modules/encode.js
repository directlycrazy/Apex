const ffmpeg = require('fluent-ffmpeg');

const encode = (path) => {
	return new Promise((res, rej) => {
		ffmpeg(`${__dirname}/temp/${path}.wav`).output(`${__dirname}/temp/${path}.mp3`).on('end', () => {
			return res();
		}).run();
	});
};

module.exports = { encode };