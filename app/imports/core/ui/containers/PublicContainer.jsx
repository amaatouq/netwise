import { withTracker } from "meteor/react-meteor-data";

import { Batches } from "../../api/batches/batches.js";
import { GameLobbies } from "../../api/game-lobbies/game-lobbies.js";
import { Games } from "../../api/games/games.js";
import { PlayerRounds } from "../../api/player-rounds/player-rounds.js";
import { PlayerStages } from "../../api/player-stages/player-stages.js";
import { Treatments } from "../../api/treatments/treatments.js";
import Public from "../components/Public";

export default withTracker(({ loading, player, playerId, ...rest }) => {
  const subBatches = Meteor.subscribe("runningBatches", { playerId });
  const batches = Batches.find().fetch();
  const batchIds = _.pluck(batches, "_id");
  const subLobbies = Meteor.subscribe("availableLobbies", { batchIds });
  const subLobby = Meteor.subscribe("gameLobby", { playerId });
  const subGame = Meteor.subscribe("game", { playerId });
  loading =
    loading ||
    !subBatches.ready() ||
    !subLobbies.ready() ||
    !subLobby.ready() ||
    !subGame.ready();

  // If we have lobbies, we have available batches (should exclude player's lobby?)
  const batchAvailable = GameLobbies.find().count() > 0;

  // Current user's assigned game and lobby
  const gameLobby = GameLobbies.findOne({ playerIds: playerId });
  const game = Games.findOne({ playerIds: playerId });
  const treatmentId =
    (gameLobby && gameLobby.treatmentId) || (game && game.treatmentId);
  const treatment = Treatments.findOne(treatmentId);
  if (player && gameLobby && !treatment) {
    loading = true;
  }
  const playerStages = PlayerStages.find().fetch();
  const playerRounds = PlayerRounds.find().fetch();

  return {
    batchAvailable,
    renderPublic: batchAvailable || gameLobby || game,
    loading,
    player,
    gameLobby,
    game,
    playerStages,
    playerRounds,
    treatment,
    ...rest
  };
})(Public);
