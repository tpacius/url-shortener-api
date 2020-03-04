// const { Pool } = require('pg');
const sh = require('shorthash');
const { pool } = require('./config');

// const pool = new Pool({
//     user: 'api_user',
//     host: 'localhost',
//     database: 'url_api',
//     password: 'password',
//     port: 5432,
// });

const insertTotalVisits = (short_url, date) => {
    pool.query('INSERT INTO total_visits (short_url, total_visits, created_on) VALUES($1, 0, $2)', [short_url, date],
    (error, results) => {
        if (error) {
            console.log(error);
            throw error;
        } console.log(`Inserted ${short_url} into total_visits`);
    })
}

const insertDailyVisits = (short_url) => {
    const date = new Date();
    pool.query('SELECT * from daily_visits WHERE short_url = $1 and created_on = $2', [short_url, date],
    (error, results) => {
        if (results && results.rows.length > 0) {
            console.log(`Daily visits was already created for ${date}`);
        } else if (error) {
            console.log(error);
            throw error;
        } else {
            pool.query('INSERT INTO daily_visits (short_url, daily_visits, created_on) VALUES($1, 0, $2)', [short_url, date],
            (error, results) => {
                if (error) {
                    console.log(error);
                    throw error;
                } console.log(`Inserted ${short_url} into daily_visits for ${date}`);
            }) 
        }
    })
}

const incrementTotalVisit = (short_url) => {
    pool.query('UPDATE total_visits SET total_visits = total_visits + 1 WHERE short_url = $1', [short_url],
     (error, results) => {
        if (error) {
            console.log(error);
            throw error;
        } console.log(`Incremented total views for ${short_url}`);
    })
}

const incrementDailyVisit = (short_url) => {
    pool.query('UPDATE daily_visits SET daily_visits = daily_visits + 1 WHERE short_url = $1', [short_url],
    (error, results) => {
        if (error) {
            console.log(error);
            throw error;
        } console.log(`Incremented daily views for ${short_url}`);
    })
}


const createShortURL = (req, res) => {
    let { short_url } = req.body;
    const { long_url } = req.body;
    const date = new Date();

    if (!short_url) {
        short_url = sh.unique(long_url);
    }

    pool.query('SELECT short_url from urls WHERE long_url = $1', [long_url], (error, results) => {
        if (results && results.rows.length > 0) {
            insertTotalVisits(short_url, date);
            insertDailyVisits(short_url);
            res.status(200).send(`URL ${long_url} shortened to ${short_url}`);
        } else if (error) {
            console.log(error);
            throw error;
        } else {
            pool.query('INSERT INTO urls (short_url, long_url, created_on) VALUES ($1, $2, $3)',
            [short_url, long_url, date],
            (error) => {
            if (error) {
                console.log(error);
                throw error;
            } 
            insertTotalVisits(short_url, date);
            insertDailyVisits(short_url);
            res.status(201).send(`URL ${long_url} shortened to ${short_url}`);
            })
        }
    }); 
}

const getURL = (req, res) => {
    const { short_url } = req.body;
    pool.query('SELECT long_url from urls WHERE short_url = $1', [short_url], (error, results) => {
        if (error) {
            console.log(error);
            throw error;
        } 
        incrementTotalVisit(short_url);
        incrementDailyVisit(short_url);
        res.status(302).redirect(`http://${results.rows[0].long_url}`);
    })
}

const getStats = (req, res) => {
    const { short_url } = req.body;
    pool.query(`SELECT t.short_url, t.created_on, t.total_visits, d.daily_visits 
                FROM total_visits t INNER JOIN daily_visits d 
                ON t.short_url = d.short_url WHERE t.short_url = $1`, [short_url], (error, results) => {
                    if (error) {
                        console.log(error);
                        throw error;
                    } res.status(200).send(results.rows);
                });
}

const getTotalStats = (req, res) => {
    pool.query(`SELECT DISTINCT t.short_url, u.long_url, u.created_on, t.total_visits 
                FROM total_visits t INNER JOIN urls u 
                ON t.short_url = u.short_url`, (error, results) => {
                    if (error) {
                        console.log(error);
                        throw error;
                    } res.status(200).send(results.rows);
                });
}

const getDailyStats = (req, res) => {
    pool.query(`SELECT DISTINCT d.short_url, u.long_url, u.created_on, d.daily_visits 
                FROM daily_visits d INNER JOIN urls u 
                ON d.short_url = u.short_url`, (error, results) => {
                    if (error) {
                        console.log(error);
                        throw error;
                    } res.status(200).send(results.rows);
                });
}


module.exports = {
    createShortURL,
    getURL,
    getStats,
    getTotalStats,
    getDailyStats,
};