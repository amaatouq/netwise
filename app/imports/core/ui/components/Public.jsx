import React from "react";

import GameContainer from "../containers/GameContainer";
import Loading from "./Loading";
import NoBatch from "./NoBatch";

export default class Public extends React.Component {
  render() {
    // console.log("props", this.props);
    const { playerId, loading, batchAvailable } = this.props;

    if (loading) {
      return <Loading />;
    }

    if (!batchAvailable) {
      return <NoBatch />;
    }

    let content;
    if (!playerId) {
      // Player ID input
    } else {
      content = <GameContainer />;
    }

    return (
      <div className="grid">
        <header>
          <h1>Netwise</h1>
        </header>

        <main>{content}</main>

        <footer>footer</footer>
      </div>
    );
  }
}
