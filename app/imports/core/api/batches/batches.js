import SimpleSchema from "simpl-schema";

import { Games } from "../games/games";
import { TimestampSchema, HasManyByRef } from "../default-schemas";

export const Batches = new Mongo.Collection("batches");

Batches.schema = new SimpleSchema({
  assignmentType: {
    type: String,
    allowedValues: ["simple", "complete", "custom"]
  }
});

Batches.schema.extend(TimestampSchema);
Meteor.startup(function() {
  Batches.schema.extend(HasManyByRef(Games));
});
Batches.attachSchema(Batches.schema);
