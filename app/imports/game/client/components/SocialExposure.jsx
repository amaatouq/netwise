import React from "react";
import { Slider } from "@blueprintjs/core";

export default class SocialExposure extends React.Component {
  renderSocialInteraction(alterId) {
    const { game } = this.props;
    const otherPlayer = game.players.find(p => p._id === alterId);
    // "or 0" here if the user hasn't submitted a guess, defaulting to 0
    const guess = otherPlayer.round.get("guess") || 0;
    return (
      <div className="alter pt-card pt-elevation-2" key={alterId}>
        <img
          src={otherPlayer.get("avatar")}
          className="profile-avatar"
          title={otherPlayer._id}
        />
        <div className="range">
          <Slider
            min={0}
            max={1}
            stepSize={0.01}
            labelRenderer={() => ""}
            value={guess}
            showTrackFill={false}
            disabled
          />
        </div>
      </div>
    );
  }

  render() {
    const { player } = this.props;

    const alterIds = player.get("alterIds");

    return (
      <div className="social-exposure">
        <p>
          <strong>You are following:</strong>
        </p>
        {!_.isEmpty(alterIds)
          ? alterIds.map(alterId => this.renderSocialInteraction(alterId))
          : "You are currently not following anyone"}
      </div>
    );
  }
}
