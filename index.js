const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const sh = require('shorthash');
const db = require('./queries');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true, }));
app.use(cors());
app.use(compression());
app.use(helmet());

const testResURL = {
    short_url: sh.unique('www.test.com'),
    url: 'www.test.com',
    total_visits: 0,
    created_date: new Date(),
};

const testResStats = {
    short_url: sh.unique('www.test.com'),
    total_visits: 15,
    visits_today: 5,
    created_date: new Date(),
    stats_date: new Date(),
}


app.get('/', (req, res) => {
    res.redirect(`http://${testResURL.url}`);
});

app.get('/urls', db.getURL);
app.post('/urls', db.createShortURL);

app.get('/stats', db.getStats);
app.get('/stats/total', db.getTotalStats);
app.get('/stats/daily', db.getDailyStats);

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});