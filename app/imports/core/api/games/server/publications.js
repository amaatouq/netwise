import { publishComposite } from "meteor/reywood:publish-composite";

import { GameLobbies } from "../../game-lobbies/game-lobbies";
import { Games } from "../games";
import { PlayerRounds } from "../../player-rounds/player-rounds";
import { PlayerStages } from "../../player-stages/player-stages";
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
          return Games.find(gameId);
        },
        children: [
          treatment,
          {
            find({ _id: gameId }) {
              return Rounds.find({ gameId });
            }
          },
          {
            find({ _id: gameId }) {
              return Stages.find({ gameId });
            }
          },
          {
            find({ _id: gameId }) {
              return Players.find({ gameId });
            }
          },
          {
            find({ currentStageId }) {
              return Stages.find(currentStageId);
            },
            children: [
              {
                find({ _id: stageId }) {
                  return PlayerStages.find({ stageId });
                }
              },
              {
                find({ roundId }) {
                  return Rounds.find(roundId);
                },
                children: [
                  {
                    find({ _id: roundId }) {
                      return PlayerRounds.find({ roundId });
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  };
});
