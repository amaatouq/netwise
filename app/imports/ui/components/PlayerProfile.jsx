import PropTypes from "prop-types";
import React from "react";

export default class PlayerProfile extends React.Component {
  render() {
    const { currentPlayer } = this.props;

    return (
      <aside className="player-profile">
        <h3>Your Profile</h3>
        <img src={currentPlayer.data.avatar} className="profile-avatar" />

        <div>ID:{currentPlayer._id}</div>

        {/*TODO: Why this does not work and breaks it?*/}
        {/*<div>created at: {currentPlayer.createdAt}</div>*/}

        <div className="profile-score">
          <h4>Total score</h4>
          <span>{currentPlayer.data.score}</span>
        </div>
      </aside>
    );
  }
}

PlayerProfile.propTypes = {
  // Current player with all the attribute about the player:
  //Things include: Avatar, Score, Bonus, Gender Team membership (Whether came from Mturk or Crowdflower)
  currentPlayer: PropTypes.object.isRequired
};
