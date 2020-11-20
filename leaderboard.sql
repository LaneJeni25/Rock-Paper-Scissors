DROP TABLE IF EXISTS leaderboard;

CREATE TABLE leaderboard (
    player_name TEXT UNIQUE PRIMARY KEY,
    wins INTEGER NOT NULL,
    losses INTEGER NOT NULL,
    ties INTEGER NOT NULL
);