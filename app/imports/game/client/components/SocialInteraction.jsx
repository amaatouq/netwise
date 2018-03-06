import React from "react";

import { AlertToaster } from "../../../core/ui/components/AlertToaster.jsx";

export default class SocialInteraction extends React.Component {
  handleUnfollow = (alterId, event) => {
    event.preventDefault();
    const { player } = this.props;
    const alterIds = _.without(player.get("alterIds"), alterId);
    player.set("alterIds", alterIds);
  };

  handleFollow = (alterId, event) => {
    event.preventDefault();
    const { player, game } = this.props;
    const { altersCount } = game.treatment;
    const alterIds = player.get("alterIds");
    if (altersCount <= alterIds) {
      AlertToaster.show({ message: "Alters count already reached!" });
      return;
    }
    // TODO Verify if max alter ids count reached first!
    alterIds.push(alterId);
    player.set("alterIds", alterIds);
  };

  render() {
    const { game, stage, player } = this.props;
    let content;

    const playerIds = _.pluck(game.players, "_id");

    const { altersCount, rewiring } = game.treatment;
    //only showing this componenet if it is dynamic & more than one follower etc
    if (!rewiring || altersCount < 1 || stage.name !== "outcome") {
      return null;
    }
    const altersCountReached = altersCount <= alterIds;

    const alterIds = player.get("alterIds");
    const nonAlterIds = _.without(
      _.difference(playerIds, player.get("alterIds")),
      player._id
    );

    alters = alterIds.map(alterId => {
      const otherPlayer = game.players.find(p => p._id === alterId);
      const score = otherPlayer.get("score") || 0;
      const roundScore = otherPlayer.round.get("score") || 0;
      return (
        <div className="alter pt-card pt-elevation-2" key={alterId}>
          <div className="info">
            <img src={otherPlayer.get("avatar")} className="profile-avatar" />
            {score} (+{roundScore})
            <span className="pt-icon-standard pt-icon-dollar" />
          </div>
          <button
            className="pt-button pt-fill pt-intent-primary"
            onClick={this.handleUnfollow.bind(this, alterId)}
          >
            Unfollow
          </button>
        </div>
      );
    });

    const left = (
      <div className="right" key="left">
        <p>
          <strong>Score:</strong> total (+increment)
        </p>
        <p>
          <strong>You are following:</strong>
        </p>
        {alters}
      </div>
    );

    nonAlters = nonAlterIds.map(alterId => {
      const otherPlayer = game.players.find(p => p._id === alterId);
      const score = otherPlayer.get("score") || 0;
      const roundScore = otherPlayer.round.get("score") || 0;
      return (
        <div className="non-alter" key={alterId}>
          <button
            className="pt-button pt-intent-primary pt-icon-add pt-minimal"
            onClick={this.handleFollow.bind(this, alterId)}
            disabled={altersCountReached}
          />
          <img src={otherPlayer.get("avatar")} className="profile-avatar" />
          {score} (+{roundScore})
          <span className="pt-icon-standard pt-icon-dollar" />
        </div>
      );
    });

    const right = (
      <div className="right" key="right">
        <p>
          <strong>You can follow:</strong>
        </p>
        {nonAlters}
      </div>
    );

    content = [left, right];

    return <div className="social-interaction">{content}</div>;
  }
}
