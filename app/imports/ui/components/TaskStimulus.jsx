import PropTypes from "prop-types";
import React from "react";


export default class TaskStimulus extends React.Component {
  
  render(){
    console.log('taskPath',this.props.task.data.taskPath);
    return (<img src={this.props.task.data.taskPath} className="task-image"/>)
  }

}

TaskStimulus.propTypes = {
  task: PropTypes.object,
};

