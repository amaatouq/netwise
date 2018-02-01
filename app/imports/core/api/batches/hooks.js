import { Batches } from "./batches";
import { GameLobbies } from "../game-lobbies/game-lobbies";
import { Treatments } from "../treatments/treatments";

Batches.after.insert(function(userId, batch) {
  const gameLobbies = [];
  switch (batch.assignment) {
    case "simple":
      _.times(batch.simpleConfig.count, index => {
        const treatmentId = Random.choice(batch.simpleConfig.treatmentIds);
        gameLobbies.push({
          treatmentId,
          index
        });
      });
      break;
    case "simple":
      batch.completeConfig.treatments.forEach(({ count, treatmentId }) => {
        _.times(count, () => {
          gameLobbies.push({ treatmentId });
        });
      });
      gameLobbies = _.shuffle(gameLobbies);
      gameLobbies.forEach((l, index) => {
        l.index = index;
      });
      break;
    default:
      console.error("Batches.after: unknown assignment: " + batch.assignment);
      break;
  }

  const gameLobbyIds = gameLobbies.map(l => {
    l.status = batch.status;
    l.batchId = batch._id;

    const treatment = Treatments.findOne(l.treatmentId);
    l.availableSlots = treatment.condition("playerCount").value;

    return GameLobbies.insert(l);
  });
});

// Update status on GameLobbies
Batches.after.update(
  function(userId, batch, fieldNames, modifier, options) {
    if (!fieldNames.includes("status")) {
      return;
    }

    GameLobbies.update(
      {
        batchId: batch._id
      },
      {
        $set: {
          status: batch.status
        }
      },
      {
        multi: true
      }
    );
  },
  { fetchPrevious: false }
);
