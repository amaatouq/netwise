import moment from "moment";

import { Games } from "../games/games.js";
import { Players } from "../players/players.js";
import { Rounds } from "../rounds/rounds.js";
import { Stages } from "./stages.js";
import {
  augmentPlayerStageRound,
  augmentStageRound
} from "../player-stages/augment.js";
import { config } from "../../../game/server";

export const endOfStage = stageId => {
  const stage = Stages.findOne(stageId);
  const { index, gameId, roundId } = stage;
  const game = Games.findOne(gameId);
  const round = Rounds.findOne(roundId);
  const players = Players.find({ gameId }).fetch();
  augmentStageRound(stage, round);
  players.forEach(player => {
    player.stage = _.extend({}, stage);
    player.round = _.extend({}, round);
    augmentPlayerStageRound(player, player.stage, player.round);
  });
  const onStageEnd = config.onStageEnd;
  if (onStageEnd) {
    onStageEnd(game, round, stage, players);
  }

  const nextStage = Stages.findOne({ gameId, index: index + 1 });

  if (!nextStage || stage.roundId !== nextStage.roundId) {
    players.forEach(player => {
      player.stage = null;
    });
    const onRoundEnd = config.onRoundEnd;
    if (onRoundEnd) {
      onRoundEnd(game, round, players);
    }
  }

  if (nextStage) {
    // go to next stage
    const currentStageId = nextStage._id;
    Games.update(gameId, {
      $set: { currentStageId }
    });
    const startTimeAt = moment().add(Stages.stagePaddingDuration);
    Stages.update(currentStageId, {
      $set: {
        startTimeAt: startTimeAt.toDate()
      }
    });
  } else {
    const onGameEnd = config.onGameEnd;
    if (onGameEnd) {
      onGameEnd(game, players);
    }
    Games.update(gameId, {
      $set: { finishedAt: new Date() }
    });
  }
};
