import PropTypes from "prop-types";
import React from "react";

import Timer from "./Timer.jsx";

export default class PlayerProfile extends React.Component {
  renderProfile() {
    const { player } = this.props;
    return (
      <div className="profile-score">
        <h3>Your Profile</h3>
        <img src={player.get("avatar")} className="profile-avatar" />
        {/*TODO: Why this does not work and breaks it?*/}
        {/*<div>created at: {player.createdAt}</div>*/}
      </div>
    );
  }

  renderScore() {
    const { player } = this.props;
    return (
      <div className="profile-score">
        <h4>Total score</h4>
        <span className="pt-icon-standard pt-icon-dollar" />
        <span>{player.get("cumulativeScore") || 0}</span>
      </div>
    );
  }

  render() {
    const { game, stage } = this.props;

    return (
      <aside className="pt-card player-profile">
        {this.renderProfile()}
        {/*only show score if feedback is enabled*/}
        {game.treatment.feedback ? this.renderScore() : null}
        <Timer stage={stage} />
      </aside>
    );
  }
}

PlayerProfile.propTypes = {
  // Current player with all the attribute about the player:
  //Things include: Avatar, Score, Bonus, Gender Team membership (Whether came from Mturk or Crowdflower)
  player: PropTypes.object.isRequired
};
