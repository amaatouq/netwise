import React from "react";

import { CoreWrapper } from "./Helpers";

export default class GameLobby extends React.Component {
  render() {
    const { gameLobby, treatment } = this.props;

    const total = treatment.condition("playerCount").value;
    const exisiting = total - gameLobby.readyCount;
    return (
      <CoreWrapper>
        <div className="game-lobby">
          <div className="pt-non-ideal-state">
            <div className="pt-non-ideal-state-visual pt-non-ideal-state-icon">
              <span className="pt-icon pt-icon-time" />
            </div>
            <h4 className="pt-non-ideal-state-title">Lobby</h4>
            <div className="pt-non-ideal-state-description">
              <p>Waiting message here...</p>

              <p>
                {exisiting} / {total} players ready.
              </p>
            </div>
          </div>
        </div>
      </CoreWrapper>
    );
  }
}
