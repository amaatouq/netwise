import React from "react";

import { DevNote } from "./Helpers";
import { playerReady } from "../../api/players/methods.js";
import GameLobby from "./GameLobby";
import Instructions from "./Instructions.jsx";
import Loading from "./Loading";

export default class Game extends React.Component {
  render() {
    const { gameLobby, Round, loading, ...rest } = this.props;
    const { game, treatment } = rest;
    const {
      started,
      ended,
      endTime,
      now,
      remainingSeconds,
      roundOver,
      timedOut,
      player
    } = rest;
    const time = {
      started,
      ended,
      endTime,
      now,
      remainingSeconds
    };

    if (loading) {
      return <Loading />;
    }

    if (gameLobby) {
      if (player.readyAt || gameLobby.debugMode) {
        return (
          <GameLobby
            gameLobby={gameLobby}
            treatment={treatment}
            player={player}
          />
        );
      }

      return (
        <Instructions
          treatment={treatment}
          onDone={() => {
            playerReady.call({ _id: player._id });
          }}
        />
      );
    }

    if (game.finishedAt) {
      return (
        <div className="game finished">
          <div className="pt-non-ideal-state">
            <div className="pt-non-ideal-state-visual pt-non-ideal-state-icon">
              <span className="pt-icon pt-icon-tick" />
            </div>
            <h4 className="pt-non-ideal-state-title">Finished!</h4>
            <div className="pt-non-ideal-state-description">
              Thank you for participating.
              <DevNote block>
                There should be some outro steps here, including payment.
              </DevNote>
            </div>
          </div>
        </div>
      );
    }

    if (timedOut || !started) {
      // If there's only one player, don't say waiting on other players,
      // just show the loading screen.
      if (treatment.condition("playerCount").value === 1) {
        return <Loading />;
      }

      return (
        <div className="game waiting">
          <div className="pt-non-ideal-state">
            <div className="pt-non-ideal-state-visual pt-non-ideal-state-icon">
              <span className="pt-icon pt-icon-automatic-updates" />
            </div>
            <h4 className="pt-non-ideal-state-title">
              {/*a more neutral message in case it was a single player*/}
              Waiting for server response...
            </h4>
            <div className="pt-non-ideal-state-description">
              Please wait until all players are ready.
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="game">
        <Round {...rest} />
      </div>
    );
  }
}
