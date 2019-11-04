const { app } = require('./index');
const { nodeUrls, NotifiesType } = require('../config');
const views = require('./views');
const { clients } = require('../services');

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

app.command('subNotifications', async (ctx) => {
    console.log(`Command "/subNotifications" from ${ctx.from.id} in chat ${ctx.chat.id}`);
    const { result, error } = await clients.updateSubscribedNotifies({ client_id: ctx.chat.id, subscribedNotifies: [ ...NotifiesType ] });
    if(result.ok) {
        ctx.replyWithMarkdown(views.SUB_NOTIFICATIONS_MESSAGE);
    }else{
        ctx.replyWithMarkdown('Something went wrong!');
        console.error(`Error on "subNotifications" from chat ${ctx.chat.id}`);
        console.error(error);
    }
});

app.on('sticker', (ctx) => {
    console.log(`"Sticker" from ${ctx.from.id} in chat ${ctx.chat.id}`);
    ctx.replyWithMarkdown('hehe boayy');
});
