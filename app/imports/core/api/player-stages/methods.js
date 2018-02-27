import SimpleSchema from "simpl-schema";

import { PlayerStages } from "./player-stages";

export const updatePlayerStageData = new ValidatedMethod({
  name: "PlayerStages.methods.updateData",

  validate: new SimpleSchema({
    playerStageId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id
    },
    key: {
      type: String
    },
    value: {
      type: SimpleSchema.oneOf(String, Number, Boolean, Object, Date, Array)
    },
    "value.$": {
      type: SimpleSchema.oneOf(String, Number, Boolean, Object, Date),
      blackbox: true,
      optional: true
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

export const submitPlayerStage = new ValidatedMethod({
  name: "PlayerStages.methods.submit",

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
