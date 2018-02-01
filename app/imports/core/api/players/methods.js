import SimpleSchema from "simpl-schema";
import { Players } from "./players";
import { GameLobbies } from "../game-lobbies/game-lobbies";

export const createPlayer = new ValidatedMethod({
  name: "Players.methods.create",

  validate: new SimpleSchema({
    id: {
      type: String
    }
  }).validator(),

  run(player) {
    // TODO: MAYBE, add verification that the user is not current connected
    // elsewhere and this is not a flagrant impersonation. Note that is
    // extremely difficult to guaranty. Could also add verification of user's
    // id with email verication for example. For now the assumption is that
    // there is no immediate reason or long-term motiviation for people to hack
    // each other's player account.

    const existing = Players.findOne(player);

    // For now we make the assumption that the player already has batch
    // assigned to them and it's sitll valid. This might not be the case if the
    // player disconnected for a long time and we removed them from their
    // assigned game lobby.
    // TODO fix the existing player without a game/gameLobby case
    if (existing) {
      return existing._id;
    }

    player._id = Players.insert(player);

    // Adding player to a lobby
    while (!player.gameLobbyId) {
      // Looking for an running lobby that still has room
      const lobby = GameLobbies.findOne(
        { status: "running", availableSlots: { $gt: 0 } },
        { sort: { createdAt: 1 } }
      );

      if (!lobby) {
        // The UI should update and realize there is no batch available
        // This should be a rare case of a few seconds of desynchornisation or
        // that the last available batch just finished.
        return;
      }

      // Trying to insert the player into the lobby.
      // Specifying the availableSlots we previously found ensures we are
      // only inserting if the availableSlots is still a valid number (> 0)
      // and we keep the status in there just to make sure it wasn't *just*
      // stopped.
      const { _id, availableSlots } = lobby;
      GameLobbies.update(
        { _id, availableSlots, status: "running" },
        {
          $set: {
            availableSlots: availableSlots - 1
          },
          $addToSet: {
            playerIds: player._id
          }
        }
      );

      // We then verify the insert worked. If it didn't we can try again,
      // there might be another lobby availble.
      if (GameLobbies.find({ _id, playerIds: player._id })) {
        Players.update(player._id, { $set: { gameLobbyId: _id } });
      }
    }

    return player._id;
  }
});
