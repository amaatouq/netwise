import PropTypes from "prop-types";
import React from "react";

import Timer from "./Timer.jsx";

export default class PlayerProfile extends React.Component {
  render() {
    const { player, remainingSeconds } = this.props;

    return (
      <aside className="pt-card player-profile">
        <h3>Your Profile</h3>
        <img src={player.get("avatar")} className="profile-avatar" />

        {/*TODO: Why this does not work and breaks it?*/}
        {/*<div>created at: {player.createdAt}</div>*/}

        <div className="profile-score">
          <h4>Total score</h4>
          <span>{player.get("score") || 0}</span>
        </div>

        <Timer remainingSeconds={remainingSeconds} />
      </aside>
    );
  }
}

PlayerProfile.propTypes = {
  // Current player with all the attribute about the player:
  //Things include: Avatar, Score, Bonus, Gender Team membership (Whether came from Mturk or Crowdflower)
  player: PropTypes.object.isRequired
};
