import SimpleSchema from "simpl-schema";

import { PlayerRounds } from "./player-rounds";

export const updatePlayerRoundData = new ValidatedMethod({
  name: "PlayerRounds.methods.updateData",

  validate: new SimpleSchema({
    playerRoundId: {
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

  run({ playerRoundId, key, value }) {
    const playerRound = PlayerRounds.findOne(playerRoundId);
    if (!playerRound) {
      throw new Error("playerRound not found");
    }
    // TODO check can update this record playerRound

    const $set = {
      [`data.${key}`]: value
    };

    PlayerRounds.update(playerRoundId, { $set });
  }
});
