import PropTypes from "prop-types";
import React from "react";
import TaskStimulus from "./TaskStimulus";
import TaskResponse from "./TaskResponse";
import TaskFeedback from "./TaskFeedback";

export default class Task extends React.Component {
  render() {
    const {
      round: { data: { task: { difficultyPath } } },
      stage,
      player
    } = this.props;
    const taskPath = difficultyPath[player.data.difficulty];

    let content = "";
    if (stage.finished) {
      content = <h3>Waiting on other players</h3>;
    } else {
      content =
        stage.name !== "outcome" ? (
          <TaskResponse stage={stage} />
        ) : (
          <TaskFeedback />
        );
    }

    return (
      <div className="task">
        <TaskStimulus taskParam={taskPath} />
        {content}
      </div>
    );
  }
}

Task.propTypes = {
  round: PropTypes.object.isRequired,
  stage: PropTypes.object.isRequired,
  player: PropTypes.object.isRequired
};
