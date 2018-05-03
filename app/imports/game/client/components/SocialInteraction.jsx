import React from "react";

import { AlertToaster } from "../../../core/ui/components/AlertToaster.jsx";

import { getAlterColor } from "./Board";

COLOR_SQUARE_SIZE = 30;

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

  renderAlterColorSquare(i) {
    const style = {
      width: COLOR_SQUARE_SIZE,
      height: COLOR_SQUARE_SIZE,
      borderRadius: 5,
      boxSizing: 'border-box',
      backgroundColor: getAlterColor(i),
      marginLeft: 5,
    };

    return (<div className='alterColorSquare' style={style} />);
  }

  renderAlter(otherPlayer, i) {
    const {game, showScoreIncrement} = this.props;
    const cumulativeScore = otherPlayer.get("cumulativeScore") || 0;
    const roundScore = Math.round(otherPlayer.round.get("score")) || 0;

    return (
      <div className="alter pt-card pt-elevation-2" key={otherPlayer._id}>
        <div className="info">
          <img src={otherPlayer.get("avatar")} className="profile-avatar" />
          <span className="pt-icon-standard pt-icon-dollar" />
          <span>{cumulativeScore}</span>
          {showScoreIncrement ? (
            <div style={{ color: otherPlayer.round.get("scoreColor") }}>
              <strong> (+{roundScore})</strong>
            </div>
          ) : null}
          {this.renderAlterColorSquare(i)}
        </div>
        {game.treatment.rewiring ? this.renderUnfollow(otherPlayer._id) : null}
      </div>
    );
  }

  renderAltersList(alters) {
    return _.range(alters.length).map(i => this.renderAlter(alters[i], i));
  }

  render() {
    const {game, player, showScoreIncrement} = this.props;

    // Get the players being followed
    const alterIds = player.get("alterIds");
    const alters = game.players.filter(p => alterIds.includes(p._id));

    const cumulativeScore = player.get("cumulativeScore") || 0;
    const roundScore = Math.round(player.round.get("score")) || 0;

    return (
      <div className="social-interaction">
        <div className="right" key="left">
          <p>
            <strong>You are following:</strong>
          </p>
          {this.renderAltersList(alters)}
        </div>
      </div>
    );
  }
}
