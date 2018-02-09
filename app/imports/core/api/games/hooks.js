// See if everyone is done with this stage
import { Batches } from "../batches/batches";
import { Games } from "../games/games";

// Check if game ended
Games.after.update(
  function(userId, game, fieldNames, modifier, options) {
    if (!fieldNames.includes("finishedAt")) {
      return;
    }

    const { batchId } = game;
    const query = { batchId, finishedAt: { $exists: false } };
    const batchFinished = Games.find(query).count() === 0;
    if (batchFinished) {
      Batches.update(batchId, { $set: { status: "finished" } });
    }
  },
  { fetchPrevious: false }
);
