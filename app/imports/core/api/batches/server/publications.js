import { Batches } from "../batches";
import { GameLobbies } from "../../game-lobbies/game-lobbies";
import { Games } from "../../games/games";
import { Players } from "../../players/players";

const raw = GameLobbies.rawCollection();
const aggregateGameLobbies = Meteor.wrapAsync(raw.aggregate, raw);

Meteor.publish("admin-batches", function() {
  if (!this.userId) {
    return null;
  }

  return [Batches.find()];
});

Meteor.publish("public", function({ playerId }) {
  let player = Players.findOne(playerId);

  const cursorRunningFinished = Batches.find({
    status: { $in: ["running", "finished"] }
  });
  const cursorRunning = Batches.find({ status: "running" });

  const batchAvail = () => {
    // If there are not Batches running or finished at all, bail early
    if (cursorRunningFinished.count() === 0) {
      return false;
    }

    // If we have no player and no "running" batches, bail
    if (!player) {
      if (cursorRunning.count() === 0) {
        return;
      }

      // We still have running batches, verify a game lobby still has room
      const batches = Batches.find(
        { status: "running" },
        { fields: { _id: 1 } }
      ).fetch();
      const batchIds = _.pluck(batches, "_id");
      // Aggregating lobbies' available slots withing a batch
      const results = aggregateGameLobbies([
        { $match: { batchId: { $in: batchIds } } },
        { $project: { availableSlots: { $sum: "$availableSlots" } } }
      ]);
      return Boolean(results.find(r => r.availableSlots > 0));
    }

    // See if the user is already assigned a game or a lobby
    const game = Games.findOne(player.gameId);
    const gameLobby = !game && GameLobbies.findOne(player.gameLobbyId);

    // console.log(playerId, player.gameId, game);
    // if (!player.gameId) {
    //   console.log("NO GAME ID");
    //   console.log(JSON.stringify(player));
    // }

    return (
      // If there is a game lobby running
      (gameLobby && gameLobby.status === "running") ||
      // Or a game that is running/finished
      (game &&
        (game.status === "running" ||
          game.status === "finished" ||
          game.finishedAt))
    );
  };

  let initializing = true;
  let batchAvailable = batchAvail();

  // Anytime a batch changes state, run the batchAvail function
  const update = () => {
    if (initializing) {
      return;
    }
    const baNew = batchAvail();
    if (baNew !== batchAvailable) {
      batchAvailable = baNew;
      this.changed("batchAvailable", "batchAvailable", { batchAvailable });
    }
  };

  const batchHandle = cursorRunningFinished.observeChanges({
    added: update,
    removed: update,
    changed: update
  });

  let gameHandle;
  const followGame = () => {
    if (gameHandle || !player || !player.gameId) {
      return;
    }
    gameHandle = Games.find(player.gameId).observeChanges({
      added: update,
      removed: update,
      changed: update
    });
  };
  let gameLobbyHandle;
  const followGameLobby = () => {
    if (gameLobbyHandle || !player || !player.gameLobbyId) {
      return;
    }
    gameLobbyHandle = GameLobbies.find(player.gameLobbyId).observeChanges({
      added: update,
      removed: update,
      changed: update
    });
  };

  followGame();
  followGameLobby();

  const updatePlayer = () => {
    player = Players.findOne(playerId);
    followGame();
    followGameLobby();
  };
  playerHandle = Players.find(playerId).observeChanges({
    added: updatePlayer,
    removed: updatePlayer,
    changed: updatePlayer
  });

  initializing = false;
  this.added("batchAvailable", "batchAvailable", { batchAvailable });
  this.ready();
  this.onStop(() => {
    batchHandle.stop();
    playerHandle && playerHandle.stop();
    gameHandle && gameHandle.stop();
    gameLobbyHandle && gameLobbyHandle.stop();
  });
});
