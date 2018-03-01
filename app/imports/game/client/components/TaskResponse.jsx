import React from "react";
import { Slider } from "@blueprintjs/core";

export default class TaskResponse extends React.Component {

  handleSubmit = action => {
    const { stage, round } = this.props;
    round.set("action", action);
    stage.submit();
  };

  handleNext = () => {
    this.props.stage.submit();
  }

  getPayout() {
    const { round, game, player } = this.props;
    const payoutAmt = round.get("payoutAmt");
    const partnerId = player.get("alterIds")[0];
    const partner = game.players.find(p => p._id === partnerId);
    const partnerPayoutAmt = partner.round.get("payoutAmt");
    console.log("payout", payoutAmt, partnerPayoutAmt);

    return [payoutAmt, partnerPayoutAmt];
  }

  getPartnerAction() {
    const alterId = this.props.player.get("alterIds")[0];
    const partner = this.props.game.players.find(p => p._id === alterId);
    return partner.round.get("action");
  }

  renderStageFinished() {
    return (
      <div className="pt-callout .modifier">
        <h5>Waiting on other players...</h5>
        Please wait until all players are ready
      </div>
    );
  }

  renderResult(round) {
    const payout = this.getPayout();
    return (
      <table className="pt-table  pt-html-table pt-html-table-bordered">
        <thead>
          <tr>
            <th>Your action</th>
            <th>Your partner's action</th>
            <th>Your payout</th>
            <th>Your partner's payout</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{ round.get("action") }</td>
            <td>{ this.getPartnerAction() }</td>
            <td>{ payout[0] }</td>
            <td>{ payout[1] }</td>
          </tr>
        </tbody>
      </table>
    );
  }

  renderActions() {
    return (
      <div className="task-actions">
        <button className="pt-button pt-large" onClick={() => this.handleSubmit('cooperate')}>Cooperate</button>
        <button className="pt-button pt-large" onClick={() => this.handleSubmit('compete')}>Compete</button>
      </div>
    );
  }

  renderNextButton() {
    return (
      <button className="pt-button pt-large" onClick={this.handleNext}>Next</button>
    );
  }

  render() {
    const { stage, round } = this.props;
    const isResult = stage.name === "outcome";

    return (
      <div className="task-response">
        { !stage.finished && !isResult ? this.renderActions() : null }
        { stage.finished ? this.renderStageFinished() : null }
        { isResult ? this.renderResult(round) : null }
        { !stage.finished && isResult ? this.renderNextButton() : null }
      </div>
    );
  }
}
