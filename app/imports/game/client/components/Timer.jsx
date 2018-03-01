import PropTypes from "prop-types";
import React from "react";

export default class Timer extends React.Component {
  render() {
    const { remainingSeconds } = this.props;

    const classes = ["timer"];
    if (remainingSeconds <= 5) {
      classes.push("lessThan5");
    } else if (remainingSeconds <= 10) {
      classes.push("lessThan10");
    }

    return (
      <div className={classes.join(" ")}>
        <h4>Timer</h4>
        <span className="seconds">{remainingSeconds}</span>
      </div>
    );
  }
}
