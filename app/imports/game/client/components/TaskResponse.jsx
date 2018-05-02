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

  renderCurrentGuess(player) {
    // The current guess is just the direction of the arrow in the stimulus
    // No need to render it here!
    return null;
  }

  renderFeedback(player, round) {
    return (
      <table className="pt-table  pt-html-table pt-html-table-bordered">
        <thead>
          <tr>
            <th>Your guess</th>
            <th>Actual answer</th>
            <th>Score increment</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td align="center">
              {player.round.get("guess") || "No guess given"}
            </td>
            <td>{round.get("task").correctAnswer}</td>
            <td>
              <strong style={{ color: player.round.get("scoreColor") }}>
                +{player.round.get("score")}
              </strong>
            </td>
          </tr>
        </tbody>
      </table>
    );
  }

  render() {
    const { stage, round, player, feedbackTime } = this.props;

    // if the player already submitted, don't show the slider or submit button
    if (player.stage.submitted) {
      return this.renderSubmitted();
    }

    const isOutcome = stage.name === "outcome";

    return (
      <div className="task-response">
        <form onSubmit={this.handleSubmit}>
          <div className="pt-form-group">
            {!isOutcome ? this.renderCurrentGuess(player) : null}
          </div>

          {isOutcome && feedbackTime
            ? this.renderFeedback(player, round)
            : null}

          <div className="pt-form-group">
            <button type="submit" className="pt-button pt-icon-tick pt-large">
              {isOutcome ? "Next" : "Submit"}
            </button>
          </div>
        </form>
      </div>
    );
  }
}
