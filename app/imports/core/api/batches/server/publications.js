import { Batches } from "../batches";
import { GameLobbies } from "../../game-lobbies/game-lobbies";
import { Games } from "../../games/games";
import { Players } from "../../players/players";

Meteor.publish("admin-batches", function() {
  if (!this.userId) {
    return null;
  }

  return [Batches.find()];
});

Meteor.publish("public", function({ playerId }) {
  const player = Players.findOne(playerId);
  const cursor = Batches.find({ status: { $in: ["running", "finished"] } });
  const cursorRunning = Batches.find({ status: "running" });
  const ba = () => {
    if (cursor.count() === 0) {
      return false;
    }
    if (!player) {
      return cursorRunning.count() > 0;
    }
    const game = Games.findOne(player.gameId);
    const gameLobby = !game && GameLobbies.findOne(player.gameLobbyId);

    return (
      (gameLobby && gameLobby.status === "running") ||
      Batches.find({
        _id: game && game.batchId,
        status: { $in: ["running", "finished"] }
      }).count() === 1
    );
  };
  let initializing = true;
  let batchAvailable = ba();

  const handle = cursor.observeChanges({
    added: id => {
      if (!initializing) {
        const baNew = ba();
        if (baNew !== batchAvailable) {
          batchAvailable = baNew;
          this.changed("batchAvailable", "batchAvailable", { batchAvailable });
        }
      }
    },

    removed: id => {
      if (!initializing) {
        const baNew = ba();
        if (baNew !== batchAvailable) {
          batchAvailable = baNew;
          this.changed("batchAvailable", "batchAvailable", { batchAvailable });
        }
      }
    },

    changed: () => {
      if (!initializing) {
        const baNew = ba();
        if (baNew !== batchAvailable) {
          batchAvailable = baNew;
          this.changed("batchAvailable", "batchAvailable", { batchAvailable });
        }
      }
    }
  });

  initializing = false;
  this.added("batchAvailable", "batchAvailable", { batchAvailable });
  this.ready();
});
