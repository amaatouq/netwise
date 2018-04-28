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
    if (altersCount <= alterIds.length) {
      AlertToaster.show({
        message: "You are already following the maximum number of people"
      });
      return;
    }
    
    alterIds.push(alterId);
    player.set("alterIds", alterIds);
  };

  renderFollow(nonAlterId) {
    const { player } = this.props;
    return (
      <button
        className="pt-button pt-intent-primary pt-icon-add pt-minimal"
        onClick={this.handleFollow.bind(this, nonAlterId)}
        disabled={player.stage.submitted}
      />
    );
  }

  renderUnfollow(alterId) {
    const { player } = this.props;

    return (
      <button
        className="pt-button pt-fill pt-intent-primary"
        onClick={this.handleUnfollow.bind(this, alterId)}
        disabled={player.stage.submitted} //if they did not submit, they can unfollow, otherwise, the button is inactive
      >
        Unfollow
      </button>
    );
  }

  renderAlter(alter) {
    const { game } = this.props;
    const cumulativeScore = alter.get("cumulativeScore") || 0;
    const roundScore = alter.round.get("score") || 0;

    return (
      <div className="alter pt-card pt-elevation-2" key={alter._id}>
        <div className="info">
          <img src={alter.get("avatar")} className="profile-avatar" />
          {/*only show the scores of the alters if feedback is allowed*/}
          <span className="pt-icon-standard pt-icon-dollar" />
          <span>{cumulativeScore}</span>
          <span style={{ color: alter.round.get("scoreColor") }}>
            <strong> (+{roundScore})</strong>
          </span>
        </div>
        {game.treatment.rewiring ? this.renderUnfollow(alter._id) : null}
      </div>
    );
  }

  renderNonAlter(nonAlter) {
    const cumulativeScore = nonAlter.get("cumulativeScore") || 0;
    const roundScore = nonAlter.round.get("score") || 0;

    return (
      <div className="non-alter" key={nonAlter._id}>
        {this.renderFollow(nonAlter._id)}
        <img src={nonAlter.get("avatar")} className="profile-avatar" />
        <span className="pt-icon-standard pt-icon-dollar" />
        <span>{cumulativeScore} </span>

        <span style={{ color: nonAlter.round.get("scoreColor") }}>
          <strong> (+{roundScore})</strong>
        </span>
      </div>
    );
  }

  youCanFollowList(nonAlters) {
    return (
      <div className="right" key="right">
        <p>
          <strong>You can follow:</strong>
        </p>
        {nonAlters.map(nonAlter => this.renderNonAlter(nonAlter))}
      </div>
    );
  }

  followingList(player, alters) {
    const cumulativeScore = player.get("cumulativeScore") || 0;
    const roundScore = player.round.get("score") || 0;

    return (
      <div className="right" key="left">
        <p>
          <strong>Score:</strong> Total (+increment)
        </p>

        <p style={{ textIndent: "1em" }}>
          <span className="pt-icon-standard pt-icon-dollar" />
          <span>{cumulativeScore}</span>
          <span style={{ color: player.round.get("scoreColor") }}>
            <strong> (+{roundScore})</strong>
          </span>
        </p>

        <p>
          <strong>You are following:</strong>
        </p>
        {alters.map(alter => this.renderAlter(alter))}
      </div>
    );
  }

  render() {
    const { game, player } = this.props;
    const rewiring = game.treatment.rewiring;

    //get the ids of the alters (already following) and non-alters (they can follow)
    const allPlayersIds = _.pluck(game.players, "_id");
    const alterIds = player.get("alterIds");
    const nonAlterIds = _.without(
      _.difference(allPlayersIds, alterIds),
      player._id
    );

    //actual Player objects and not only Ids for alters and nonAlters, this is just convenient for now (until we have Network object?)
    //all players sorted by performance in descending order
    const allPlayers = _.sortBy(game.players, p =>
      p.get("cumulativeScore")
    ).reverse();
    const alters = allPlayers.filter(p => alterIds.includes(p._id));
    const nonAlters = allPlayers.filter(p => nonAlterIds.includes(p._id));

    return (
      <div className="social-interaction">
        {this.followingList(player, alters)}
        {rewiring ? this.youCanFollowList(nonAlters) : null}
      </div>
    );
  }
}
