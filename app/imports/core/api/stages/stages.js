import SimpleSchema from "simpl-schema";

import { BelongsTo, UserDataSchema, TimestampSchema } from "../default-schemas";
import { Games } from "../games/games";
import { Rounds } from "../rounds/rounds";

export const Stages = new Mongo.Collection("stages");

Stages.schema = new SimpleSchema({
  name: {
    type: String,
    max: 64
  },
  displayName: {
    type: String,
    max: 128
  },
  durationInSeconds: {
    type: SimpleSchema.Integer,
    // One day, that's a lot, but could be "weird" experiment, yet no going nuts
    // into hundreds of years for example.
    max: 24 * 60 * 60,
    // It would be difficult to manage a timer that is less than 5s given all
    // the multi-peer synchronization going on.
    min: 5
  }
});

Stages.schema.extend(TimestampSchema);
Stages.schema.extend(UserDataSchema);
Meteor.startup(function() {
  Stages.schema.extend(BelongsTo(Rounds));
  Stages.schema.extend(BelongsTo(Games));
});
Stages.attachSchema(Stages.schema);
