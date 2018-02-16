// See if everyone is done with this stage
import { Games } from "../games/games";
import { PlayerStages } from "./player-stages";
import { Players } from "../players/players";
import { Rounds } from "../rounds/rounds";
import { Stages } from "../stages/stages";
import { augmentPlayerStageRound } from "./augment";
import { config } from "../../../game/server";

PlayerStages.after.update(
  function(userId, playerStage, fieldNames, modifier, options) {
    if (!fieldNames.includes("submittedAt")) {
      return;
    }
    const { stageId, roundId, gameId } = playerStage;

    const totalCount = PlayerStages.find({ stageId }).count();
    const doneCount = PlayerStages.find({
      stageId,
      submittedAt: { $exists: true }
    }).count();

    if (totalCount === doneCount) {
      const stage = Stages.findOne(stageId);
      const game = Games.findOne(gameId);
      const round = Rounds.findOne(roundId);
      const players = Players.find({ gameId }).fetch();
      players.forEach(player => {
        player.stage = _.extend({}, stage);
        player.round = _.extend({}, round);
        augmentPlayerStageRound(player, player.stage, player.round);
      });
      config.onStageEnd(game, round, stage, players);

      const { index } = stage;
      const nextStage = Stages.findOne({ gameId, index: index + 1 });

      if (!nextStage || stage.roundId !== nextStage.roundId) {
        players.forEach(player => {
          player.stage = null;
        });
        config.onRoundEnd(game, round, players);
      }

      if (nextStage) {
        // go to next stage
        const currentStageId = nextStage._id;
        Games.update(gameId, {
          $set: { currentStageId }
        });
      } else {
        Games.update(gameId, {
          $set: { finishedAt: new Date() }
        });
      }
    }
  },
  { fetchPrevious: false }
);
