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

  renderAlter(otherPlayer) {
    const { game } = this.props;
    const cumulativeScore = otherPlayer.get("cumulativeScore") || 0;
    const roundScore = otherPlayer.round.get("score") || 0;
    console.log("roundScore", roundScore);
    return (
      <div className="alter pt-card pt-elevation-2" key={otherPlayer._id}>
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
        {game.treatment.rewiring ? this.renderUnfollow(otherPlayer._id) : null}
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

        <p style={ {"textIndent": "1em"} }>
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

  renderNonAlter(otherPlayer) {
    const { game } = this.props;
    const cumulativeScore = otherPlayer.get("cumulativeScore") || 0;
    const roundScore = otherPlayer.round.get("score") || 0;

    return (
      <div className="non-alter" key={otherPlayer._id}>
        <button
          className="pt-button pt-intent-primary pt-icon-add pt-minimal"
          onClick={this.handleFollow.bind(this, otherPlayer._id)}
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
  
    //get the ids of the followers and the people that they could follow
    const allPlayersIds = _.pluck(game.players, "_id");
    const alterIds = player.get("alterIds");
    const nonAlterIds = _.without(
      _.difference(allPlayersIds, alterIds),
      player._id
    );
  
    //actual Player objects and not only Ids for alters and nonAlters
    
    //all players sorted by performance in descending order
    const allPlayers = _.sortBy(game.players, p => p.get("cumulativeScore")).reverse();
    const alters = allPlayers.filter(p => alterIds.includes(p._id));
    const nonAlters = allPlayers.filter(p => nonAlterIds.includes(p._id));

    return (
      <div className="social-interaction">
        {rewiring
          ? [
              this.renderLeftColumn(player, alters, game),
              this.renderRightColumn(nonAlters)
            ]
          : this.renderLeftColumn(player, alters, game)}
      </div>
    );
  }
}
