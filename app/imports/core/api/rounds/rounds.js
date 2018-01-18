import SimpleSchema from "simpl-schema";

import {
  BelongsTo,
  HasManyByRef,
  UserDataSchema,
  TimestampSchema
} from "../default-schemas";
import { Games } from "../games/games";
import { Stages } from "../stages/stages";

export const Rounds = new Mongo.Collection("rounds");

Rounds.schema = new SimpleSchema({});

Rounds.schema.extend(TimestampSchema);
Rounds.schema.extend(UserDataSchema);
Meteor.startup(function() {
  Rounds.schema.extend(HasManyByRef(Stages));
  Rounds.schema.extend(BelongsTo(Games));
});
Rounds.attachSchema(Rounds.schema);
