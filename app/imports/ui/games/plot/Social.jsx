import PropTypes from "prop-types";
import React from "react";

export default class Social extends React.Component {
  render() {
    const { round } = this.props;
    return <div className="social">Social at round {round}</div>;
  }
}

Social.propTypes = {
  // Current round index
  round: PropTypes.number.isRequired
};
