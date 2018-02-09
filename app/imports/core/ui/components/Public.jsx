import React from "react";

import { CoreWrapper } from "./Helpers";
import GameContainer from "../containers/GameContainer";
import Loading from "./Loading";
import NewPlayer from "./NewPlayer";
import NoBatch from "./NoBatch";

export default class Public extends React.Component {
  render() {
    const { playerId, loading, batchAvailable } = this.props;

    if (loading) {
      return <Loading />;
    }

    if (!batchAvailable) {
      return <NoBatch />;
    }

    let content;
    if (!playerId) {
      content = (
        <CoreWrapper>
          <NewPlayer />
        </CoreWrapper>
      );
    } else {
      content = <GameContainer playerId={playerId} />;
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
