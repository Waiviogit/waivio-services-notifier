const { app } = require('./index');
const { nodeUrls, NotifiesType } = require('../config');
const views = require('./views');
const { clients } = require('../services');
const { check: checkCurrentStatus } = require('../jobs/checkRedisServices');
const Markup = require('telegraf/markup');
const { SENTRY_SUBSCRIBE } = require('../constants/notificationsType');

const getSubscribeKeyboard = async (ctx) => {
    const { client } = await clients.getOne({ client_id: ctx.from.id });
    return { reply_markup: { resize_keyboard: true, keyboard: [
        [ { text: `/subNodeStatuses ${client.subscribedNotifies.includes(NotifiesType[ 0 ]) ? '✔' : '❌'}` },
            { text: `/subSentry ${client.subscribedNotifies.includes(SENTRY_SUBSCRIBE) ? '✔' : '❌'}` } ],
        [ { text: '/back' } ]
    ] } };
};

app.command('start', async (ctx) => {
    console.log(`Command "/start" from ${ctx.from.id} in chat ${ctx.chat.id}`);
    await clients.Create({ client_id: ctx.from.id });
    await ctx.replyWithMarkdown(views.START_MESSAGE);
});

app.command('nodes', async (ctx) => {
    console.log(`Command "/nodes" from ${ctx.from.id} in chat ${ctx.chat.id}`);
    await ctx.replyWithMarkdown(JSON.stringify(nodeUrls));
});

app.command([ 'help', 'back' ], async (ctx) => {
    console.log(`Command "/help" from ${ctx.from.id} in chat ${ctx.chat.id}`);
    await ctx.reply(views.HELP_MESSAGE, Markup
        .keyboard([
            [ '/nodes', '/help' ],
            [ '/apilinks', '/status' ],
            [ '/subscribe' ]
        ])
        .oneTime()
        .resize()
        .extra()
    );
});


app.command('apilinks', async (ctx) => {
    console.log(`Command "/apilinks" from ${ctx.from.id} in chat ${ctx.chat.id}`);
    await ctx.reply(views.APILINKS_MESSAGE,
        Markup.inlineKeyboard([
            ...views.LIST_APILINKS.map(api => [ Markup.urlButton(api.name, api.link) ])
        ]).extra()
    );
});


app.command('subscribe', async (ctx) => {
    await ctx.reply(views.SUBSCRIBE_MESSAGE, await getSubscribeKeyboard(ctx));
});

app.command('subNodeStatuses', async (ctx) => {

    console.log(`Command "/subNodeStatuses" from ${ctx.from.id} in chat ${ctx.chat.id}`);
    const { client } = await clients.getOne({ client_id: ctx.from.id });
    const subMarker = client.subscribedNotifies.includes(NotifiesType[ 0 ]);
    const { result, error } = await clients.updateSubscribedNotifies({ client_id: ctx.chat.id, subscribedNotifies: NotifiesType, push: !subMarker });
    if(result.ok) {
        await ctx.reply(!subMarker ? views.SUB_NOTIFICATIONS_MESSAGE : views.UNSUB_MESSAGE, await getSubscribeKeyboard(ctx));
    }else{
        await ctx.replyWithMarkdown('Something went wrong!');
        console.error(`Error on "subNotifications" from chat ${ctx.chat.id}`);
        console.error(error);
    }
});

app.command('subSentry', async (ctx) => {
    console.log(`Command "/subSentry" from ${ctx.from.id} in chat ${ctx.chat.id}`);
    const { client } = await clients.getOne({ client_id: ctx.from.id });
    const subMarker = client.subscribedNotifies.includes(SENTRY_SUBSCRIBE);
    const { result, error } = await clients.updateSubscribedNotifies({ client_id: ctx.chat.id, subscribedNotifies: [ SENTRY_SUBSCRIBE ], push: !subMarker });
    if(result.ok) {
        await ctx.reply(!subMarker ? views.SENTRY_NOTIFICATIONS_MESSAGE : views.UNSUB_MESSAGE, await getSubscribeKeyboard(ctx));
    }else{
        await ctx.replyWithMarkdown('Something went wrong!');
        console.error(`Error on "subSentry" from chat ${ctx.chat.id}`);
        console.error(error);
    }
});

app.command('status', async (ctx) => {
    console.log(`Command "/status" from ${ctx.from.id} in chat ${ctx.chat.id}`);
    const { success_messages, warn_messages } = await checkCurrentStatus();
    let res_string = '-'.repeat(80) + '\n   `SUCCESS MESSAGES`  \n' + success_messages.join('\n' + '.'.repeat(80) + '\n') + '\n';
    res_string += '-'.repeat(80) + '\n   `WARNING MESSAGES`  \n' + warn_messages.join('\n' + '.'.repeat(80) + '\n') + '\n' + '-'.repeat(80);
    await ctx.replyWithMarkdown(res_string);
});

app.on('sticker', async (ctx) => {
    console.log(`"Sticker" from ${ctx.from.id} in chat ${ctx.chat.id}`);
    await ctx.replyWithMarkdown('hehe boayy');
});
