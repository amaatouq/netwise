import { withTracker } from "meteor/react-meteor-data";

import { GameLobbies } from "../../api/game-lobbies/game-lobbies";
import { Games } from "../../api/games/games";
import { Players } from "../../api/players/players";
import { Rounds } from "../../api/rounds/rounds";
import { Stages } from "../../api/stages/stages";
import { Treatments } from "../../api/treatments/treatments";
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

  const currentPlayer = Players.findOne(playerId);
  if (!currentPlayer) {
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
      currentPlayer,
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

  const currentRound = game.rounds[0];
  const currentStage = currentRound.stages[0];
  const treatment = Treatments.findOne(game.treatmentId);

  const params = {
    loading,
    Round,
    game,
    currentRound,
    currentStage,
    currentPlayer,
    treatment,
    ...rest
  };

  console.log("=================");
  console.log(game);
  console.log("-----------------");
  console.log(params);
  console.log("=================");

  return params;
})(Game);
