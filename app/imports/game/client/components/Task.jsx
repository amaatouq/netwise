import PropTypes from "prop-types";
import React from "react";

import TaskResponse from "./TaskResponse";
import TaskStimulus from "./TaskStimulus";

export default class Task extends React.Component {
  render() {
    const { round, stage, player } = this.props;
    const { data: { task: { difficultyPath } } } = round;
    const taskPath = difficultyPath[player.data.difficulty];

    return (
      <div className="task">
        <TaskStimulus taskParam={taskPath} />
        <TaskResponse round={round} stage={stage} />
      </div>
    );
  }
}

Task.propTypes = {
  round: PropTypes.object.isRequired,
  stage: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired
};
