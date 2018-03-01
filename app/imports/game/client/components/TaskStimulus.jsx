import PropTypes from "prop-types";
import React from "react";

export default class TaskStimulus extends React.Component {
  render() {
    const { payout, playerIndex } = this.props;
    return (
      <div className="task-stimulus">
        <table className="pt-table task-table">
            <tbody>
                <tr>
                    <td>Payout</td>
                    <td className="cooperate">Cooperate (Partner)</td>
                    <td className="compete">Compete (Partner)</td>
                </tr>
                <tr>
                    <td className="cooperate">Cooperate (You)</td>
                    <td>{ payout["cooperate_cooperate"] }</td>
                    <td>{ payout["cooperate_compete"] }</td>
                </tr>
                <tr>
                    <td className="compete">Compete (You)</td>
                    <td>{ payout["compete_cooperate"] }</td>
                    <td>{ payout["compete_compete"] }</td>
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
