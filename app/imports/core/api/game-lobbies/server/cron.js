import { SyncedCron } from "meteor/percolate:synced-cron";
import moment from "moment";

import { GameLobbies } from "../game-lobbies.js";
import { LobbyConfigs } from "../../lobby-configs/lobby-configs";

const checkLobbyTimeout = (lobby, lobbyConfig) => {
  import { createGameFromLobby } from "../../games/create.js";
  const now = moment();
  const startTimeAt = moment(lobby.timeoutStartedAt);
  const endTimeAt = startTimeAt.add(lobbyConfig.timeoutInSeconds, "seconds");
  const ended = now.isSameOrAfter(endTimeAt);

  if (!ended) {
    return;
  }

  switch (lobbyConfig.timeoutStrategy) {
    case "fail":
      GameLobbies.update(lobby._id, {
        $set: { timedOutAt: new Date() }
      });
      Players.update(
        { _id: { $in: lobby.queuedPlayerIds } },
        {
          $set: {
            exitStatus: "gameLobbyTimedOut",
            exitAt: new Date()
          }
        },
        { multi: true }
      );
      break;
    case "ignore":
      createGameFromLobby(lobby);
      break;

    // case "bots": {

    //   break;
    // }

    default:
      console.error(
        `unknown LobbyConfig.timeoutStrategy: ${lobbyConfig.timeoutStrategy}`
      );
  }
};

const checkIndividualTimeout = (lobby, lobbyConfig) => {
  const now = moment();
  Players.find({ _id: { $in: lobby.playerIds } }).forEach(player => {
    const startTimeAt = moment(player.timeoutStartedAt);
    const endTimeAt = startTimeAt.add(lobbyConfig.timeoutInSeconds, "seconds");
    const ended = now.isSameOrAfter(endTimeAt);
    if (!ended || player.timeoutWaitCount <= lobbyConfig.extendCount) {
      return;
    }
    Players.update(player._id, {
      $set: {
        exitStatus: "playerLobbyTimedOut",
        exitAt: new Date()
      }
    });
    GameLobbies.update(lobby._id, {
      $inc: { readyCount: -1, queuedCount: -1 },
      $pull: {
        playerIds: player._id
        // We keep the player in queued so they will still have it loaded in the UI
        // queuedPlayerIds: player._id
      }
    });
  });
};

SyncedCron.add({
  name: "Check lobby timeouts",
  schedule: function(parser) {
    // Run about once a second
    return parser.text("every 1 second");
  },

  job: function() {
    const query = {
      status: "running",
      gameId: { $exists: false }
    };

    GameLobbies.find(query).forEach(lobby => {
      const lobbyConfig = LobbyConfigs.findOne(lobby.lobbyConfigId);

      switch (lobbyConfig.timeoutType) {
        case "lobby":
          checkLobbyTimeout(lobby, lobbyConfig);
          break;
        case "individual":
          checkIndividualTimeout(lobby, lobbyConfig);
          break;
        default:
          console.error(
            `unknown LobbyConfig.timeoutType: ${lobbyConfig.timeoutType}`
          );
      }
    });
  }
});
