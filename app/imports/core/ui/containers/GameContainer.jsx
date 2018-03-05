import { TimeSync } from "meteor/mizzao:timesync";
import { withTracker } from "meteor/react-meteor-data";
import moment from "moment";

import { PlayerRounds } from "../../api/player-rounds/player-rounds";
import { PlayerStages } from "../../api/player-stages/player-stages";
import { Players } from "../../api/players/players";
import { Rounds } from "../../api/rounds/rounds";
import { Stages } from "../../api/stages/stages";
import {
  augmentPlayerStageRound,
  augmentStageRound
} from "../../api/player-stages/augment";
import Game from "../components/Game";

// This will be part of the Game object eventually
export const gameName = "task";

// Handles all the timing stuff
const withTimer = withTracker(({ stage, player, ...rest }) => {
  const now = moment(TimeSync.serverTime());
  const startTimeAt = stage && moment(stage.startTimeAt);
  const started = stage && now.isSameOrAfter(startTimeAt);
  const endTimeAt =
    stage && startTimeAt.add(stage.durationInSeconds, "seconds");
  const ended = stage && now.isSameOrAfter(endTimeAt);
  const timedOut = stage && !player.stage.submitted && ended;
  const roundOver = (stage && player.stage.submitted) || timedOut;
  return {
    timedOut,
    roundOver,
    stage,
    player,
    started,
    ended,
    endTimeAt,
    ...rest
  };
})(Game);

const loadingObj = { loading: true };

// Loads top level Players, Game, Round and Stage data
export default withTracker(
  ({ player, gameLobby, treatment, game, ...rest }) => {
    if (!game) {
      if (!gameLobby) {
        throw new Error("game not found");
      }
      return {
        gameLobby,
        player,
        treatment
      };
    }

    const gameId = game._id;
    game.treatment = treatment.conditionsObject();
    game.players = Players.find({ gameId }).fetch();
    game.rounds = Rounds.find({ gameId }).fetch();
    game.rounds.forEach(round => {
      round.stages = Stages.find({ roundId: round._id }).fetch();
    });

    const stage = Stages.findOne(game.currentStageId);
    const round = game.rounds.find(r => r._id === stage.roundId);

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

    if (
      playerIds.length !== playerStagesCount ||
      playerIds.length !== playerRoundsCount
    ) {
      console.error("here1");
      return loadingObj;
    }

    augmentStageRound(stage, round);
    const applyAugment = player => {
      player.stage = { _id: stage._id };
      player.round = { _id: round._id };
      augmentPlayerStageRound(player, player.stage, player.round);
    };
    applyAugment(player);
    game.players.forEach(applyAugment);

    const params = {
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
  }
)(withTimer);
