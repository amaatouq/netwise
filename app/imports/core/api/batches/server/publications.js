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

const idFieldOnly = { fields: { _id: 1 } };

Meteor.publish("runningBatches", function({ playerId }) {
  // Only return _id field of running batches
  return Batches.find({ status: "running" }, idFieldOnly);
});

Meteor.publish("availableLobbies", function({ batchIds }) {
  // Only return _id field of lobbies in given batches with available slots
  return GameLobbies.find(
    { batchId: { $in: batchIds }, availableSlots: { $gt: 0 } },
    idFieldOnly
  );
});
