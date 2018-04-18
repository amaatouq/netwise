import { Batches } from "./batches";
import { GameLobbies } from "../game-lobbies/game-lobbies";
import { Games } from "../games/games";
import { Players } from "../players/players.js";
import { Treatments } from "../treatments/treatments";

// Create GameLobbies
Batches.after.insert(function(userId, batch) {
  let gameLobbies = [];
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
    case "complete":
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
    l.availableCount = treatment.condition("playerCount").value;

    return GameLobbies.insert(l);
  });
});

// Update status on GameLobbies
Batches.after.update(
  function(userId, { _id: batchId, status }, fieldNames, modifier, options) {
    if (!fieldNames.includes("status")) {
      return;
    }

    [Games, GameLobbies].forEach(coll => {
      coll.update({ batchId }, { $set: { status } }, { multi: true });
    });
  },
  { fetchPrevious: false }
);

// If batch cancelled, add exit info to players
Batches.after.update(
  function(userId, { _id: batchId, status }, fieldNames, modifier, options) {
    if (!fieldNames.includes("status")) {
      return;
    }

    if (status === "cancelled") {
      const games = Games.find({ batchId }).fetch();
      const gameLobbies = GameLobbies.find({ batchId }).fetch();
      const gplayerIds = _.flatten(_.pluck(games, "playerIds"));
      const glplayerIds = _.flatten(_.pluck(gameLobbies, "playerIds"));
      const playerIds = _.union(gplayerIds, glplayerIds);
      Players.update(
        { _id: { $in: playerIds } },
        { $set: { exitStatus: "gameCancelled", exitAt: new Date() } },
        { multi: true }
      );
    }
  },
  { fetchPrevious: false }
);
