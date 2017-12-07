import PropTypes from "prop-types";
import React from "react";

const stringToColour = str => {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  var colour = "#";
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xff;
    colour += ("00" + value.toString(16)).substr(-2);
  }
  return colour;
};

export default class Context extends React.Component {
  render() {
    const { score, currentPlayerID } = this.props;

    return (
      <aside className="context">
        <h3>You Profile</h3>

        {currentPlayerID ? (
          <div
            className="player-icon"
            style={{ backgroundColor: stringToColour(currentPlayerID) }}
          />
        ) : (
          ""
        )}

        {score || score === 0 ? (
          <div className="score">
            <h4>Total score</h4>
            <span>{score}</span>
          </div>
        ) : (
          ""
        )}

        {/* Ignoring timer for now */}
      </aside>
    );
  }
}

Context.propTypes = {
  // Current player's identifier (used to display a user profile icon)
  currentPlayerID: PropTypes.string,

  // Current player's score
  score: PropTypes.number,

  // Remaining time to complete task in seconds
  remainingTime: PropTypes.number
};
