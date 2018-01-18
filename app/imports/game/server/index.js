// config contains the server side configuration for this game. It is used by
// netwise core to initialize and run the game.
import { avatarPaths, difficulties, roundCount, taskData } from "./constants";

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
  conditions: {
    playersCount: {
      high: 12,
      medium: 6,
      low: 3,
      solo: 1
    },
    altersCount: {
      highConnectivity: 8,
      mediumConnectivity: 4,
      lowConnectivity: 2
    },
    rewiring: {
      static: false,
      dynamic: true
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
  // - a `conditions` (Object), which is an object containing conditions for this
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
  // - any extra `data` (Object, optional) that is relevant to this game
  //   instance. This could be any value you wish to store for you game that is
  //   not round or player dependent or scoped.
  //
  // The Round object describes how a Round should work from Netwise standpoint
  // (number of stages, durations) and it can contain extra metadata that you
  // want to keep about the round, such as the input value(s) (e.g. question)
  // and the expected output value (e.g. expected good answer).
  // The Round object's fields are:
  // - `stages` (Array[Stage]) which is an array Stage object, each object
  //   defining one stage of the round. The Stage object is further defined
  //   bellow
  // - `data` (Object, optional) is an open object for the game to add custom
  //   values needed in this round, such as input/output values (e.g. path to
  //   plot image, correct answer, etc.)
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
  // - `data` (Object, optional) is an open object for the game to add custom
  //   values needed in this stage, similarly to Rounds, Games and Players.
  //
  init(conditions, players) {
    const avatars = _.shuffle(avatarPaths);

    players.forEach((player, i) => {
      const alters = _.sample(
        _.without(players, player),
        conditions.altersCount
      );
      player.data = {
        avatar: avatars[i],
        difficulty: Random.choice(difficulties),
        alterIds: _.pluck(alters, "_id")
      };
    });

    const tasks = _.shuffle(taskData);

    const rounds = [];
    _.times(10, i => {
      const stages = [
        {
          name: "response",
          displayName: "Response",
          durationInSeconds: 45
        }
      ];

      if (conditions.playersCount !== 1) {
        stages.push({
          name: "interactive",
          displayName: "Interactive Response",
          durationInSeconds: 30
        });
      }

      // Dont't include a cooperative stage on the last round.
      if (conditions.rewiring && i !== roundCount - 1) {
        stages.push({
          name: "network",
          displayName: "Network update",
          durationInSeconds: 30
        });
      }

      rounds.push({
        stages,
        data: {
          task: tasks[i]
        }
      });
    });

    return {
      rounds,
      players
    };
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
    const currentPlayerValue = player.get("value");
  }
};
