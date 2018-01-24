import { withTracker } from "meteor/react-meteor-data";

import { Games } from "../../api/games/games";
import { Players } from "../../api/players/players";
import { Rounds } from "../../api/rounds/rounds";
import { Stages } from "../../api/stages/stages";
import { config } from "../../../game/client";
import Game from "../components/Game";

const BatchAvailable = new Mongo.Collection("batchAvailable");

export default withTracker(props => {
  const loading = !Meteor.subscribe("public").ready();

  // const batch
  return {
    batchAvailable: BatchAvailable.findOne("batchAvailable").batchAvailable,
    loading
  };
})(Game);
