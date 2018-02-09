import SimpleSchema from "simpl-schema";

import { PlayerStages } from "./player-stages";

export const updatePlayerRoundData = new ValidatedMethod({
  name: "PlayerRounds.methods.updateData",

  validate: new SimpleSchema({
    playerStageId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    key: {
      type: String
    },
    value: {
      type: SimpleSchema.oneOf(String, Number, Boolean, Object, Array, Date)
    }
  }).validator(),

  run({ playerStageId, key, value }) {
    const playerStage = PlayerStages.findOne(playerStageId);
    if (!playerStage) {
      throw new Error("playerStage not found");
    }
    // TODO check can update this record playerStage

    const $set = {
      [`data.${key}`]: value
    };

    PlayerStages.update(playerStageId, { $set });
  }
});

export const submitPlayerRound = new ValidatedMethod({
  name: "PlayerRounds.methods.submit",

  validate: new SimpleSchema({
    playerStageId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    }
  }).validator(),

  run({ playerStageId }) {
    const playerStage = PlayerStages.findOne(playerStageId);
    if (!playerStage) {
      throw new Error("playerStage not found");
    }
    // TODO check can update this record playerStage

    if (playerStage.submittedAt) {
      throw new Error("not permitted");
    }

    PlayerStages.update(playerStageId, { $set: { submittedAt: new Date() } });
  }
});
