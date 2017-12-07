import PropTypes from "prop-types";
import React from "react";

import { stages } from "./game";
import Context from "./Context";
import Social from "./Social";
import Task from "./Task";

export default class Round extends React.Component {
  render() {
    const { round, stage, score, currentPlayer, remainingTime } = this.props;
    return (
      <div className="round round-plot">
        <Context
          currentPlayerID={currentPlayer.id}
          score={score}
          remainingTime={remainingTime}
        />
        <Task round={round} stage={stage} />
        {stage === "social" ? <Social round={round} /> : ""}
      </div>
    );
  }
}

Round.propTypes = {
  // Current round index
  round: PropTypes.number.isRequired,

  // Current stage
  stage: PropTypes.oneOf(stages).isRequired,

  // Current player
  currentPlayer: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,

  // Current player's score
  score: PropTypes.number.isRequired,

  // Remaining time to complete task in seconds
  remainingTime: PropTypes.number,

  // Other player participating in this game
  otherPlayers: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  )
};
