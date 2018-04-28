import SimpleSchema from "simpl-schema";

import { difficulties, taskData } from "./constants.js";

export const config = {
  // `conditions` define variables to run the game. These variables are combined
  // into treatments. Each game is ran with one treatment, which is a set of
  // conditions. Only one condition of a certain type is allowed per treatment
  // and each condition type is required.
  // A condition type if the first level key of the object bellow (playerCount,
  // altersCount...), the value object contains the different possible values
  // with a name (object key) and the value (value).
  // The playerCount condition is required by netwise core, it must always be
  // defined and determined how many players will be participating in a certain
  // game run. All other conditions are game specific and they are ignored by
  // netwise core.

  conditions: {
    playerCount: {
      description: "The Number of players participating in the given game",
      type: SimpleSchema.Integer,
      min: 1,
      max: 100
    },
    //TODO: should it specify which bot to add (i.e., bob or alice?)
    botsCount: {
      description: "The Number of bots that should participate in a given game",
      type: SimpleSchema.Integer,
      optional: true,
      min: 0,
      max: 100
    },
    // JS doesn't have Integer and Float as distinctive types, just Number.
    // So when we really don't want people to give a float (like playerCount)
    // simple schema gives you that custom type.
    altersCount: {
      description: "The Number of connections for each player",
      type: SimpleSchema.Integer,
      min: 0,
      max: 12,
      optional: false
    },
    rewiring: {
      description: "Can the player change their alters on each round",
      type: Boolean,
      optional: false
    },
    // environment: {
    //   description: "This is an example of multiple choice selector",
    //   type: String,
    //   regEx: /[a-zA-Z]+/,
    //   allowedValues: ["stationary", "nonStationary"],
    //   optional: false
    // },
    nRounds: {
      description: "This is the number of rounds for the game",
      type: SimpleSchema.Integer,
      min: 1,
      max: taskData.length, //can't have more rounds than tasks for this game
      optional: false
    }
  },

  // The init function should return a Game object with 3 properties attached to
  // it:
  // - the `rounds` (Array[Round]), which describe each round the game will be
  //   composed of. The Round object is described further bellow.
  // - the `players` (Array[Player]), which is the same list of Players that was
  //   passed in but you have the opportunity to augment these Players with
  //   extra information.
  //
  // The Round object describes how a Round should work from Netwise standpoint
  // (number of stages, durations) and it can contain extra metadata that you
  // want to keep about the round, such as the input value(s) (e.g. question)
  // and the expected output value (e.g. expected good answer).
  // The Round object's fields are:
  // - `stages` (Array[Stage]) which is an array Stage object, each object
  //   defining one stage of the round. The Stage object is further defined
  //   bellow
  //
  // The Stage object tells Netwise how the Stage should go down (duration)
  // and can also contain stage scoped game data:
  // - `name` (String) is the identifier for this stage, which can be used to
  //   programmatically identify the stage type.
  // - `displayName` (String) is the display name for this stage which will be diplayed
  //    in the UI.
  // - `durationInSeconds` (Int) is the maximum amount of time in seconds this stage
  //   should last.
  //   If all players have submitted before the timeout, the stage might last
  //   less than duration.
  //   If the value is 0, there is no maximum duration for
  //   this stage and the next stage only happens when all users have submitted.
  //
  init(treatment, players) {
    const playerIds = _.pluck(players, "_id");
    //construct the network for the first round randomly
    players.forEach((player, i) => {
      const alterIds = _.sample(
        _.without(playerIds, player._id),
        treatment.altersCount
      );
      player.set("avatar", `/avatars/jdenticon/${player._id}`);
      player.set("difficulty", difficulties[i % difficulties.length]); //equal number of difficulties
      player.set("alterIds", alterIds);
      player.set("cumulativeScore", 0);
    });

    //randomize the task sequence order
    const tasks = _.shuffle(taskData);

    const rounds = [];
    _.times(treatment.nRounds, i => {
      const stages = [
        {
          name: "response",
          displayName: "Response",
          durationInSeconds: 120
        }
      ];

      //only add the interactive stage if there are social connections
      if (treatment.altersCount > 0) {
        stages.push({
          name: "interactive",
          displayName: "Interactive Response",
          durationInSeconds: 120
        });
      }

      stages.push({
        name: "outcome",
        displayName: "Round Outcome",
        durationInSeconds: 120
      });

      rounds.push({
        stages,
        task: tasks[i]
      });
    });

    return {
      rounds,
      players
    };
  },

  // TODO add documentation for onRoundStart
  onRoundStart(game, round, players) {
    // so we can know the structure of the network at each round and track how it changed
    //As we change the network in the follow/unfollow in the UI using player.get("alterIds)"
    //we lose information about the changes that happen across rounds
    //This is a simple fix .. we do an extra set at the start of the round
    //Now for every round, we have a copy of who is following whom.
    players.forEach(player => {
      player.round.set("alterIds", player.get("alterIds"));
    });
  },

  // onRoundEnd is called each time a round ends. It is a good time to
  // update the players scores and make needed otherwise calculations.
  // onStageEnd is called for all players at once.
  // It arguments are:
  // - `game`, which is the same object returned by init, plus current state
  //   of the game data. The game contains all `players` and `rounds`.
  // - `round`, the current Round object (same as created in init).
  // - `players` is the array of all players at this stage
  onRoundEnd(game, round, players) {
    //update the cumulative Score for everyone after the round
    players.forEach(player => {
      const currentScore = player.get("cumulativeScore");
      const roundScore = player.round.get("score");
      player.set("cumulativeScore", Math.round(currentScore + roundScore));
    });
  },

  // onStageEnd is called each time a stage ends. It is a good time to
  // update the players scores and make needed otherwise calculations.
  // onStageEnd is called for all players at once.
  // It arguments are:
  // - `game`, which is the same object returned by init, plus current state
  //   of the game data. The game contains all `players` and `rounds`.
  // - `round`, the current Round object (same as created in init).
  // - `stage`, the current Stage object (same as created in init). The Stage
  //   object pass in onStageEnd also has accessor methods get and set to read
  //   and write stage scoped player data.
  // - `players` is the array of all players at this stage
  onStageEnd(game, round, stage, players) {
    //nothing to do if the stage is outcome, otherwise, compute the score of the players
    if (stage.name !== "outcome") {
      //compute the score of the players if the stage that ended is 'response' or 'interactive'
      const correctAnswer = round.get("task").correctAnswer;
      players.forEach(player => {
        const guess = player.round.get("guess");
        // If no guess given, score is 0
        const score = !guess
          ? 0
          : Math.round((1 - Math.abs(correctAnswer - guess)) * 100);

        player.round.set("score", score);
      });
    }

    //if interactive ended and we will go to the outcome, we want to color the scores at the outcome
    //such that the top 1/3 of the people their score is green, bottom 1/3 red, rest orange
    if (stage.name === "interactive") {
      const sortedPlayers = players.sort(compareScores);
      const top3rd = Math.floor(players.length / 3);
      const bottom3rd = Math.floor(players.length - players.length / 3);

      sortedPlayers.forEach((player, i) => {
        if (i < top3rd) {
          player.round.set("scoreColor", "green");
        } else if (i >= bottom3rd) {
          player.round.set("scoreColor", "red");
        } else {
          player.round.set("scoreColor", "orange");
        }
      });
    }
  }
};

// Helper function to sort players objects based on their score in the current round.
function compareScores(firstPlayer, secondPlayer) {
  const scoreA = firstPlayer.round.get("score");
  const scoreB = secondPlayer.round.get("score");

  let comparison = 0;
  if (scoreA > scoreB) {
    comparison = -1;
  } else if (scoreA < scoreB) {
    comparison = 1;
  }
  return comparison;
}
