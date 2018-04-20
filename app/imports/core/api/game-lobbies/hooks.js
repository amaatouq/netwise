import { GameLobbies } from "../game-lobbies/game-lobbies";
import { Games } from "../games/games";
import { Players } from "../players/players.js";
import { createGameFromLobby } from "../games/create";

// Start the game if lobby full
GameLobbies.after.update(
  function(userId, doc, fieldNames, modifier, options) {
    if (!fieldNames.includes("readyCount")) {
      return;
    }

    const gameLobby = this.transform();

    // If there are not enough players ready, wait
    if (gameLobby.readyCount < gameLobby.availableCount) {
      return;
    }

    // Game already created (?!)
    if (Games.find({ gameLobbyId: gameLobby._id }).count() > 0) {
      return;
    }

    // Create Game
    const gameId = createGameFromLobby(gameLobby);

    // Let Game Lobby know Game ID
    GameLobbies.update(gameLobby._id, { $set: { gameId } });

    const playerIds = _.difference(
      gameLobby.queuedPlayerIds,
      gameLobby.playerIds
    );

    // Notify players that did make the cut
    Players.update(
      { _id: { $in: playerIds } },
      {
        $set: {
          exitAt: new Date(),
          exitStatus: "gameFull"
        }
      },
      { multi: true }
    );
  },
  { fetchPrevious: false }
);
