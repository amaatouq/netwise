import React from "react";

import PlayerProfile from "../components/PlayerProfile";
import SocialExposure from "./SocialExposure";
import SocialInteraction from "./SocialInteraction.jsx";
import Task from "../components/Task";

export default class Round extends React.Component {
  render() {
    const { round, stage, player, game } = this.props;
    const social = game.treatment.altersCount > 0;
    const interactive = social && stage.name === "interactive";

    //checking whether the game contains feedback and whether it is time for it!
    //currentRoundNumber % nRounds/shockRate * nRounds + 1  => whether it is time!
    const feedbackTime =
      game.treatment.feedbackRate > 0 &&
      (round.index + 1) %
        Math.round(
          game.treatment.nRounds /
            (game.treatment.feedbackRate * game.treatment.nRounds)
        ) ===
        0;
    return (
      <div className="round">
        <div className="content">
          <PlayerProfile
            player={player}
            stage={stage}
            game={game}
            feedbackTime={feedbackTime}
          />
          <Task
            round={round}
            stage={stage}
            player={player}
            game={game}
            feedbackTime={feedbackTime}
          />
          {social && stage.name === "interactive" ? (
            <SocialExposure
              stage={stage}
              player={player}
              game={game}
              feedbackTime={feedbackTime}
            />
          ) : null}
          {social && stage.name === "outcome" ? (
            <SocialInteraction
              stage={stage}
              player={player}
              game={game}
              feedbackTime={feedbackTime}
            />
          ) : null}
        </div>
      </div>
    );
  }
}
