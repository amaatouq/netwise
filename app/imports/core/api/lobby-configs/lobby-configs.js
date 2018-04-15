import SimpleSchema from "simpl-schema";

import { Batches } from "../batches/batches";
import { GameLobbies } from "../game-lobbies/game-lobbies.js";
import { HasManyByRef, TimestampSchema } from "../default-schemas";

export const LobbyConfigs = new Mongo.Collection("lobby_configs");

LobbyConfigs.helpers({
  displayName() {
    if (this.name) {
      return this.name;
    }

    const base = `${this.timeoutType}(${this.timeoutInSeconds}s)`;
    let details;
    switch (this.timeoutType) {
      case "lobby":
        details = this.timeoutStrategy;
        if (this.timeoutStrategy === "bots") {
          details += `(${this.timeoutBots.join(",")})`;
        }
        break;
      case "individual":
        details = `x ${extendCount}`;
        break;
      default:
        console.error(`unknown timeoutType: ${this.timeoutType}`);
        return base;
    }

    return `${base} ${details}`;
  }
});

LobbyConfigs.timeoutTypes = ["lobby", "individual"];
LobbyConfigs.schema = new SimpleSchema({
  // Optional experimenter given name for the treatment
  name: {
    type: String,
    max: 256,
    optional: true,
    regEx: /^[a-zA-Z0-9_]+$/
  },

  timeoutType: {
    type: String,
    allowedValues: LobbyConfigs.timeoutTypes
  },

  // Number of seconds for one player to wait in lobby before timeoutStrategy
  // is applied. This timeout applies only to the waiting for the game to start.
  // It is either a "Lobby Timeout", or an "Individual Timeout", depending on
  // the timeoutType value.
  timeoutInSeconds: {
    type: SimpleSchema.Integer,
    // One year, that's a lot, just need to block from something too wild like 10M years. We don't actually care, Inf would be fine...
    max: 365 * 24 * 60 * 60,
    // It would be difficult to manage a timer that is less than 5s, and it
    // would be  weird.
    min: 5
  },

  // The timeoutStrategy determines what to do in case people are waiting
  // in the lobby for longer than the timeoutInSeconds duration.
  // Only for "lobby" timeoutType.
  // Available strategies:
  // - ignore: start the game anyway
  // - fail: take the player to the exit survey
  // - bots: fill the missing players slots with bots from timeoutBots
  timeoutStrategy: {
    type: String,
    allowedValues: ["fail", "ignore", "bots"],
    defaultValue: "fail"
  },

  // Names of bot to use if timed out and still not enough player.
  // Only for "lobby" timeoutType and timeoutStrategy is "bots".
  timeoutBots: {
    type: Array,
    // Should add custom validation to verify the timeoutStrategy and make
    // required if "bots" and should verify bot with name exists.
    optional: true
  },
  "timeoutBots.$": {
    type: String
  },

  // Number of times to allow the user to extend their wait time by
  // timeoutInSeconds.
  // If set to 0, they are never asked to retry.
  // Only for "individual" timeoutType.
  extendCount: {
    type: SimpleSchema.Integer,
    // 1 millard times, that should be a sufficient upper bound
    max: 1000000000,
    min: 0,
    optional: true
  }
});

LobbyConfigs.schema.extend(TimestampSchema);
Meteor.startup(() => {
  LobbyConfigs.schema.extend(HasManyByRef(Batches));
  LobbyConfigs.schema.extend(HasManyByRef(GameLobbies));
});
LobbyConfigs.attachSchema(LobbyConfigs.schema);
