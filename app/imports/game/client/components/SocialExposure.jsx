import React from "react";
import { Slider } from "@blueprintjs/core";

export default class SocialExposure extends React.Component {
  renderSocialInteraction(otherPlayer) {
    // "or 0" here if the user hasn't submitted a guess, defaulting to 0
    const guess = otherPlayer.round.get("guess");
    return (
      <div className="alter pt-card pt-elevation-2" key={otherPlayer._id}>
        <img
          src={otherPlayer.get("avatar")}
          className="profile-avatar"
          title={otherPlayer._id}
        />
        {/*If the guess of the alter (i.e., neighbor) is 'undefined' (i.e., gave no answer, then we don't show a default answer*/}
        <div className={`range ${guess === undefined ? "empty" : ""}`}>
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
    //we get the alters and sort them by score so that the higher performing ones are on top
    const { game, player } = this.props;
    const alterIds = player.get("alterIds");
    const allPlayers = _.sortBy(game.players, p =>
      p.get("cumulativeScore")
    ).reverse();
    const alters = allPlayers.filter(p => alterIds.includes(p._id));
    return (
      <div className="social-exposure">
        <p>
          <strong>You are following:</strong>
        </p>
        {!_.isEmpty(alters)
          ? alters.map(alter => this.renderSocialInteraction(alter))
          : "You are currently not following anyone"}
      </div>
    );
  }
}
