import Board from "./Board";

import PropTypes from "prop-types";
import React from "react";

export default class TaskStimulus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      guess: props.player.round.get("guess") || 0,
    };
  }

  get isIndividual() {
    const { stage } = this.props;
    return stage.name === 'response';
  }

  get isOutcome() {
    const { stage } = this.props;
    return stage.name === 'outcome';
  }

  // get your "alters", the people in the game with you
  get alters() {
    const { game, player } = this.props;
    if (this.isIndividual) {
      // if not interactive, then no other people
      return [];
    }
    const alterIds = player.get("alterIds");
    const allPlayers = _.sortBy(game.players, p => p.get("cumulativeScore")).reverse();
    const alters = allPlayers.filter(p => alterIds.includes(p._id));
    return alters;
  }

  componentDidMount() {
    const { guess } = this.state;
    this.props.player.round.set("guess", guess);
  }

  updateArrow = (guess) => {
    this.setState({guess});
    this.props.player.round.set("guess", guess);
  }

  renderBoard() {
    const isOutcome = this.isOutcome;
    const alterGuesses = this.alters.map(alter => alter.round.get("guess") || 0);
    const { round } = this.props;
    const { guess } = this.state;
    const task = round.get("task");
    return (
      <Board
        isOutcome={isOutcome}
        taskData={{
          answer: task.correctAnswer,
          answerProportion: task.answerProportion,
          dotSpeed: task.dotSpeed,
        }}
        guess={guess}
        alterGuesses={alterGuesses}
        isAnimating={true}
        actions={{
          updateArrow: this.updateArrow,
        }}
      />
    );
  }

  render() {
    const { round, stage, player } = this.props;
  }

  get isOutcome() {
    const { stage } = this.props;
    return stage.name === 'outcome';
  }

  // get your "alters", the people in the game with you
  get alters() {
    const { game, player } = this.props;
    console.log("players");
    console.log(game.players);
    if (this.isIndividual) {
      // if not interactive, then no other people
      return [];
    }
    const alterIds = player.get("alterIds");
    const allPlayers = _.sortBy(game.players, p => p.get("cumulativeScore")).reverse();
    const alters = allPlayers.filter(p => alterIds.includes(p._id));
    return alters;
  }

  componentDidMount() {
    const { guess } = this.state;
    this.props.player.round.set("guess", guess);
  }

  updateArrow = (guess) => {
    this.setState({guess});
    this.props.player.round.set("guess", guess);
  }

  renderBoard() {
    const isOutcome = this.isOutcome;
    const alterGuesses = this.alters.map(alter => alter.round.get("guess") || 0);
    const { round, player, stage } = this.props;
    const { guess } = this.state;
    const task = round.get("task");
    const disabled = player.stage.submitted;
    return (
      <Board
        isOutcome={isOutcome}
        disabled={disabled}
        guess={guess}
        alterGuesses={alterGuesses}
        stageName={stage.name}
        taskData={{
          answer: task.correctAnswer,
          answerProportion: task.answerProportion,
          dotSpeed: task.dotSpeed,
        }}
        actions={{
          updateArrow: this.updateArrow,
        }}
      />
    );
  }

  render() {
    const { game, round, stage, player } = this.props;
    return (
      <div className="task-stimulus">
        <b>Stage</b>: {stage.name}
        {this.renderBoard()}
      </div>
    );
  }
}

TaskStimulus.propTypes = {
  task: PropTypes.object,
  answer: PropTypes.number,
};
