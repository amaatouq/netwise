import PropTypes from "prop-types";
import React from "react";
import TaskStimulus from "./TaskStimulus";
import TaskResponse from './TaskResponse';
import TaskFeedback from './TaskFeedback'

export default class Task extends React.Component {
  render() {
    const taskData = this.props.task.data;
    const taskPath = taskData.difficultyPath[this.props.currentPlayer.data.difficulty]; //get user specific task difficulty
    const stage = this.props.stage;
    console.log('currentPlayer.difficulty',this.props.currentPlayer.data.difficulty);
    console.log("task from inside task", taskData);
    console.log("stage from inside task", stage);

    return (
      <div className="task">
        <TaskStimulus taskParam={taskPath} />
        {stage!=="outcome"?<TaskResponse />:<TaskFeedback />}
      </div>
    );
  }
}

Task.propTypes = {
  // Current round index
  task: PropTypes.object.isRequired,
  stage: PropTypes.string.isRequired,
  currentPlayer: PropTypes.object.isRequired
};
