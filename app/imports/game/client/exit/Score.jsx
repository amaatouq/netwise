import React from "react";

import Centered from "../../../core/ui/components/Centered.jsx";

export default class Score extends React.Component {
  render() {
    const { player, onSubmit } = this.props;

    return (
      <Centered>
        <div className="score">
          <h1>Nice job!</h1>

          <p>
            You did well, your final score was{" "}
            {player.get("cumulativeScore").toLocaleString()}.
          </p>

          <p>
            You earned ${(
              player.get("cumulativeScore") * 1000
            ).toLocaleString()}.
          </p>

          <p>
            <button
              className="pt-button pt-intent-primary"
              type="button"
              onClick={() => onSubmit()}
            >
              Next
            </button>
          </p>
        </div>
      </Centered>
    );
  }
}
