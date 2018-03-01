import PropTypes from "prop-types";
import React from "react";

export default class TaskStimulus extends React.Component {
  render() {
    const { payout, playerIndex } = this.props;
    console.log("payout", payout);
    console.log("playerIndex", playerIndex);
    return (
      <div className="task-stimulus">
        <table className="pt-table task-table">
            <tbody>
                <tr>
                    <td></td>
                    <td className="cooperate">Cooperate (Partner)</td>
                    <td className="compete">Compete (Partner)</td>
                </tr>
                <tr>
                    <td className="cooperate">Cooperate (You)</td>
                    <td>{ payout["compComp"] }</td>
                    <td>{ playerIndex ? payout["compCoop"] : payout["coopComp"] }</td>
                </tr>
                <tr>
                    <td className="compete">Compete (You)</td>
                    <td>{ playerIndex ? payout["coopComp"] : payout["compCoop"] }</td>
                    <td>{ payout["compComp"] }</td>
                </tr>
            </tbody>
        </table>
      </div>
    );
  }
}

TaskStimulus.propTypes = {
  payout: PropTypes.object,
  playerIndex: PropTypes.number
};
