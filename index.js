process
	.on('SIGTERM', shutdown('SIGTERM'));

const server = require("express")();
const line = require("@line/bot-sdk");
const line_config = {
	channelAccessToken: process.env.LINE_ACCESS_TOKEN,
	channelSecret: process.env.LINE_CHANNEL_SECRET
};
server.listen(process.env.PORT || 3000);

server.post('/bot/webhook', line.middleware(line_config), (req, res, next) => {
	let bot = new line.Client(line_config); 
	res.sendStatus(200);

	let events_processed = [];
	req.body.events.forEach((event) => {
		if (event.type == "message" && event.message.type == "text") {
			if (event.message.text == "Good morning!") {
				events_processed.push(bot.replyMessage(event.replyToken, {
					type: "text",
					text: "Glad to meet you!"
				}));
			}
		}
	});

	Promise.all(events_processed).then(
		(response) => {
			console.log(`${response.length} event(s) processed.`);
		}
	);
});

function shutdown(signal) {
	return (err) => {
		console.log(`${signal}...`);
		if (err) console.error(err.stack || err);
		setTimeout(() => {
			console.log('...waited 5s, existing');
			process.exit(err? 1 : 0);	
		}, 5000).unref();
	};
}
