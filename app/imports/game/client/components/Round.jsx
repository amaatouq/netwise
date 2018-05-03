import React from "react";

import PlayerProfile from "../components/PlayerProfile";
import SocialInteraction from "./SocialInteraction.jsx";
import Task from "../components/Task";

export default class Round extends React.Component {
  render() {
    const { round, stage, player, game } = this.props;
    const social = game.treatment.altersCount > 0;
    const interactive = social && stage.name === "interactive";

    return (
      <div className="round">
        <div className="content">
          <PlayerProfile
            player={player}
            stage={stage}
            game={game}
          />
          <Task
            social={social}
            round={round}
            stage={stage}
            player={player}
            game={game}
          />
          {social && (stage.name === "outcome" || stage.name === "interactive")
            ? <SocialInteraction
                stage={stage}
                player={player}
                game={game}
                showScoreIncrement={stage.name === "outcome"}
              />
            : null}
        </div>
      </div>
    );
  }
}
