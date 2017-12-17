import React from "react";

export default class Game extends React.Component {
  render() {
    const { Round, loading, ...rest } = this.props;
    const { currentRound, currentStage } = rest;
    console.log(this.props);

    if (loading) {
      return "Loading!";
    }

    console.log(currentRound.stages);

    return (
      <div className="game">
        <nav className="round-nav">
          <ul>
            <li>Round: 1</li>
            {currentRound.stages.map(stage => (
              <li className={stage.id === currentStage.id ? "current" : ""}>
                {stage.name}
              </li>
            ))}
            <li> </li>
          </ul>
        </nav>
        <Round {...rest} />
      </div>
    );
  }
}
