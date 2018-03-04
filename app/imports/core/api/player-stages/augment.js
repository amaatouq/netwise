import { PlayerRounds } from "../player-rounds/player-rounds";
import { PlayerStages } from "./player-stages";
import { submitPlayerStage, updatePlayerStageData } from "./methods";
import { updatePlayerData } from "../players/methods";
import { updatePlayerRoundData } from "../player-rounds/methods";

export const augmentPlayerStageRound = (player, stage, round) => {
  const { _id: playerId } = player;
  const playerStage = PlayerStages.findOne({ stageId: stage._id, playerId });
  const playerRound = PlayerRounds.findOne({ roundId: round._id, playerId });

  player.get = key => {
    return player.data[key];
  };
  player.set = (key, value) => {
    updatePlayerData.call({ playerId, key, value: JSON.stringify(value) });
  };

  const playerStageId = playerStage._id;
  stage.get = key => {
    return playerStage.data[key];
  };
  stage.set = (key, value) => {
    updatePlayerStageData.call({
      playerStageId,
      key,
      value: JSON.stringify(value)
    });
  };
  stage.submit = () => {
    submitPlayerStage.call({ playerStageId });
  };
  stage.submitted = Boolean(playerStage.submittedAt);

  round.get = key => {
    return playerRound.data[key];
  };
  round.set = (key, value) => {
    updatePlayerRoundData.call({
      playerRoundId: playerRound._id,
      key,
      value: JSON.stringify(value)
    });
  };
};

export const augmentStageRound = (stage, round) => {
  stage.get = key => {
    return state.data[key];
  };
  stage.set = (key, value) => {
    throw "You cannot update stage data at the moment";
  };
  stage.submit = () => {
    throw "You cannot submit the entire stage at the moment";
  };

  round.get = key => {
    return round.data[key];
  };
  round.set = (key, value) => {
    throw "You cannot update round data at the moment";
  };
};
