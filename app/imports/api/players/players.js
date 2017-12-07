import SimpleSchema from "simpl-schema";
import { TimestampSchema } from "../default-schema";

const avatarValues = [];

export const Players = new MongoCollection("players");

Players.schema = new SimpleSchema({
  avatar: {
    type: String,
    optional: true,
    allowedValues: avatarValues
  }
});

Players.schema.extend(TimestampSchema);
