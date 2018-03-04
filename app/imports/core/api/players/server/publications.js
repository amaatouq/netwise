import { Players } from "../players.js";

Meteor.publish({
  playerInfo({ playerId }) {
    return Players.find(playerId);
  }
});
