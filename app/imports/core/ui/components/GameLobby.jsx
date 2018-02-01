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
          <h1>Lobby</h1>

          <p>Waiting message here...</p>

          <p>
            {exisiting} / {total} players ready.
          </p>
        </div>
      </CoreWrapper>
    );
  }
}
