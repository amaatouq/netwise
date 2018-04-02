import React from "react";

import { DevNote } from "./Helpers";
import { addPlayerInput } from "../../api/player-inputs/methods.js";
import { config } from "../../../game/client";
import {
  markPlayerExitStepDone,
  playerReady
} from "../../api/players/methods.js";
import Breadcrumb from "./Breadcrumb.jsx";
import DelayedDisplay from "./DelayedDisplay.jsx";
import ExitSteps from "./ExitSteps.jsx";
import GameLobby from "./GameLobby";
import Instructions from "./Instructions.jsx";
import Loading from "./Loading";
import WaitingForServer from "./WaitingForServer.jsx";

const DelayedWaitingForServer = DelayedDisplay(WaitingForServer, 1000);
const DelayedGameLobby = DelayedDisplay(GameLobby, 1000);

const Round = config.RoundComponent;

const errExitStepMissingName =
  "At least one 'Exit Step' is missing a name or a displayName. All 'Exist Steps' Components must have a name or displayName or all hell will break loose. See https://reactjs.org/docs/higher-order-components.html#convention-wrap-the-display-name-for-easy-debugging to add a displayName.";
const errExitStepDups = dups =>
  `All 'Exit Steps' must be unique (have a unique name/displayName). Duplicated: ${dups}.`;

export default class Game extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps);
  }

  render() {
    const { loading, gameLobby, treatment, ...rest } = this.props;
    const { started, timedOut, game, player, round, stage } = rest;

    if (loading) {
      return <Loading />;
    }

    if (!game) {
      if (player.readyAt || gameLobby.debugMode) {
        return (
          <DelayedGameLobby
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
      const exitSteps = config.ExitSteps && config.ExitSteps(game, player);
      if (!_.isEmpty(exitSteps)) {
        // Checks steps have a name
        stepNames = exitSteps.map(s => (s.displayName || s.name || "").trim());
        for (let index = 0; index < stepNames.length; index++) {
          const sname = stepNames[index];
          if (_.isEmpty(sname)) {
            alert(errExitStepMissingName);
            console.error(errExitStepMissingName);
            return null;
          }
        }

        // Checks steps are unique
        if (stepNames.length !== _.uniq(stepNames).length) {
          const counts = {};
          stepNames.forEach(n => (counts[n] = (counts[n] || 0) + 1));
          const dups = _.compact(
            _.map(counts, (v, k) => (v > 1 ? k : null))
          ).join(", ");
          const err = errExitStepDups(dups);
          alert(err);
          console.error(err);
          return null;
        }

        return (
          <ExitSteps
            game={game}
            player={player}
            onSubmit={(stepName, data) => {
              const playerId = player._id;
              markPlayerExitStepDone.call({ playerId, stepName });
              if (data) {
                addPlayerInput.call({ playerId, data: JSON.stringify(data) });
              }
            }}
          />
        );
      } else {
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
    }

    let content;
    if (timedOut || !started) {
      // If there's only one player, don't say waiting on other players,
      // just show the loading screen.
      if (treatment.condition("playerCount").value === 1) {
        content = <Loading />;
      }

      content = <DelayedWaitingForServer />;
    } else {
      content = <Round {...rest} />;
    }

    return (
      <div className="game">
        <Breadcrumb round={round} stage={stage} />
        {content}
      </div>
    );
  }
}
