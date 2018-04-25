import React from "react";

//TODO: when I remove the pt-icon-dollar sign when giving no feedback, the images are not centered

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

  renderUnfollow(alterId) {
    const { player } = this.props;

    return (
      //if they did not submit, they can unfollow, otherwise, the button is inactive
      <button
        className="pt-button pt-fill pt-intent-primary"
        onClick={this.handleUnfollow.bind(this, alterId)}
        disabled={player.stage.submitted}
      >
        Unfollow
      </button>
    );
  }

  renderAlter(otherPlayer) {
    const { feedbackTime, game } = this.props;
    const cumulativeScore = otherPlayer.get("cumulativeScore") || 0;
    const roundScore = otherPlayer.round.get("score") || 0;

    return (
      <div className="alter pt-card pt-elevation-2" key={otherPlayer._id}>
        <div className="info">
          <img src={otherPlayer.get("avatar")} className="profile-avatar" />
          {/*only show the scores of the alters if feedback is allowed*/}
          {feedbackTime ? (
            <span className="pt-icon-standard pt-icon-dollar" />
          ) : null}
          {feedbackTime ? <span>{cumulativeScore}</span> : null}
          {feedbackTime ? (
            <span style={{ color: otherPlayer.round.get("scoreColor") }}>
              <strong> (+{roundScore})</strong>
            </span>
          ) : null}
        </div>
        {game.treatment.rewiring ? this.renderUnfollow(otherPlayer._id) : null}
      </div>
    );
  }

  renderAltersList(alterIds) {
    return alterIds.map(alterId => this.renderAlter(alterId));
  }

  renderLeftColumn(player, alterIds, feedbackTime) {
    const cumulativeScore = player.get("cumulativeScore") || 0;
    const roundScore = player.round.get("score") || 0;

    return (
      <div className="right" key="left">
        {feedbackTime ? (
          <p>
            <strong>Score:</strong> Total (+increment)
          </p>
        ) : null}

        {feedbackTime ? (
          <p style={{ textIndent: "1em" }}>
            <span className="pt-icon-standard pt-icon-dollar" />
            <span>{cumulativeScore}</span>
            <span style={{ color: player.round.get("scoreColor") }}>
              <strong> (+{roundScore})</strong>
            </span>
          </p>
        ) : null}

        <p>
          <strong>You are following:</strong>
        </p>
        {this.renderAltersList(alterIds)}
      </div>
    );
  }

  renderNonAlter(otherPlayer) {
    const { feedbackTime, player } = this.props;
    const cumulativeScore = otherPlayer.get("cumulativeScore") || 0;
    const roundScore = otherPlayer.round.get("score") || 0;

    return (
      <div className="non-alter" key={otherPlayer._id}>
        <button
          className="pt-button pt-intent-primary pt-icon-add pt-minimal"
          onClick={this.handleFollow.bind(this, otherPlayer._id)}
          disabled={player.stage.submitted}
        />
        <img src={otherPlayer.get("avatar")} className="profile-avatar" />
        {feedbackTime ? (
          <span className="pt-icon-standard pt-icon-dollar" />
        ) : null}
        {feedbackTime ? <span>{cumulativeScore} </span> : null}
        {feedbackTime ? (
          <span style={{ color: otherPlayer.round.get("scoreColor") }}>
            <strong> (+{roundScore})</strong>
          </span>
        ) : null}
      </div>
    );
  }
  renderNonAltersList(nonAlterIds) {
    return nonAlterIds.map(alterId => this.renderNonAlter(alterId));
  }

  renderRightColumn(nonAlterIds) {
    return (
      <div className="right" key="right">
        <p>
          <strong>You can follow:</strong>
        </p>
        {this.renderNonAltersList(nonAlterIds)}
      </div>
    );
  }

  render() {
    const { game, player, feedbackTime } = this.props;

    const rewiring = game.treatment.rewiring;

    //get the ids of the followers and the people that they could follow
    const allPlayersIds = _.pluck(game.players, "_id");
    const alterIds = player.get("alterIds");
    const nonAlterIds = _.without(
      _.difference(allPlayersIds, alterIds),
      player._id
    );

    //actual Player objects and not only Ids for alters and nonAlters

    //all players sorted by performance in descending order
    const allPlayers = _.sortBy(game.players, p =>
      p.get("cumulativeScore")
    ).reverse();
    const alters = allPlayers.filter(p => alterIds.includes(p._id));
    const nonAlters = allPlayers.filter(p => nonAlterIds.includes(p._id));

    return (
      <div className="social-interaction">
        {rewiring
          ? [
              this.renderLeftColumn(player, alters, feedbackTime),
              this.renderRightColumn(nonAlters)
            ]
          : this.renderLeftColumn(player, alters, feedbackTime)}
      </div>
    );
  }
}
