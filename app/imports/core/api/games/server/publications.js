import { Games } from "../games";
import { Players } from "../../players/players";
import { Rounds } from "../../rounds/rounds";
import { Stages } from "../../stages/stages";
import { config } from "../../../../game/server";

Meteor.publish("game", function() {
  const gameId = this.connection.id;
  // const gameId = "abc";

  const game = Games.findOne(gameId);
  if (!game) {
    const params = config.init(
      {
        playersCount: 12,
        altersCount: 4,
        rewiring: true
      },
      [{ _id: Random.id() }]
    );
    params._id = gameId;
    // console.log(JSON.stringify(params, null, "  "));

    params.playerIds = params.players.map(player => {
      return Players.insert(_.extend({ id: "1", gameId }, player));
    });

    params.timeoutInSeconds = 10 * 60;
    params.treatmentId = "PNJHjuWZsx2e8RAzX";
    params.batchId = "PNJHjuWZsx2e8RAzX";
    const rounds = params.rounds; // Gonna get wiped by SimpleSchema clean
    Games.insert(params);
    const roundIds = rounds.map(round => {
      const roundId = Rounds.insert(_.extend({ gameId }, round));
      const stageIds = round.stages.map(stage => {
        return Stages.insert(_.extend({ gameId, roundId }, stage));
      });
      Rounds.update(roundId, { $set: { stageIds } });
      return roundId;
    });

    Games.update(gameId, { $set: { roundIds } });
  }

  return [
    Games.find(gameId),
    Rounds.find({ gameId }),
    Stages.find({ gameId }),
    Players.find({ gameId })
  ];
});
