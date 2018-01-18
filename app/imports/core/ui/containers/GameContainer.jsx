import { withTracker } from "meteor/react-meteor-data";

import { Games } from "../../api/games/games";
import { Players } from "../../api/players/players";
import { Rounds } from "../../api/rounds/rounds";
import { Stages } from "../../api/stages/stages";
import { config } from "../../../game/client";
import Game from "../components/Game";

// This will be part of the Game object eventually
export const gameName = "task";

export default withTracker(props => {
  const loading = !Meteor.subscribe("game").ready();

  if (loading) {
    return {
      loading
    };
  }

  // There should always only be one game returned by the subscription
  const game = Games.findOne();
  if (!game) {
    throw new Error("game not found");
  }

  const gameId = game._id;
  game.players = Players.find({ gameId }).fetch();
  game.rounds = Rounds.find({ gameId }).fetch();
  game.rounds.forEach(round => {
    round.stages = Stages.find({ roundId: round._id }).fetch();
  });

  const Round = config.RoundComponent;

  export const currentRound = game.rounds[0];
  export const currentStage = currentRound.stages[0];
  export const currentPlayer = game.players[0];

  const params = {
    loading,
    Round,
    game,
    currentRound,
    currentStage,
    currentPlayer
  };

  console.log("=================");
  console.log(game);
  console.log("-----------------");
  console.log(params);
  console.log("=================");

  return params;
})(Game);
