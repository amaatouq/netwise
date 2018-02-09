import { withTracker } from "meteor/react-meteor-data";

import { GameLobbies } from "../../api/game-lobbies/game-lobbies";
import { Games } from "../../api/games/games";
import { PlayerStages } from "../../api/player-stages/player-stages";
import { Players } from "../../api/players/players";
import { Rounds } from "../../api/rounds/rounds";
import { Stages } from "../../api/stages/stages";
import { Treatments } from "../../api/treatments/treatments";
import { config } from "../../../game/client";
import { removePlayerId } from "./IdentifiedRoute";
import {
  submitPlayerRound,
  updatePlayerRoundData
} from "../../api/player-stages/methods";
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
    removePlayerId(null);
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
  const playerStage = PlayerStages.findOne({ stageId: stage._id, playerId });
  const round = game.rounds.find(r => r._id === stage.roundId);
  const treatment = Treatments.findOne(game.treatmentId);

  const playerStageId = playerStage._id;
  stage.set = (key, value) => {
    updatePlayerRoundData.call({ playerStageId, key, value });
  };

  stage.submit = () => {
    submitPlayerRound.call({ playerStageId });
  };

  stage.finished = Boolean(playerStage.submittedAt);

  const params = {
    loading,
    Round,
    game,
    round,
    stage,
    player,
    treatment,
    ...rest
  };

  return params;
})(Game);
