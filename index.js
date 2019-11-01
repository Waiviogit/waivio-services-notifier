const Telegraf = require('telegraf');
const {TELEGRAM_BOT_TOKEN} = require('./config');

const app = new Telegraf(process.env.BOT_TOKEN || TELEGRAM_BOT_TOKEN);

app.telegram.getMe().then((botInfo) => {
    app.options.username = botInfo.username;

    app.command('help', (ctx) => {
        console.log(ctx.chat.id);
        ctx.replyWithMarkdown('some help response')
    });
});
app.start((ctx) => {
    console.log(ctx.from.id);
    app.telegram.sendMessage(ctx.chat.id, 'Welcome to waivio notify bot!')
});
app.on('sticker', (ctx) => ctx.reply('hehe'));
app.hears('hi', (ctx) => {
    console.log(ctx.chat.id);
    ctx.reply('Hey there');
});

app.launch();


(async () => {
    while (true) {
        await new Promise((r) => setTimeout(r, 2000));
        console.log('here');
        // await app.telegram.sendMessage(391339107, 'from cron') //me
        // await app.telegram.sendMessage(153550168, 'from cron') //vadim
        await app.telegram.sendMessage(-373002396, 'Maks Batya!') //chat waivio notifier
    }
})();
