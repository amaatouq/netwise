import { publishComposite } from "meteor/reywood:publish-composite";

import { GameLobbies } from "../../game-lobbies/game-lobbies";
import { Games } from "../games";
import { Players } from "../../players/players";
import { Rounds } from "../../rounds/rounds";
import { Stages } from "../../stages/stages";
import { Treatments } from "../../treatments/treatments";

const treatment = {
  find({ treatmentId }) {
    return Treatments.find(treatmentId);
  }
};

publishComposite("game", function({ playerId }) {
  console.log(playerId);

  return {
    find() {
      return Players.find(playerId);
    },

    children: [
      {
        find({ gameLobbyId }) {
          return GameLobbies.find(gameLobbyId);
        },
        children: [treatment]
      },
      {
        find({ gameId }) {
          console.log(gameId);
          return Games.find(gameId);
        },
        children: [treatment]
      },
      {
        find({ gameId }) {
          return Rounds.find({ gameId });
        }
      },
      {
        find({ gameId }) {
          return Stages.find({ gameId });
        }
      },
      {
        find({ gameId }) {
          return Players.find({ gameId });
        }
      }
    ]
  };
});
