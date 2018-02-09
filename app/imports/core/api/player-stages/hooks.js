// See if everyone is done with this stage
import { Games } from "../games/games";
import { PlayerStages } from "./player-stages";
import { Stages } from "../stages/stages";

PlayerStages.after.update(
  function(userId, playerStage, fieldNames, modifier, options) {
    if (!fieldNames.includes("submittedAt")) {
      return;
    }
    const { stageId } = playerStage;

    const totalCount = PlayerStages.find({ stageId }).count();
    const doneCount = PlayerStages.find({
      stageId,
      submittedAt: { $exists: true }
    }).count();

    if (totalCount === doneCount) {
      const stage = Stages.findOne(stageId);
      const { gameId, index } = stage;
      const nextStage = Stages.findOne({ gameId, index: index + 1 });
      const game = Games.findOne(stage.gameId);
      if (nextStage) {
        // go to next stage
        Games.update(gameId, {
          $set: { currentStageId: nextStage._id }
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
