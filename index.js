const { app } = require('./telegram');
const commands = require('./telegram/commands');
const checkRedisServicesJob = require('./jobs/checkRedisServices');

app.launch();
console.log('BOT STARTED!');
