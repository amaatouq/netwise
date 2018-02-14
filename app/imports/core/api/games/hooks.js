// See if everyone is done with this stage
import { Batches } from "../batches/batches";
import { GameLobbies } from "../game-lobbies/game-lobbies";
import { Games } from "../games/games";

// Check if game ended
Games.after.update(
  function(userId, game, fieldNames, modifier, options) {
    if (!fieldNames.includes("finishedAt")) {
      return;
    }

    const { batchId } = game;
    const gameQuery = { batchId, finishedAt: { $exists: false } };
    const noGames = Games.find(gameQuery).count() === 0;
    const gameLobbiesQuery = { batchId, availableSlots: { $gt: 0 } };
    const noGameLobbies = GameLobbies.find(gameLobbiesQuery).count() === 0;
    if (noGames && noGameLobbies) {
      Batches.update(batchId, { $set: { status: "finished" } });
    }
  },
  { fetchPrevious: false }
);
