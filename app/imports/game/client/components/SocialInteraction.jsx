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

  renderUnfollow(alterId) {
    const {player} = this.props;

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
    const {game, showScoreIncrement} = this.props;
    const cumulativeScore = otherPlayer.get("cumulativeScore") || 0;
    const roundScore = otherPlayer.round.get("score") || 0;

    return (
      <div className="alter pt-card pt-elevation-2" key={otherPlayer._id}>
        <div className="info">
          <img src={otherPlayer.get("avatar")} className="profile-avatar" />
          <span className="pt-icon-standard pt-icon-dollar" />
          <span>{cumulativeScore}</span>
          {showScoreIncrement ? (
            <span style={{ color: otherPlayer.round.get("scoreColor") }}>
              <strong> (+{roundScore})</strong>
            </span>
          ) : null}
        </div>
        {game.treatment.rewiring ? this.renderUnfollow(otherPlayer._id) : null}
      </div>
    );
  }

  renderAltersList(alters) {
    return alters.map(alter => this.renderAlter(alter));
  }

  render() {
    console.log("rendering SocialInteraction");
    const {game, player, showScoreIncrement} = this.props;

    const rewiring = game.treatment.rewiring;

    //get the ids of the followers and the people that they could follow
    const allPlayersIds = _.pluck(game.players, "_id");
    const alterIds = player.get("alterIds");
    const nonAlterIds = _.without(
      _.difference(allPlayersIds, alterIds),
      player._id
    );

    //actual Player objects and not only Ids

    //all players sorted by performance in descending order
    const allPlayers = _.sortBy(game.players, p =>
      p.get("cumulativeScore")
    ).reverse();
    const alters = allPlayers.filter(p => alterIds.includes(p._id));
    const cumulativeScore = player.get("cumulativeScore") || 0;
    const roundScore = player.round.get("score") || 0;

    return (
      <div className="social-interaction">
        <div className="right" key="left">
          <p>
            <strong>Score:</strong>
            {showScoreIncrement
              ? <span>Total (+increment)</span>
              : null}
          </p>
          <p style={{ textIndent: "1em" }}>
            <span className="pt-icon-standard pt-icon-dollar" />
            <span>{cumulativeScore}</span>
            {showScoreIncrement
              ? (<span style={{ color: player.round.get("scoreColor") }}>
                  <strong> (+{roundScore})</strong>
                </span>)
              : null}
          </p>
          <p>
            <strong>You are following:</strong>
          </p>
          {this.renderAltersList(alters)}
        </div>
      </div>
    );
  }
}
