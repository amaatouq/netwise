import React from "react";

export default class NoBatch extends React.Component {
  render() {
    return (
      <div className="no-batch">
        <h1>No experiments available </h1>
        <p>
          There are currently no available experiement. Please wait until an
          experiment becomes available or come back at a later date.
        </p>
      </div>
    );
  }
}
