import PropTypes from "prop-types";
import React from "react";

export default class SocialExposure extends React.Component {
  render() {
    const { game, stage, player } = this.props;
    let content;

    if (stage.name === "response") {
      content = " "; // No content for response
    } else {
      const interactive = stage.name === "interactive";
      const alterIds = player.get("alterIds");
      if (_.isEmpty(alterIds)) {
        content = " ";
      } else {
        content = alterIds.map(alterId => {
          const otherPlayer = game.players.find(p => p._id === alterId);

          return (
            <div className="alter" key={alterId}>
              <img
                src={otherPlayer.data.avatar}
                className="profile-avatar"
                title={otherPlayer._id}
              />
              <span className="guess">
                {otherPlayer.round.get("guess")}
                {otherPlayer.stage.finished ? " (final)" : ""}
              </span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={otherPlayer.round.get("guess")}
                readOnly
                disabled
              />
            </div>
          );
        });
      }
    }

    return <div className="social-exposure">{content}</div>;
  }
}
