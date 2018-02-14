import { withTracker } from "meteor/react-meteor-data";

import { GameLobbies } from "../../api/game-lobbies/game-lobbies";
import { Games } from "../../api/games/games";
import { PlayerRounds } from "../../api/player-rounds/player-rounds";
import { PlayerStages } from "../../api/player-stages/player-stages";
import { Players } from "../../api/players/players";
import { Rounds } from "../../api/rounds/rounds";
import { Stages } from "../../api/stages/stages";
import { Treatments } from "../../api/treatments/treatments";
import { augmentPlayerStageRound } from "../../api/player-stages/augment";
import { config } from "../../../game/client";
import { removePlayerId } from "./IdentifiedRoute";
import Game from "../components/Game";

// This will be part of the Game object eventually
export const gameName = "task";

export default withTracker(({ playerId, ...rest }) => {
  const loading = !Meteor.subscribe("game", { playerId }).ready();

  if (loading) {
    return {
      loading
    };
  }

  const player = Players.findOne(playerId);
  if (!player) {
    console.error(`no player!! (${playerId})`);
    removePlayerId(playerId);
    return { loading: true };
  }

  // There should always only be one game returned by the subscription
  const game = Games.findOne();
  if (!game) {
    const gameLobby = GameLobbies.findOne();
    if (!gameLobby) {
      throw new Error("game not found");
    }
    return {
      gameLobby,
      player,
      treatment: Treatments.findOne(gameLobby.treatmentId)
    };
  }

  const gameId = game._id;
  game.players = Players.find({ gameId }).fetch();
  game.rounds = Rounds.find({ gameId }).fetch();
  game.rounds.forEach(round => {
    round.stages = Stages.find({ roundId: round._id }).fetch();
  });

  const Round = config.RoundComponent;

  const stage = Stages.findOne(game.currentStageId);
  const round = game.rounds.find(r => r._id === stage.roundId);
  const treatment = Treatments.findOne(game.treatmentId);

  // We're having streaming updates from the backend that put us in an
  // uncertain state until everything is loaded correctly.
  const playerIds = game.players.map(p => p._id);
  const playerStagesCount = PlayerStages.find({
    stageId: stage._id,
    playerId: { $in: playerIds }
  }).count();
  const playerRoundsCount = PlayerRounds.find({
    roundId: round._id,
    playerId: { $in: playerIds }
  }).count();

  console.log(playerIds.length, playerStagesCount, playerRoundsCount);
  if (
    playerIds.length !== playerStagesCount ||
    playerIds.length !== playerRoundsCount
  ) {
    return { loading: true };
  }

  augmentPlayerStageRound(player, stage, round);
  game.players.forEach(player => {
    player.stage = { _id: stage._id };
    player.round = { _id: round._id };
    augmentPlayerStageRound(player, player.stage, player.round);
  });

  const params = {
    loading,
    Round,
    game,
    round,
    stage,
    player,
    treatment,
    playerStagesCount,
    playerRoundsCount,
    ...rest
  };

  return params;
})(Game);
