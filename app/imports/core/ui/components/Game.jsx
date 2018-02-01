import React from "react";

import GameLobby from "./GameLobby";
import Loading from "./Loading";

export default class Game extends React.Component {
  render() {
    const { gameLobby, Round, loading, ...rest } = this.props;
    const { currentRound, currentStage, treatment } = rest;
    console.log(this.props);

    if (loading) {
      return <Loading />;
    }

    if (gameLobby) {
      return <GameLobby gameLobby={gameLobby} treatment={treatment} />;
    }

    console.log(currentRound.stages);

    return (
      <div className="game">
        <nav className="round-nav">
          <ul>
            <li>Round: 1</li>
            {currentRound.stages.map(stage => (
              <li
                key={stage.name}
                className={stage.name === currentStage.name ? "current" : ""}
              >
                {stage.displayName}
              </li>
            ))}
            <li> </li>
          </ul>
        </nav>
        <Round {...rest} />
      </div>
    );
  }
}
