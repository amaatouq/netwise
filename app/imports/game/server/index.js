import SimpleSchema from "simpl-schema";

import { difficulties, taskData } from "./constants.js";

export const config = {
  // treatmentAssignments is TBD, the following is a draft of how it might work.
  // treatmentAssignments is called in the case of a Custom randomization batch
  // Once the playerCount * game instances has been met, the treatmentAssignment
  // function is called with all the players and all the possible treatments.
  // The treatmentAssignments function should returns an array of game runs,
  // which is the combination of a treatment and a set of players as follows:
  //   [
  //     {
  //       treatment: { playerCount: "high", altersCount: "lowConnectivity", rewiring: "dynamic" },
  //       players: [Player, Player, Player, Player ...]
  //     },
  //     {
  //       treatment: { playerCount: "high", altersCount: "mediumConnectivity", rewiring: "dynamic" },
  //       players: [Player, Player, Player, Player ...]
  //     },
  //     ...
  //   ]
  // Every player should be assigned to a single game run and all players must
  // be assigned a game run and the exact same treatments should be returned in
  // the game runs.
  // treatmentAssignments: {
  //   gender(players, treatments) {
  //   }
  // },

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

  //TODO: maybe for now (while we have them in the code) we should move them to another file called
  //'conditions' so we don't clutter index.js in server
  conditions: {
    playerCount: {
      description: "The Number of players participating in the given game",
      type: SimpleSchema.Integer,
      min: 1,
      max: 100
    },
    // JS doesn't have Integer and Float as distinctive types, just Number.
    //So when we really don't want people to give a float (like playerCount)
    // simple schema gives you that custom type
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
    feedbackRate: {
      description: "how frequent the feedback is (1 = every round; 0 = never)",
      type: Number,
      min: 0,
      max: 1,
      optional: false
    },
    feedbackNoise: {
      description: "The level of noise added to performance of the alters",
      type: Number,
      min: 0,
      max: 1,
      optional: false
    },
    shockRate: {
      description: "The rate at which we change difficulties for the players",
      type: Number,
      min: 0,
      max: 1,
      optional: false
    },
    randomizeTask: {
      description: "Whether to randomize the sequence of the task or not",
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

  // init() is called when a new game instance is starting. It allows you
  // to define all proporties of this game run.
  //
  // Game batches are started from the admin UI in one of 3 modes:
  //   => Complete randomization: x chosen treatments * number of game instances
  //   => Simple randomization: randomly chosen treatments * number of instances
  //   => Custom randomization: x chosen treatments where custom function decides treatment * number of instances
  //
  // A treatment is a unique set of conditions. Each of the following is a
  // treatment:
  // - { playerCount: "high", altersCount: "lowConnectivity", rewiring: "dynamic" }
  // - { playerCount: "high", altersCount: "mediumConnectivity", rewiring: "dynamic" }
  // - { playerCount: "high", altersCount: "highConnectivity", rewiring: "dynamic" }
  // - { playerCount: "medium", altersCount: "lowConnectivity", rewiring: "dynamic" }
  // - ...
  //
  // Once the right amount of players are ready, Netwise calls this init
  // function with 2 arguments:
  // - a `treatment` (Object), which is an object containing conditions for this
  //   game. e.g. { playerCount: 6, rewiring: true, altersCount: 2 }
  // - an array of Players (Array[Player]). The Player objects contain player
  //   metadata collected or generated by Netwise such a a unique player ID,
  //   browser/OS/Platform data, information passed to Netwise when the user
  //   arrived such as a MTurk ID, etc. (Details of what info the Player object
  //   starts with is TBD).
  //
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
    players.forEach((player, i) => {
      const alterIds = _.sample(
        _.without(playerIds, player._id),
        treatment.altersCount
      );
      player.set("avatar", `/avatars/jdenticon/${player._id}`);
      player.set("difficulty", difficulties[i % 3]); //equal number of difficulties
      player.set("alterIds", alterIds);
      player.set("cumulativeScore", 0);
    });

    //only randomize the task if specified in the conditions
    const tasks = treatment.randomizeTask ? _.shuffle(taskData) : taskData;

    const rounds = [];
    _.times(treatment.nRounds, i => {
      const stages = [
        {
          name: "response",
          displayName: "Response",
          durationInSeconds: 120
        }
      ];

      if (treatment.altersCount > 0) {
        stages.push({
          name: "interactive",
          displayName: "Interactive Response",
          durationInSeconds: 120
        });
      }

      // adding "outcome" might look complicated but basically what we are checking is this:
      // when interactive with others, show the round outcome if there is feedback or rewiring
      // when no interactions with others only show the outcome stage when feedback is given
      if (
        (treatment.altersCount > 0 &&
          (treatment.feedbackRate > 0 || treatment.rewiring)) ||
        (treatment.altersCount === 0 && treatment.feedbackRate > 0)
      ) {
        stages.push({
          name: "outcome",
          displayName: "Round Outcome",
          durationInSeconds: 120
        });
      }

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

  //TODO: should we have onGameStart or onGameEnd?
  // for example, if one wants to play a special sound when the game starts to grab attention
  //or maybe conventing from 'game' score to real $ at the end of the game (to be shown at the exit survey)
  //I can't think of other use cases .. but maybe some people can.

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
    if (stage.name === "outcome") {
      return;
    }

    //TODO: computeScore(.) should happen before colorScores(.) but it is not the case.
    //this is leading to displayed error color when the ranking of the scores changes from the
    //in the interactive stage from the response stage.
    computeScore(players, round, {
      isInitialGuess: stage.name === 'response'
    });

    //color the score (for the front end display) based on ranking of the score
    if (stage.name === "interactive") {
      //update score after the interactive stage only
      colorScores(players);
    } else {
      //nothing to do when it is 'outcome' stage
      return;
    }
  },

  // TODO add documentation for onRoundStart
  onRoundStart(game, round, players) {
    console.log("round", round.index);
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
    
    //checking whether the game contains shock and whether it is time for it!
    //currentRoundNumber % nRounds/shockRate * nRounds => whether it is time!
    const shockTime =
      game.treatment.shockRate > 0 &&
      (round.index +1) %
        Math.round(
          game.treatment.nRounds /
            (game.treatment.shockRate * game.treatment.nRounds)
        ) ===
        0;
    //if it is time for a shock to arrive, then shock the players
    // i.e., change the difficulty of the task for them.
    shockTime ? shock(players) : null;
  }
};

// These are just some helper functions for the Guess the Correlation Game
// compute score.
function computeScore(players, round) {
  const correctAnswer = round.get("task").correctAnswer;

  players.forEach(player => {
    const guess = player.round.get("guess");
    // store the initialGuess, if it was the initial guess
    if (isInitialGuess) {
      player.round.set("initialGuess", guess);
    }

    // TODO: define the score function better
    // Current score fn:
    // 1) take difference between guess and answer
    // 2) if more than PI, get 0
    // 3) if less than PI, get (PI - diff) * 100 / PI
    // Perfect score: 100

    // If no guess given, score is 0
    const score = !guess
      ? 0
      : Math.max(0, (Math.PI - normalizeAngle(Math.abs(correctAnswer - guess)))) / Math.PI * 100;

    player.round.set("score", score);
  });
}

// We sort the players based on their score in this round in order to color code
// how we display their scores.
// The highest 1/3 players are green, the lowest 1/3 are red, and the rest are orange.
function colorScores(players) {
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

// Shocking the players by changing the difficulty of the problem that they see
// -1 permutation: easy => hard; medium => easy; hard => medium.
function shock(players) {
  console.log("time for shock");
  players.forEach(player => {
    const currentDifficulty = player.get("difficulty");
    if (currentDifficulty === "easy") {
      player.set("difficulty", "hard");
    } else if (currentDifficulty === "medium") {
      player.set("difficulty", "easy");
    } else {
      player.set("difficulty", "medium");
    }
  });
}

// Sampling from a normal distribution for the noisy feedback.
// Standard Normal variate using Box-Muller transform.
function normal_random() {
  var u = 0,
    v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}
