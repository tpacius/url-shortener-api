CREATE TABLE urls (
  ID SERIAL PRIMARY KEY,
  short_url VARCHAR(25) NOT NULL,
  long_url VARCHAR(255) NOT NULL,
  created_on DATE NOT NULL
);

CREATE TABLE total_visits (
    short_url VARCHAR(25) NOT NULL,
    total_visits INT NOT NULL,
    created_on DATE NOT NULL
);

CREATE TABLE daily_visits (
    short_url VARCHAR(25) NOT NULL,
    daily_visits INT NOT NULL,
    created_on DATE NOT NULL
);

INSERT INTO urls (short_url, long_url, created_on)
VALUES ('Z1lTluj', 'test.com', current_timestamp);

INSERT INTO total_visits (short_url, total_visits, created_on)
VALUES ('Z1lTluj', 10, current_timestamp);

INSERT INTO daily_visits (short_url, daily_visits, created_on)
VALUES ('Z1lTluj', 5, current_timestamp);