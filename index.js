/*
 * Jeni Lane
 * Carina Take-Home Interview
 * 11/18/2020
 */

const express = require('express'); // Import express.js
const Joi = require('joi'); // Import Joi

const app = express(); // Creates a new instance of an express application

const bodyParser = require("body-parser");
app.use(bodyParser.json()); // Allows for parsing of the body of POST requests, that are encoded in JSON

/*
 * Current choices for Rock, Paper, Scissors
 * Can be updated later if more choices are desired
 */
const choices = [
    'rock',
    'paper',
    'scissors'
]

const db = require('./utilities/sqlconn.js'); // Heroku database variable endpoint

let middleware = require('./utilities/middleware'); // Middleware endpoint


// Default Homepage Message
app.get('/', (req, res) => {
   res.send('Welcome to the Carina Care Rock-Paper-Scissors Take-Home Interview!'
   + '\nPlease choose rock, paper, or scissors and enter your player-name to start.');


   // HTML version of homepage
   /*
   res.writeHead(200, {'Content-Type': 'text/html'});
    res.write('<h' + i + ' style="color:black">Welcome to the Carina Care Rock-Paper-Scissors Take-Home Interview!
    Please choose rock, paper, or scissors and enter your player-name to start.</h' + i + '>');
    res.end(); //end the response
    */
});

/*
 * Handles GET endpoint at /shoot that accepts the query parameters
 * play (rock, paper, or scissors) and player_name and returns a
 * string that says "player_name" wins/loses/ties the round".
 */
app.get('/shoot', (req, res) => {
    let play = req.query['play'];
    let playerName = req.query['player_name'];

    // Check if valid information was given for play and player_name
    const { error } = validatePlay(req.query);
    if (error) {
        res.status(400).send(error.details[0].message)
        return;
    }

    // Computer chooses play at random
    let randomNum = Math.floor(Math.random() * choices.length);
    let choice = choices[randomNum];

    // Compare player versus computer for win/loss/tie and update leaderboard
    if (play === choice) { // player ties
        updateLeaderboard(playerName, 0, res);
    } else {
        if (play === 'rock') { // if player chose rock
            if (choice === 'scissors') {
                updateLeaderboard(playerName, 1, res); // player wins
            } else {
                updateLeaderboard(playerName, -1, res); // player loses
            }
        } else if (play === 'scissors') { // if player chose paper
            if (choice === 'paper') {
                updateLeaderboard(playerName, 1, res);
            } else {
                updateLeaderboard(playerName, -1, res);
            }
        } else { // if player chose paper
            if (choice === 'rock') {
                updateLeaderboard(playerName, 1, res);
            } else {
                updateLeaderboard(playerName, -1, res);
            }
        }
    }

});

/*
 * Handles GET endpoint at /leaderboard that returns a scoreboard of
 * each player's name and the number of rounds they have won
 * in descending order in the form an array of objects in
 * a JSON body.
 */
app.get('/leaderboard', (req, res) => {
    db.manyOrNone('SELECT * FROM leaderboard')
        .then((data) => {
            res.send({
                leaderboard: data
            });
        }).catch((err) => {
            res.send({
                success: false,
                error: err + " - Could not access leaderboard data"
            })
        });
});


/*
 * Validates if player entered a valid choice of rock, paper, or scissors
 * and entered a name for themself.
 */
function validatePlay(data) {
    const schema = Joi.object({
        play: Joi.string()
            .valid("rock", "paper", "scissors")
            .required(),

        player_name: Joi.string()
            .required()
    });

    return schema.validate(data);
}

/*
 * Given the corresponding value:
 * -1 = loss
 * 0 = tie
 * 1 = win
 *
 * Send user corresponding message and
 * update the leaderboard
 */
function updateLeaderboard(playerName, outcome, res) {
    if (outcome === -1) {
        db.none("BEGIN IF EXISTS (SELECT PlayerName FROM Leaderboard WHERE PlayerName = $1) "
                    + " UPDATE Leaderboard SET Losses = Losses + 1 WHERE PlayerName = $1"
                    + "ELSE INSERT INTO Leaderboard (PlayerName, Wins, Losses, Ties) VALUES ($1, 0, 1, 0) END",
            [playerName])
            .then(() => {
                res.status(200).send(playerName + ' loses the round');
            }).catch((err) => {
            res.send({
                success: false,
                error: err + " - Could not update leaderboard"
            });
        });
    } else if (outcome === 0) {
        db.none("BEGIN IF EXISTS (SELECT PlayerName FROM Leaderboard WHERE PlayerName = $1) "
            + " UPDATE Leaderboard SET Ties = Ties + 1 WHERE PlayerName = $1"
            + "ELSE INSERT INTO Leaderboard (PlayerName, Wins, Losses, Ties) VALUES ($1, 0, 0, 1) END",
            [playerName])
            .then(() => {
                res.status(200).send(playerName + ' ties the round');
            }).catch((err) => {
            res.send({
                success: false,
                error: err + " - Could not update leaderboard"
            });
        });
    } else {
        db.none("BEGIN IF EXISTS (SELECT PlayerName FROM Leaderboard WHERE PlayerName = $1) " +
            "UPDATE Leaderboard SET Wins = Wins + 1 WHERE PlayerName = $1 " +
            "ELSE INSERT INTO Leaderboard (PlayerName, Wins, Losses, Ties) VALUES ($1, 1, 0, 0) END", [playerName])
            .then(() => {
                res.status(200).send(playerName + ' wins the round');
            }).catch((err) => {
            res.send({
                success: false,
                error: err + " - Could not update leaderboard"
            });
        });
    }
}


// Needed to deal with DEPTH_ZERO_SELF_SIGNED_CERT error with Heroku
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const port = process.env.PORT || 5000; // Port Environment Variable
app.listen(port, () => {
    console.log("Server up and running on port: " + port);
});