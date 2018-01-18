import PropTypes from "prop-types";
import React from "react";
import TaskStimulus from "./TaskStimulus";
import TaskResponse from "./TaskResponse";
import TaskFeedback from "./TaskFeedback";

export default class Task extends React.Component {
  render() {
    const {
      currentRound: { data: { task: { difficultyPath } } },
      currentStage,
      currentPlayer
    } = this.props;
    const taskPath = difficultyPath[currentPlayer.data.difficulty];

    return (
      <div className="task">
        <TaskStimulus taskParam={taskPath} />
        {currentStage.name !== "outcome" ? <TaskResponse /> : <TaskFeedback />}
      </div>
    );
  }
}

Task.propTypes = {
  currentRound: PropTypes.object.isRequired,
  currentStage: PropTypes.object.isRequired,
  currentPlayer: PropTypes.object.isRequired
};
