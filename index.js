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
    let play = req.body['play'];
    let playerName = req.body['player_name'];

    // Check if valid information was given for play and player_name
    /*const { error } = validatePlay({play, playerName});
    if (error) {
        res.status(400).send(error.details[0].message)
        return;
    }*/

    const schema = Joi.object({
        play: Joi.string() .valid('rock', 'paper', 'scissors') .required(),
        player_name: Joi.string() .required()
    });

    const validation = schema.validate(req.body);
    res.send(validation);
    return;

    // Computer chooses play at random
    let randomNum = Math.floor(Math.random() * choices.length);
    let choice = choices[randomNum];

    // Compare player versus computer for win/loss/tie and update leaderboard
    if (play === choice) {
        res.status(200).send(playerName + ' ties the round');
        db.none("INSERT INTO Leaderboard (PlayerName, Wins, Losses, Ties) "
                    + "VALUES($1, 0, 0, 0) ON DUPLICATE KEY UPDATE "
                    + "Ties = Ties + 1", [playerName])
            .then(() => {
                res.send({
                    success: true
                });
            }).catch((err) => {
                res.send({
                    success: false,
                    error: err + " - Could not update leaderboard"
                });
        });
    } else {
        if (play === 'rock') { // if player chose rock
            if (choice === 'scissors') {
                res.status(200).send(playerName + ' wins the round');
                db.none("INSERT INTO Leaderboard (PlayerName, Wins, Losses, Ties) "
                    + "VALUES($1, 0, 0, 0) ON DUPLICATE KEY UPDATE "
                    + "Wins = Wins + 1", [playerName])
                    .then(() => {
                        res.send({
                            success: true
                        });
                    }).catch((err) => {
                    res.send({
                        success: false,
                        error: err + " - Could not update leaderboard"
                    });
                });
            } else {
                res.status(200).send(playerName + ' loses the round');
                db.none("INSERT INTO Leaderboard (PlayerName, Wins, Losses, Ties) "
                    + "VALUES($1, 0, 0, 0) ON DUPLICATE KEY UPDATE "
                    + "Losses = Losses + 1", [playerName])
                    .then(() => {
                        res.send({
                            success: true
                        });
                    }).catch((err) => {
                    res.send({
                        success: false,
                        error: err + " - Could not update leaderboard"
                    });
                });
            }
        } else if (play === 'scissors') { // if player chose paper
            if (choice === 'paper') {
                res.status(200).send(playerName + ' wins the round');
                db.none("INSERT INTO Leaderboard (PlayerName, Wins, Losses, Ties) "
                    + "VALUES($1, 0, 0, 0) ON DUPLICATE KEY UPDATE "
                    + "Wins = Wins + 1", [playerName])
                    .then(() => {
                        res.send({
                            success: true
                        });
                    }).catch((err) => {
                    res.send({
                        success: false,
                        error: err + " - Could not update leaderboard"
                    });
                });
            } else {
                res.status(200).send(playerName + ' loses the round');
                db.none("INSERT INTO Leaderboard (PlayerName, Wins, Losses, Ties) "
                    + "VALUES($1, 0, 0, 0) ON DUPLICATE KEY UPDATE "
                    + "Losses = Losses + 1", [playerName])
                    .then(() => {
                        res.send({
                            success: true
                        });
                    }).catch((err) => {
                    res.send({
                        success: false,
                        error: err + " - Could not update leaderboard"
                    });
                });
            }
        } else { // if player chose paper
            if (choice === 'rock') {
                res.status(200).send(playerName + ' wins the round');
                db.none("INSERT INTO Leaderboard (PlayerName, Wins, Losses, Ties) "
                    + "VALUES($1, 0, 0, 0) ON DUPLICATE KEY UPDATE "
                    + "Wins = Wins + 1", [playerName])
                    .then(() => {
                        res.send({
                            success: true
                        });
                    }).catch((err) => {
                    res.send({
                        success: false,
                        error: err + " - Could not update leaderboard"
                    });
                });
            } else {
                res.status(200).send(playerName + ' loses the round');
                db.none("INSERT INTO Leaderboard (PlayerName, Wins, Losses, Ties) "
                    + "VALUES($1, 0, 0, 0) ON DUPLICATE KEY UPDATE "
                    + "Losses = Losses + 1", [playerName])
                    .then(() => {
                        res.send({
                            success: true
                        });
                    }).catch((err) => {
                    res.send({
                        success: false,
                        error: err + " - Could not update leaderboard"
                    });
                });
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
                names: data
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


// Needed to deal with DEPTH_ZERO_SELF_SIGNED_CERT error with Heroku
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const port = process.env.PORT || 5000; // Port Environment Variable
app.listen(port, () => {
    console.log("Server up and running on port: " + port);
});