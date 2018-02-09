import React from "react";

export default class RoundNav extends React.Component {
  render() {
    const { round, stage } = this.props;

    return (
      <nav className="round-nav">
        <ul>
          <li>Round {round.index + 1}</li>
          {round.stages.map(s => (
            <li key={s.name} className={s.name === stage.name ? "current" : ""}>
              {s.displayName}
            </li>
          ))}
          <li> </li>
        </ul>
      </nav>
    );
  }
}
