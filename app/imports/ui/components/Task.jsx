import PropTypes from "prop-types";
import React from "react";
import TaskStimulus from "./TaskStimulus";

export default class Task extends React.Component {
  render() {
    const task = this.props.task;
    const stage = this.props.stage;
    console.log("task from inside task", task);
    console.log("stage from inside task", stage);

    return (
      <main className="task">
          <TaskStimulus task={task} />
      </main>
    );
  }
}

Task.propTypes = {
  // Current round index
  task: PropTypes.object.isRequired,
  stage: PropTypes.string.isRequired
};
