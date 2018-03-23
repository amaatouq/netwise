import { PlayerRounds } from "../player-rounds/player-rounds";
import { PlayerStages } from "./player-stages";
import { Players } from "../players/players.js";
import { submitPlayerStage, updatePlayerStageData } from "./methods";
import { updatePlayerData } from "../players/methods";
import { updatePlayerRoundData } from "../player-rounds/methods";

const playerSet = playerId => (key, value) => {
  updatePlayerData.call({ playerId, key, value: JSON.stringify(value) });
};
const stageSet = playerStageId => (key, value) => {
  updatePlayerStageData.call({
    playerStageId,
    key,
    value: JSON.stringify(value)
  });
};
const stageSubmit = playerStageId => () => {
  submitPlayerStage.call({ playerStageId }, err => {
    if (!err) {
      stage.submitted = true;
    }
  });
};
const roundSet = playerRoundId => (key, value) => {
  updatePlayerRoundData.call({
    playerRoundId,
    key,
    value: JSON.stringify(value)
  });
};

// Once the operation has succeeded (no throw), set the value
const set = (obj, func) => (k, v) => {
  func(k, v);
  obj[k] = v;
};

export const augmentPlayerStageRound = (player, stage, round) => {
  const { _id: playerId } = player;
  const playerStage = PlayerStages.findOne({ stageId: stage._id, playerId });
  const playerRound = PlayerRounds.findOne({ roundId: round._id, playerId });

  player.get = key => player.data[key];
  player.set = set(player.data, playerSet(playerId));

  stage.get = key => playerStage.data[key];
  stage.set = set(playerStage.data, stageSet(playerStage._id));
  stage.submit = stageSubmit(playerStage._id);
  stage.submitted = Boolean(playerStage.submittedAt);

  round.get = key => playerRound.data[key];
  round.set = set(playerRound.data, roundSet(playerRound._id));
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
