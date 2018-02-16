import React from "react";

import { CoreWrapper } from "./Helpers";

export default class GameLobby extends React.Component {
  render() {
    const { gameLobby, treatment, ...rest } = this.props;

    const total = treatment.condition("playerCount").value;
    const exisiting = total - gameLobby.availableSlots;
    return (
      <CoreWrapper>
        <div className="game-lobby">
          <div class="pt-non-ideal-state">
            <div class="pt-non-ideal-state-visual pt-non-ideal-state-icon">
              <span class="pt-icon pt-icon-time" />
            </div>
            <h4 class="pt-non-ideal-state-title">Lobby</h4>
            <div class="pt-non-ideal-state-description">
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
