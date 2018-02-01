import SimpleSchema from "simpl-schema";

import { Batches } from "../batches/batches";
import { BelongsTo, HasManyByRef, TimestampSchema } from "../default-schemas";
import { Players } from "../players/players";
import { Treatments } from "../treatments/treatments";

export const GameLobbies = new Mongo.Collection("gameLobbies");

GameLobbies.helpers({
  players() {
    return Players.find({ _id: { $in: this.playerIds } }).fetch();
  },
  batch() {
    return Batches.findOne({ _id: this.batchId });
  },
  treatment() {
    return Treatments.findOne({ _id: this.treatmentId });
  }
});

GameLobbies.schema = new SimpleSchema({
  // index allows for an ordering of lobbies so we know which one
  // to choose from next
  index: {
    type: SimpleSchema.Integer,
    min: 0,
    label: "Position"
  },

  // availableSlots tells us how many slots are left in this lobby
  availableSlots: {
    type: SimpleSchema.Integer,
    min: 0,
    label: "Available Slots"
  }

  // ======================================================================
  //
  // Beyond this point is the old schema, used to manage lobby timeouts
  // Ignore it. Need some fixing!
  //
  //  ======================================================================

  // // Number of seconds for one player to wait in lobby before timeoutStrategy
  // // is applied. This timeout applies only to the waiting for the game to start.
  // timeoutInSeconds: {
  //   type: SimpleSchema.Integer,
  //   // One day, that's a lot, just need to block from something too wild.
  //   max: 24 * 60 * 60,
  //   // It would be difficult to manage a timer that is less than 5s, and it
  //   // would be  weird.
  //   min: 5
  // },

  // // The timeoutStrategy determines what to do in case people are waiting in the
  // // lobby for longer than the timeoutInSeconds duration.
  // // Available strategies:
  // // - ignore: start the game anyway
  // // - fail: take the player to the exit survey
  // // - retry: ask user if they wish to wait retryDurationInSeconds seconds
  // //   longer or fail. This will go in a loop until user abandons. Maybe should
  // //   limit number of times it can happen.
  // // - bots: fill the missing players slots with bots from timeoutBot
  // timeoutStrategy: {
  //   type: String,
  //   allowedValues: ["fail", "ignore", "retry", "bots"],
  //   defaultValue: "fail"
  // },

  // // Name of bot to use if timed out and timeoutStrategy is bots
  // timeoutBot: {
  //   type: String,
  //   // Should add custom validation to verify the timeoutStrategy and make
  //   // required if "bots" and should verify bot with name exists.
  //   optional: true
  // },

  // // Number of seconds to propose the user to wait again for more players to
  // // come if the retry timeoutStrategy is chosen.
  // retryDurationInSeconds: {
  //   type: SimpleSchema.Integer,
  //   // One day, that's a lot, just need to block from something too wild.
  //   max: 24 * 60 * 60,
  //   // It would be difficult to manage a timer that is less than 5s, and it
  //   // would be  weird.
  //   min: 5,
  //   optional: true
  // }
});

GameLobbies.schema.extend(TimestampSchema);
Meteor.startup(() => {
  GameLobbies.schema.extend(BelongsTo(Treatments));
  GameLobbies.schema.extend(HasManyByRef(Players));
  GameLobbies.schema.extend(BelongsTo(Batches));
  // We are denormalizing the parent batch status in order to make clean queries
  GameLobbies.schema.extend(Batches.statusSchema);
});
GameLobbies.attachSchema(GameLobbies.schema);
