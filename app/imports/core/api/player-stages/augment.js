import { PlayerRounds } from "../player-rounds/player-rounds";
import { PlayerStages } from "./player-stages";
import { Players } from "../players/players.js";
import { submitPlayerStage, updatePlayerStageData } from "./methods";
import { updatePlayerData } from "../players/methods";
import { updatePlayerRoundData } from "../player-rounds/methods";

let playerSet;
let stageSubmit;
let stageSet;
let roundSet;

if (Meteor.isClient) {
  playerSet = playerId => (key, value) => {
    updatePlayerData.call({ playerId, key, value: JSON.stringify(value) });
  };
  stageSet = playerStageId => (key, value) => {
    updatePlayerStageData.call({
      playerStageId,
      key,
      value: JSON.stringify(value)
    });
  };
  stageSubmit = playerStageId => () => {
    submitPlayerStage.call({ playerStageId }, err => {
      if (!err) {
        stage.submitted = true;
      }
    });
  };
  roundSet = playerRoundId => (key, value) => {
    updatePlayerRoundData.call({
      playerRoundId,
      key,
      value: JSON.stringify(value)
    });
  };
} else {
  playerSet = playerId => (key, value) => {
    const $set = {
      [`data.${key}`]: value
    };
    Players.update(playerId, { $set }, { autoConvert: false });
  };
  stageSet = playerId => (key, value) => {
    const $set = {
      [`data.${key}`]: value
    };
    PlayerStages.update(playerStageId, { $set }, { autoConvert: false });
  };
  stageSubmit = playerStageId => () => {
    const playerStage = PlayerStages.findOne(playerStageId);
    if (!playerStage) {
      throw new Error("playerStage not found");
    }

    if (playerStage.submittedAt) {
      throw new Error("not permitted");
    }

    PlayerStages.update(playerStageId, { $set: { submittedAt: new Date() } });
  };
  roundSet = playerRoundId => (key, value) => {
    const $set = {
      [`data.${key}`]: value
    };

    PlayerRounds.update(playerRoundId, { $set }, { autoConvert: false });
  };
}

export const augmentPlayerStageRound = (player, stage, round) => {
  const { _id: playerId } = player;
  const playerStage = PlayerStages.findOne({ stageId: stage._id, playerId });
  const playerRound = PlayerRounds.findOne({ roundId: round._id, playerId });

  player.get = key => player.data[key];
  player.set = playerSet(playerId);

  stage.get = key => playerStage.data[key];
  stage.set = stageSet(playerStage._id);
  stage.submit = stageSubmit(playerStage._id);
  stage.submitted = Boolean(playerStage.submittedAt);

  round.get = key => playerRound.data[key];
  round.set = roundSet(playerRound._id);
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
