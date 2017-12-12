import React from "react";
import { Random } from "meteor/random";
import PlayerProfile from "../components/PlayerProfile";
import { game, currentPlayer } from "../interfaceFakeData/data";
import Task from "../components/Task";

export default class Round extends React.Component {
  render() {
    const allRounds = game.rounds;
    const currentRound = allRounds[game.currentRoundId];

    return (
      <div className="round">
        {/*todo: here should go the roundNavigation*/}

        {/*I do not want the current player profile to update until the next round (static within round, changes across rounds)*/}
        <PlayerProfile currentPlayer={currentPlayer} />

        
        <Task task={currentRound.data.task} stage={currentRound.currentStage} />
      </div>
    );
  }
}
