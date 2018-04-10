import { Dialog, Intent } from "@blueprintjs/core";
import { Link } from "react-router-dom";
import React from "react";

import { CoreWrapper } from "./Helpers";
import { removePlayerId } from "../containers/IdentifiedRoute";
import DelayedDisplay from "./DelayedDisplay.jsx";
import GameContainer from "../containers/GameContainer";
import Loading from "./Loading";
import NewPlayer from "./NewPlayer";
import NoBatch from "./NoBatch";

const DelayedNoBatch = DelayedDisplay(NoBatch, 0);

export default class Public extends React.Component {
  state = { isOpen: false };

  handleToggleDialog = () => this.setState({ isOpen: !this.state.isOpen });

  handleReset = event => {
    event.preventDefault();
    removePlayerId();
    this.setState({ isOpen: false });
  };

  handleOpenAltPlayer = event => {
    event.preventDefault();
    const randId = Math.random()
      .toString(36)
      .substring(2, 15);
    window.open(`/?playerIdKey=${randId}`, "_blank");
  };

  render() {
    const { loading, renderPublic, ...rest } = this.props;
    const { player } = rest;

    if (loading) {
      return <Loading />;
    }

    if (!renderPublic) {
      return <DelayedNoBatch />;
    }

    let content;
    if (!player) {
      content = (
        <CoreWrapper>
          <NewPlayer />
        </CoreWrapper>
      );
    } else {
      content = <GameContainer {...rest} />;
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
            {Meteor.isDevelopment ? (
              <>
                <button
                  type="button"
                  className="pt-button pt-minimal pt-icon-new-person"
                  onClick={this.handleOpenAltPlayer}
                >
                  New Player
                </button>

                <button
                  type="button"
                  className="pt-button pt-minimal pt-icon-repeat"
                  onClick={this.handleReset}
                >
                  Reset current session
                </button>
              </>
            ) : (
              ""
            )}

            <button
              type="button"
              className="pt-button pt-minimal pt-icon-info-sign"
              onClick={this.handleToggleDialog}
            >
              About
            </button>

            <Dialog
              iconName="inbox"
              isOpen={this.state.isOpen}
              onClose={this.handleToggleDialog}
              title="About"
            >
              <div className="pt-dialog-body">
                Here be the presentation of the experiement(ers).
              </div>
              <div className="pt-dialog-footer">
                <div className="pt-dialog-footer-actions">
                  <button
                    type="button"
                    className="pt-button pt-intent-primary"
                    onClick={this.handleToggleDialog}
                  >
                    Close
                  </button>
                </div>
              </div>
            </Dialog>
          </div>
        </nav>

        <main>{content}</main>
      </div>
    );
  }
}
