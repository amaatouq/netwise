import SimpleSchema from "simpl-schema";
import { TimestampSchema } from "../default-schema";

export const Games = new MongoCollection("games");

Games.schema = new SimpleSchema({});

Games.schema.extend(TimestampSchema);
