import React from "react";

export default class NoBatch extends React.Component {
  render() {
    return (
      <div class="pt-non-ideal-state">
        <div class="pt-non-ideal-state-visual pt-non-ideal-state-icon">
          <span class="pt-icon pt-icon-warning-sign" />
        </div>
        <h4 class="pt-non-ideal-state-title">No experiments available</h4>
        <div class="pt-non-ideal-state-description">
          There are currently no available experiement. Please wait until an
          experiment becomes available or come back at a later date.
        </div>
      </div>
    );
  }
}