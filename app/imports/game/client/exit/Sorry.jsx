import React from "react";

import Centered from "../../../core/ui/components/Centered.jsx";

export default class Sorry extends React.Component {
  render() {
    const { player, hasNext, onSubmit } = this.props;

    let msg;
    switch (player.exitStatus) {
      case "gameFull":
        msg = "Games filled up too fast...";
        break;
      // case "gameLobbyTimedOut":
      //   msg = "???";
      //   break;
      // case "playerLobbyTimedOut":
      //   msg = "???";
      //   break;
      case "playerEndedLobbyWait":
        msg =
          "You decided to stop waiting, we are sorry it was too long a wait.";
        break;
      default:
        msg = "Unfortunately the Game was cancelled...";
        break;
    }

    return (
      <Centered>
        <div className="score">
          <h1>Sorry!</h1>

          <p>Sorry, you were not able to play today! {msg}</p>

          <p>
            Feel free to come back for the next scheduled game. (NOTE: we don't
            accept players to come back for another game yet...)
          </p>

          <p>
            {hasNext ? (
              <button
                className="pt-button pt-intent-primary"
                type="button"
                onClick={() => onSubmit()}
              >
                Done
              </button>
            ) : (
              ""
            )}
          </p>
        </div>
      </Centered>
    );
  }
}
