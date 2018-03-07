import React from "react";

import PlayerProfile from "../components/PlayerProfile";
import Breadcrumb from "./Breadcrumb";
import SocialExposure from "./SocialExposure";
import SocialInteraction from "./SocialInteraction.jsx";
import Task from "../components/Task";

export default class Round extends React.Component {


  render() {
    const { round, stage, player, game } = this.props;
    const social = game.treatment.altersCount > 0;

    return (
      <div className="round">
        <Breadcrumb round={round} stage={stage} />
        <div className="content">
          <PlayerProfile player={player} stage={stage} game={game} />
          <Task round={round} stage={stage} player={player} game={game} />
          {social && stage.name === "interactive"
            ? <SocialExposure stage={stage} player={player} game={game} />:
            null}
          {social && stage.name === "outcome"
            ? <SocialInteraction stage={stage} player={player} game={game} />:
            null}
        </div>
      </div>
    );
  }
}
