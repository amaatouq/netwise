import PropTypes from "prop-types";
import React from "react";

import TaskResponse from "./TaskResponse";
import TaskStimulus from "./TaskStimulus";

export default class Task extends React.Component {

  calculatePlayerIndex() {
    if (this.props.game.players[0]._id === this.props.player._id) {
      return 0;
    }
    return 1;
  }

  render() {
    const { round, stage, player, game } = this.props;
    const { data: { task: { payout } } } = round;
    console.log("round", round);
    console.log("player", player);
    console.log("game", game);
    return (
      <div className="task">
        <TaskStimulus payout={ payout } playerIndex={ this.calculatePlayerIndex() }/>
        <TaskResponse round={ round } stage={ stage } />
      </div>
    );
  }
}

Task.propTypes = {
  round: PropTypes.object.isRequired,
  stage: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired
};
