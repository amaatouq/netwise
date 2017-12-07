import PropTypes from "prop-types";
import React from "react";

import { stages } from "./game";

export default class Task extends React.Component {
  render() {
    const { round, stage } = this.props;

    // const plots = gameInstance.get("plots");
    // const plot = plots[round];

    return (
      <div className="task">
        Task for Round {round} at stage {stage}
      </div>
    );
  }
}

Task.propTypes = {
  // Current round index
  round: PropTypes.number.isRequired,

  // Current stage
  stage: PropTypes.oneOf(stages).isRequired
};
