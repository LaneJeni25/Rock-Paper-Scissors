/*
 * Jeni Lane
 * Carina Take-Home Interview
 * 11/18/2020
 */
process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
const app = require('../index.js');
const supertest = require('supertest');
const request = supertest(app); // Used to test HTTP requests/responses
const db = require("../utilities/sqlconn.js");

beforeAll(async () => {
   await db.none("CREATE TABLE leaderboard (player_name TEXT UNIQUE PRIMARY KEY, " +
       "wins INTEGER NOT NULL, losses INTEGER NOT NULL, ties INTEGER NOT NULL)");
});

beforeEach(async () => {
   await db.none("INSERT INTO leaderboard (player_name, wins, losses, ties) " +
       "VALUES(Jim, 2, 1, 5)");
});

afterEach(async () => {
   await db.none("DELETE FROM leaderboard");
});

afterAll(async () => {
   await db.none("DROP TABLE leaderboard");
   db.end();
});

/*
 * Game Rules Tests for all win, loss, and tie conditions
 * Also simultaneously checks for valid query parameters and correctly-functioning
 * GET requests for /shoot.
 *
 * Game Rules:
 *  - rock beats scissors
 *  - scissors beats paper
 *  - paper beats rock
 *  - Matching plays are considered ties
 */

//describe("GET /shoot Endpoint Tests", () => {});
// Player Wins Tests
//test("Returns win when player chooses rock and computer chooses scissors")

//test("Returns win when player chooses scissors and computer chooses paper")

//test("Returns win when player chooses paper and computer chooses rock")

// Player Loses Tests
//test("Returns loss when player chooses scissors and computer chooses rock")

//test("Returns loss when player chooses paper and computer chooses scissors")

//test("Returns loss when player chooses rock and computer chooses paper")


// Player Ties Tests
//test("Returns tie for both players' choices being rock")

//test("Returns tie for both players' choices being scissors")

//test("Returns tie for both players' choices being paper")


/*
 * Validation Tests for invalid and missing query parameters
 *
 * Query Parameters:
 *  - play: required, can only be 'rock', 'paper', or 'scissors'
 *  - player_name: required
 */

/*describe("Invalid Data Tests", () => {
    test("Returns error for invalid play query parameter", async () => {
        const response = await request(app).get("/shoot?play=stick&player_name=Jim");
        expect(response.body).toEqual("\"play\" must be one of [rock, paper, scissors]");
        expect(response.statusCode).toBe(400);
    });
});

/!*
 * Tests for player_name having invalid data is not required at this time,
 * as the only requirement for this parameter currently is that it is not missing.
 *!/

describe("Missing Data Tests", () => {
    test("Returns error for missing both query parameters", async () => {
        const response = await request(app).get("/shoot");
        expect(response.body).toEqual("\"play\" is required");
        expect(response.statusCode).toBe(400);
    });

    test("Returns error for missing play query parameters", async () => {
        const response = await request(app).get("/shoot?player_name=Jim");
        expect(response.body).toEqual("\"play\" is required");
        expect(response.statusCode).toBe(400);
    });

    test("Returns error for missing player_name query parameters", async () => {
        const response = await request(app).get("/shoot?play=rock");
        expect(response.body).toEqual("\"player_name\" is required");
        expect(response.statusCode).toBe(400);
    });
});*/


/*
 * HTTP REST Interface Tests
 *
 * Requests:
 *  - GET request for /shoot (Tested in game rules section)
 *  - GET request for /leaderboard
 */


describe("GET /leaderboard Endpoint", () => {
   test("Gets the leaderboard endpoint", async done => {
      const response = await request.get("/leaderboard");

      expect(response.body.length).toBe(1);
      expect(response.body[0]).toHaveProperty("player_name");
      expect(response.body[0]).toHaveProperty("wins");
      expect(response.body[0]).toHaveProperty("losses");
      expect(response.body[0]).toHaveProperty("ties");
      expect(response.statusCode).toBe(200);
      done();
   });
});
