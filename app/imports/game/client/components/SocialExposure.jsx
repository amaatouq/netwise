import React from "react";
import { Slider } from "@blueprintjs/core";

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
          // "or 0" here if the user hasn't submitted a guess, defaulting to 0
          const guess = otherPlayer.round.get("guess") || 0;
          return (
            <div className="alter pt-card pt-elevation-2" key={alterId}>
              {/* <img
                src={otherPlayer.get("avatar")}
                className="profile-avatar"
                title={otherPlayer._id}
              /> */}
              <img
                src={`/avatars/identicon/${otherPlayer._id}`}
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
        });
      }
    }

    return <div className="social-exposure">{content}</div>;
  }
}
