import React from "react";

import PlayerProfile from "../components/PlayerProfile";
import RoundNav from "./RoundNav";
import SocialExposure from "./SocialExposure";
import SocialInteraction from "./SocialInteraction.jsx";
import Task from "../components/Task";

export default class Round extends React.Component {
  render() {
    const { round, stage, player, game, remainingSeconds } = this.props;

    return (
      <div className="round">
        <RoundNav round={round} stage={stage} />
        <div className="content">
          <PlayerProfile player={player} remainingSeconds={remainingSeconds} />
          <Task round={round} stage={stage} player={player} />
          <SocialExposure stage={stage} player={player} game={game} />
          <SocialInteraction stage={stage} player={player} game={game} />
        </div>
      </div>
    );
  }
}
