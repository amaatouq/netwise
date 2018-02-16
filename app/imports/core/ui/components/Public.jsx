import { Link } from "react-router-dom";
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
        <nav className="pt-navbar pt-dark header">
          <div className="pt-navbar-group pt-align-left">
            <div className="pt-navbar-heading">
              <Link
                className="pt-button pt-large pt-minimal pt-icon-exchange"
                to="/"
              >
                Netwise
              </Link>
            </div>
          </div>
          <div className="pt-navbar-group pt-align-right">
            <Link className="pt-button pt-minimal pt-icon-info-sign" to="/">
              About
            </Link>
          </div>
        </nav>

        <main>{content}</main>
      </div>
    );
  }
}
