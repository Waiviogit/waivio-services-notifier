const { app: telegram } = require('./telegram');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const dotenv = require('dotenv');
require('./telegram/commands');
require('./jobs/checkRedisServices');

dotenv.config();
telegram.launch();
console.log('BOT STARTED!');

const port = process.env.PORT || 4000;
const app = express();
app.listen(port, () => console.log(`Listening on ${port}`));
const router = require('./routes');

app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/', router);

app.use((req, res, next) => {
    res.status(res.result.status || 200).json(res.result.json);
});

app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500).json({ message: err.message });
});
