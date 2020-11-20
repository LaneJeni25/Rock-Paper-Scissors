/*
 * Jeni Lane
 * Carina Take-Home Interview
 * 11/18/2020
 */

const pgp = require('pg-promise')(); // Import pg-promise
pgp.pg.defaults.ssl = true; // Must set ssl usage to true for Heroku to accept our connection

// Create connection to Heroku Database either for testing or general use
let db;
if (process.env.NODE_ENV === "test") {
    db = pgp(process.env.TEST_DATABASE_URL);
} else {
    db = pgp(process.env.DATABASE_URL);
}

if (!db) {
    console.log("Error. Database not found. Please make sure that postgres is an addon.");
    process.exit(1);
}

module.exports = {db, pgp};