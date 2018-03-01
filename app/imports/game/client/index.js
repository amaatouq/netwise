import SimpleSchema from "simpl-schema";
import Round from "./components/Round";

// config contains the client side configuration for this game. It is used by
// netwise core to initialize and run the game.
export const config = {
  RoundComponent: Round
};
