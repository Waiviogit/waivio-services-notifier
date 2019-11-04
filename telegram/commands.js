const { app } = require('./index');
const { nodeUrls } = require('../config');
const views = require('./views');

app.command('start', (ctx) => {
    console.log(`Command "/start" from ${ctx.from.id} in chat ${ctx.chat.id}`);
    ctx.replyWithMarkdown(views.START_MESSAGE);
});

app.command('nodes', (ctx) => {
    console.log(`Command "/nodes" from ${ctx.from.id} in chat ${ctx.chat.id}`);
    ctx.replyWithMarkdown(JSON.stringify(nodeUrls));
});

app.command('help', (ctx) => {
    console.log(`Command "/help" from ${ctx.from.id} in chat ${ctx.chat.id}`);
    ctx.replyWithMarkdown(views.HELP_MESSAGE);
});

app.on('sticker', (ctx) => {
    console.log(`"Sticker" from ${ctx.from.id} in chat ${ctx.chat.id}`);
    ctx.replyWithMarkdown('hehe boayy');
});
