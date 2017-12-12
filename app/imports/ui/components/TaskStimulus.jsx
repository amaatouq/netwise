import PropTypes from "prop-types";
import React from "react";

export default class TaskStimulus extends React.Component {
  render() {
    console.log("taskPath", this.props.task.data.taskPath);
    return (
      <div>
        <img src={this.props.task.data.taskPath} className="task-image" />
      </div>
    );
  }
}

TaskStimulus.propTypes = {
  task: PropTypes.object
};
