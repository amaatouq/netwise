import React from "react";

import PlayerProfile from "../components/PlayerProfile";
import Task from "../components/Task";

export default class Round extends React.Component {
  render() {
    const { currentRound, currentStage, currentPlayer } = this.props;

    return (
      <div className="round">
        <PlayerProfile currentPlayer={currentPlayer} />

        <Task
          currentRound={currentRound}
          currentStage={currentStage}
          currentPlayer={currentPlayer}
        />
      </div>
    );
  }
}
