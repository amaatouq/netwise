import { GameLobbies } from "../game-lobbies";
import { Players } from "../../players/players";
import { Treatments } from "../../treatments/treatments";

publishComposite("gameLobby", function({ playerId }) {
  return {
    find() {
      return GameLobbies.find({ playerIds: playerId });
    },
    children: [
      {
        find({ treatmentId }) {
          return Treatments.find(treatmentId);
        }
      },
      {
        find() {
          return Players.find(playerId);
        }
      }
    ]
  };
});
