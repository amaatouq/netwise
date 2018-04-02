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

const DelayedNoBatch = DelayedDisplay(NoBatch, 100);

export default class Public extends React.Component {
  state = { isOpen: false };

  toggleDialog = () => this.setState({ isOpen: !this.state.isOpen });

  reset = event => {
    event.preventDefault();
    removePlayerId();
    this.setState({ isOpen: false });
  };

  render() {
    const { player, loading, renderPublic, ...rest } = this.props;

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
      content = <GameContainer player={player} {...rest} />;
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
            {/* <Link className="pt-button pt-minimal pt-icon-info-sign" to="/">
              About
            </Link> */}
            <button
              type="button"
              className="pt-button pt-minimal pt-icon-info-sign"
              onClick={this.toggleDialog}
            >
              About
            </button>

            <Dialog
              iconName="inbox"
              isOpen={this.state.isOpen}
              onClose={this.toggleDialog}
              title="About"
            >
              <div className="pt-dialog-body">
                Here be the presentation of the experiement(ers).
                {Meteor.isDevelopment ? (
                  <div>
                    <br />
                    <br />
                    <hr />
                    <h4>Debugging</h4>
                    <p>
                      This section is not visible once the app is
                      build/deployed.
                    </p>
                    <button
                      type="button"
                      className="pt-button pt-icon-repeat"
                      onClick={this.reset}
                    >
                      Reset current session
                    </button>
                    <hr />
                    <br />
                    <br />
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="pt-dialog-footer">
                <div className="pt-dialog-footer-actions">
                  <button
                    type="button"
                    className="pt-button pt-intent-primary"
                    onClick={this.toggleDialog}
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
