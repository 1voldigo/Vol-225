const axios = require("axios")
module.exports = {
	config: {
		name: 'itachi',
        aliases: ["loft"],
		version: '1.2',
		author: 'Luxion/fixed by Riley',
		countDown: 0,
		role: 0,
		shortDescription: 'AI CHAT',
		longDescription: {
			en: 'Chat with Xae'
		},
		category: 'Ai chat',
		guide: {
			en: '   {pn} <word>: chat with lina'
				+ '\Example:{pn} hi'
		}
	},

	langs: {
		en: {
			turnedOn: '𝘫𝘦 𝘴𝘦𝘳𝘢𝘪𝘴 𝘴𝘢𝘯𝘴 𝘱𝘪𝘵𝘪𝘦𝘳 𝘢𝘷𝘦𝘤 𝘷𝘰𝘶𝘴 🔱!',
			turnedOff: '𝘪𝘭 𝘦𝘴𝘵 𝘵𝘦𝘮𝘱𝘴 𝘲𝘶𝘦 𝘫𝘦 𝘱𝘢𝘳𝘵𝘦 , 𝘴𝘢𝘤𝘩𝘦𝘻 𝘲𝘶𝘦 𝘫𝘦 𝘳𝘦𝘷𝘪𝘦𝘯𝘥𝘳𝘢𝘪𝘴 💔🌱!',
			chatting: 'Already Chatting with 𝗟𝗢𝗙𝗧...',
			error: ' 𝘛𝘢 𝘱𝘢𝘴 𝘢𝘴𝘴𝘦𝘻 𝘥𝘦 𝘩𝘢𝘪𝘯𝘦 🙂'
		}
	},

	onStart: async function ({ args, threadsData, message, event, getLang }) {
		if (args[0] == 'on' || args[0] == 'off') {
			await threadsData.set(event.threadID, args[0] == "on", "settings.simsimi");
			return message.reply(args[0] == "on" ? getLang("turnedOn") : getLang("turnedOff"));
		}
		else if (args[0]) {
			const yourMessage = args.join(" ");
			try {
				const responseMessage = await getMessage(yourMessage);
				return message.reply(`${responseMessage}`);
			}
			catch (err) {
        console.log(err)
				return message.reply(getLang("error"));
			}
		}
	},

	onChat: async ({ args, message, threadsData, event, isUserCallCommand, getLang }) => {
		if (args.length > 1 && !isUserCallCommand && await threadsData.get(event.threadID, "settings.simsimi")) {
			try {
				const langCode = await threadsData.get(event.threadID, "settings.lang") || global.GoatBot.config.language;
				const responseMessage = await getMessage(args.join(" "), langCode);
				return message.reply(`${responseMessage}`);
			}
			catch (err) {
				return message.reply(getLang("error"));
			}
		}
	}
};

async function getMessage(yourMessage, langCode) {
	const res = await axios.post(
    'https://api.simsimi.vn/v1/simtalk',
    new URLSearchParams({
        'text': yourMessage,
        'lc': 'fr'
    })
);

	if (res.status > 200)
		throw new Error(res.data.success);

	return res.data.message;
      }
