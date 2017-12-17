import SimpleSchema from "simpl-schema";

import { TimestampSchema } from "../default-schema";

export const Games = new Mongo.Collection("games");

Games.schema = new SimpleSchema({});

Games.schema.extend(TimestampSchema);
