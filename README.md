# Carina Care Take-Home Interview #
## Code by Jeni Lane ##
#### Created November 2020 ####

The following is an application that plays Rock Paper Scissors by receiving requests via HTTP REST and returns results in the body. The project contains a test suite that validates the rules of the game and the HTTP REST interface is used to communicate with the application.

The game rules are as follows:
- `rock` beats `scissors`
- `scissors` beats `paper`
- `paper` beats `rock`
- Matching plays are considered ties

The application may be updated at a later date to include more choices and win conditions/rules.

The application plays by making a random choice each round. There is currently no complex AI or "unwinnable" modes included in the application, though they may be added at a later date.

The application exposes a `GET` endpoint at `/shoot` that takes a query parameter `play` that accepts `rock`, `paper`, or `scissors`, as well a query parameter `player_name` that takes the player's name. The endpoint then returns a `200 OK` with a string in the body that says 

`<Player Name> wins/loses/ties the round`. 

The application also exposes a `GET` endpoint at `/leaderboard` that returns a leaderboard in the form of a JSON body that contains an array of objects, with each object containing the name of the player and the number of rounds won. The list is sorted by number of rounds won, descending.

