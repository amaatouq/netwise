import { GameLobbies } from "../game-lobbies/game-lobbies";
import { Games } from "../games/games";
import { createGameFromLobby } from "../games/create";

// Start the game if lobby full
GameLobbies.after.update(
  function(userId, doc, fieldNames, modifier, options) {
    if (!fieldNames.includes("availableSlots")) {
      return;
    }

    const gameLobby = this.transform();
    if (gameLobby.availableSlots !== 0) {
      return;
    }
    if (Games.find({ gameLobbyId: gameLobby._id }).count() > 0) {
      return;
    }

    const gameId = createGameFromLobby(gameLobby);

    GameLobbies.update(gameLobby._id, { $set: { gameId } });
  },
  { fetchPrevious: false }
);
