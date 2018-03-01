import PropTypes from "prop-types";
import React from "react";

import TaskResponse from "./TaskResponse";
import TaskStimulus from "./TaskStimulus";

export default class Task extends React.Component {

  calculatePlayerIndex() {
    if (this.props.game.playerIds[0] === this.props.player._id) {
      return 0;
    }
    return 1;
  }

  render() {
    const { round, stage, player, game } = this.props;
    const { data: { task: { payout } } } = round;
    return (
      <div className="task">
        <TaskStimulus payout={ payout } playerIndex={ this.calculatePlayerIndex() }/>
        <TaskResponse
          round={ round }
          stage={ stage }
          game={ game }
          player={ player }
        />
      </div>
    );
  }
}

Task.propTypes = {
  round: PropTypes.object.isRequired,
  stage: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired
};
