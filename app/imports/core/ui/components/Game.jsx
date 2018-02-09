import React from "react";

import GameLobby from "./GameLobby";
import Loading from "./Loading";

export default class Game extends React.Component {
  render() {
    const { gameLobby, Round, loading, ...rest } = this.props;
    const { game, treatment } = rest;

    if (loading) {
      return <Loading />;
    }

    if (gameLobby) {
      return <GameLobby gameLobby={gameLobby} treatment={treatment} />;
    }

    if (game.finishedAt) {
      return (
        <div className="game">
          <h1>Finished!</h1>
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
