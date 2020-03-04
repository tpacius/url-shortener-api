
My solution to the URL shortener assignment is Node back end and Postgres Database. I used Postgres over MongoDB because I prefer SQL based databases and I found that the API requirements didn't seem to be a good use case for MongoDB collection. 

I used the following libraries in my solution. compression, cors, dotenv, express, helmet, ps, and shorthash. Compression, cors, dotenv and helmet were used with Express to get the project ready to be production ready on Heroku. Express to handle the API routes. PG as the node-postgres client and I used shorthash to hash the URLs because the prompt specified that there wasn't an need for unique hashs if the same url is provided.

To run the project, it is expected that the user has Postgres installed with a user 'api_user' and the password 'password' created in a database called 'url_api'. This can be updated the .env file.

Once this postgres user is set up the DB tables can be initialized using the init.sql script.

The server can then be run using npm run start.

Routes/Endpoints

POST /urls returns short link
{
    short_url?: Custom shortlink, optional parameter,
    long_url: Link to be shortened, required
}

GET /urls redirects to original link
{
    short_url: shortlink, required
}

GET /stats returns total visits, creation date, and visits today for given short link
{
    short_url: shortlink, required
}

GET /stats/total returns total visits for all short links

GET /stats/daily returns today's visits for all short links

The project can also be accessed here via my Heroku deployment. [https://boiling-woodland-14324.herokuapp.com/]