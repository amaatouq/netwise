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
    return (
      <button
        className="pt-button pt-fill pt-intent-primary"
        onClick={this.handleUnfollow.bind(this, alterId)}
      >
        Unfollow
      </button>
    );
  }

  renderAlter(alterId) {
    const { game } = this.props;
    const otherPlayer = game.players.find(p => p._id === alterId);
    const cumulativeScore = otherPlayer.get("cumulativeScore") || 0;
    const roundScore = otherPlayer.round.get("score") || 0;
    console.log("roundScore", roundScore);
    return (
      <div className="alter pt-card pt-elevation-2" key={alterId}>
        <div className="info">
          <img src={otherPlayer.get("avatar")} className="profile-avatar" />
          {/*only show the scores of the alters if feedback is allowed*/}
          {game.treatment.feedback ? (
            <span className="pt-icon-standard pt-icon-dollar" />
          ) : null}
          {game.treatment.feedback ? <span>{cumulativeScore}</span> : null}
          {game.treatment.feedback ? (
            <span style={{ color: otherPlayer.round.get("scoreColor") }}>
              <strong> (+{roundScore})</strong>
            </span>
          ) : null}
        </div>
        {game.treatment.rewiring ? this.renderUnfollow(alterId) : null}
      </div>
    );
  }

  renderAltersList(alterIds) {
    return alterIds.map(alterId => this.renderAlter(alterId));
  }

  renderLeftColumn(player, alterIds, game) {
    const cumulativeScore = player.get("cumulativeScore") || 0;
    const roundScore = player.round.get("score") || 0;

    return (
      <div className="right" key="left">
        {game.treatment.feedback ? (
          <p>
            <strong>Score:</strong> Total (+increment)
          </p>
        ) : null}

        <p style={ {"text-indent": "1em"} }>
          {game.treatment.feedback ? (
            <span className="pt-icon-standard pt-icon-dollar" />
          ) : null}
          {game.treatment.feedback ? <span>{cumulativeScore}</span> : null}
          {game.treatment.feedback ? (
            <span style={{ color: player.round.get("scoreColor") }}>
              <strong> (+{roundScore})</strong>
            </span>
          ) : null}
        </p>
        <p>
          <strong>You are following:</strong>
        </p>
        {this.renderAltersList(alterIds)}
      </div>
    );
  }

  renderNonAlter(nonAlterId) {
    const { game } = this.props;
    const otherPlayer = game.players.find(p => p._id === nonAlterId);
    const cumulativeScore = otherPlayer.get("score") || 0;
    const roundScore = otherPlayer.round.get("score") || 0;

    return (
      <div className="non-alter" key={nonAlterId}>
        <button
          className="pt-button pt-intent-primary pt-icon-add pt-minimal"
          onClick={this.handleFollow.bind(this, nonAlterId)}
          //disabled={altersCountReached}
        />
        <img src={otherPlayer.get("avatar")} className="profile-avatar" />
        {game.treatment.feedback ? (
          <span className="pt-icon-standard pt-icon-dollar" />
        ) : null}
        {game.treatment.feedback ? <span>{cumulativeScore} </span> : null}
        {game.treatment.feedback ? (
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
    const { game, player } = this.props;

    const rewiring = game.treatment.rewiring;

    const playerIds = _.pluck(game.players, "_id");
    const alterIds = player.get("alterIds");
    const nonAlterIds = _.without(
      _.difference(playerIds, player.get("alterIds")),
      player._id
    );

    return (
      <div className="social-interaction">
        {rewiring
          ? [
              this.renderLeftColumn(player, alterIds, game),
              this.renderRightColumn(nonAlterIds)
            ]
          : this.renderLeftColumn(player, alterIds, game)}
      </div>
    );
  }
}
