import PropTypes from "prop-types";
import React from "react";

export default class TaskStimulus extends React.Component {
  render() {
    return (
      <div>
        <img src={this.props.taskParam} className="task-image" />
      </div>
    );
  }
}

TaskStimulus.propTypes = {
  task: PropTypes.object
};
