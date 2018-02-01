import SimpleSchema from "simpl-schema";

import { Batches } from "../batches/batches";
import { GameLobbies } from "../game-lobbies/game-lobbies";
import { Games } from "../games/games";
import { TimestampSchema, UserDataSchema, BelongsTo } from "../default-schemas";

export const Players = new Mongo.Collection("players");

Players.schema = new SimpleSchema({
  // The Player `id` is used to uniquely identify the player to avoid
  // having a user play multiple times. It can be any string, for example
  // an email address, a Mechanical Turk ID, a manually assigned participation
  // number (saved as string), etc...
  id: {
    type: String
  }
});

Players.schema.extend(TimestampSchema);
Players.schema.extend(UserDataSchema);
Meteor.startup(function() {
  Players.schema.extend(BelongsTo(Games, false, false));
  Players.schema.extend(BelongsTo(GameLobbies, false, false));
});
Players.attachSchema(Players.schema);
