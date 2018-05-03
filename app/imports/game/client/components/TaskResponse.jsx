import React from "react";

export default class TaskResponse extends React.Component {
  handleSubmit = event => {
    event.preventDefault();
    this.props.player.stage.submit();
  };

  renderSubmitted() {
    return (
      <div className="task-response">
        <div className="pt-callout pt-icon-automatic-updates">
          <h5>Waiting on other players...</h5>
          Please wait until all players are ready
        </div>
      </div>
    );
  }

  render() {
    const {stage, round, player} = this.props;

    // if the player already submitted, don't show submit button
    if (player.stage.submitted) {
      return this.renderSubmitted();
    }

    return (
      <div className="task-response">
        <form onSubmit={this.handleSubmit}>
          <div className="pt-form-group">
            <button type="submit" className="pt-button pt-icon-tick pt-large">
              {stage.name === "outcome" ? "Next" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    );
  }
}
