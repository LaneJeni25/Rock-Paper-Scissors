//import {describe, test} from "@jest/globals";

const validatePlay = require("../index");

/*
 * Game Rules Tests for all win, loss, and tie conditions
 *
 * Game Rules:
 *  - rock beats scissors
 *  - scissors beats paper
 *  - paper beats rock
 *  - Matching plays are considered ties
 */

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
 * Validation Tests for valid, invalid, and missing query parameters
 *
 * Query Parameters:
 *  - play: required, must be a string, and can only be 'rock', 'paper', or 'scissors'
 *  - player_name: required, and must be a string
 */

// Valid Data Tests
describe("ValidatePlay Function", () => {
   test("Returns value for valid query parameters where play=rock", () => {
      const input = { play: "rock", player_name: "Jim"};

      const output = { value: { play: "rock", player_name: "Jim"}};

      expect(validatePlay(input)).toBe(output);
   });
});

describe("ValidatePlay Function", () => {
   test("Returns value for valid query parameters where play=paper", () => {
      const input = { play: "rock", player_name: "Jim"};

      const output = { value: { play: "rock", player_name: "Jim"}};

      expect(validatePlay(input)).toBe(output);
   });
});

describe("ValidatePlay Function", () => {
   test("Returns value for valid query parameters where play=scissors", () => {
      const input = { play: "rock", player_name: "Jim"};

      const output = { value: { play: "rock", player_name: "Jim"}};

      expect(validatePlay(input)).toBe(output);
   });
});


// Invalid Data Tests
//test("Returns error for invalid query parameters")

//test("Returns error for invalid play query parameter but valid player_name")

//test("Returns error for invalid player_name but valid play query parameter")


// Missing Data Tests
//test("Returns error for missing both query parameters")

//test("Returns error for missing play query parameter")

//test("Returns error for missing player_name query parameter")