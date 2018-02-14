import PropTypes from "prop-types";
import React from "react";

export default class TaskStimulus extends React.Component {
  render() {
    return (
      <div className="task-stimulus">
        <img src={this.props.taskParam} className="task-image" />
      </div>
    );
  }
}

TaskStimulus.propTypes = {
  task: PropTypes.object
};
