import { TimeSync } from "meteor/mizzao:timesync";
import { withTracker } from "meteor/react-meteor-data";
import moment from "moment";

import { LobbyConfigs } from "../../api/lobby-configs/lobby-configs.js";
import GameLobby from "../components/GameLobby.jsx";
import game from "../components/Game.jsx";

// This will be part of the Game object eventually
export const gameName = "task";

// Handles all the timing stuff
const withTimer = withTracker(({ gameLobby, player, ...rest }) => {
  const lobbyConfig = LobbyConfigs.find(gameLobby.lobbyConfigId);

  // TimeSync.serverTime() is a reactive source that will trigger this
  // withTracker function every 1s.
  const now = moment(TimeSync.serverTime(null, 100));

  const startObj = lobbyConfig.timeoutType === "lobby" ? lobby : player;
  const startTimeAt = moment(startObj.timeoutStartTime);
  const endTimeAt = startTimeAt.add(lobbyConfig.timeoutInSeconds, "seconds");
  const timedOut = now.isSameOrAfter(endTimeAt);

  return {
    lobbyConfig,
    gameLobby,
    player,
    endTimeAt,
    ...rest
  };
})(GameLobby);
