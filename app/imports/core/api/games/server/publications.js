import { Games } from "../games";
import { gameConfigs } from "../register";

// This should be a global setting somewhere eventually
const gameName = "task";

Meteor.publish("game", function() {
  const gameId = this.connection.id;

  const game = Games.findOne(gameId);
  if (!game) {
    const config = gameConfigs[gameName];
    if (!config) {
      throw new Error("unknown game: " + gameName);
    }

    const params = config.init("cooperative", [{ _id: Random.id() }]);
    params._id = gameId;
    params.name = gameName;
    console.log(JSON.stringify(params, null, "  "));

    Games.insert(params);
  }

  return Games.find(gameId);
});
