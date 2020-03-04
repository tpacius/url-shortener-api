const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const sh = require('shorthash');
const db = require('./queries');

const app = express();
const port = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

const origin = {
    origin: isProd ? 'https://boiling-woodland-14324.herokuapp.com/' : '*',
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, }));
app.use(cors(origin));
app.use(compression());
app.use(helmet());

app.get('/urls', db.getURL);
app.post('/urls', db.createShortURL);

app.get('/stats', db.getStats);
app.get('/stats/total', db.getTotalStats);
app.get('/stats/daily', db.getDailyStats);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});