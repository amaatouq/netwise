import SimpleSchema from "simpl-schema";

import { Batches } from "../batches/batches";
import { BelongsTo, HasManyByRef, TimestampSchema } from "../default-schemas";
import { Players } from "../players/players";
import { Rounds } from "../rounds/rounds";
import { Treatments } from "../treatments/treatments";

export const Games = new Mongo.Collection("games");

Games.schema = new SimpleSchema({});

Games.schema.extend(TimestampSchema);
Meteor.startup(() => {
  Games.schema.extend(BelongsTo(Treatments));
  Games.schema.extend(HasManyByRef(Rounds));
  Games.schema.extend(HasManyByRef(Players));
  Games.schema.extend(BelongsTo(Batches));
});
Games.attachSchema(Games.schema);
