import { Games } from "./games";
import { PlayerRounds } from "../player-rounds/player-rounds";
import { PlayerStages } from "../player-stages/player-stages";
import { Players } from "../players/players";
import { Rounds } from "../rounds/rounds";
import { Stages } from "../stages/stages";
import { config } from "../../../game/server";

export const createGameFromLobby = gameLobby => {
  const players = gameLobby.players();

  const batch = gameLobby.batch();
  const treatment = gameLobby.treatment();
  const conditions = treatment.conditionsObject();
  const { batchId, treatmentId, status } = gameLobby;

  // Ask (experimenter designer) init function to configure this game
  // given the conditions and players given.
  const params = config.init(conditions, players);

  // We need to create/configure stuff associated with the game before we
  // create it so we generate the id early
  const gameId = Random.id();
  params._id = gameId;
  // We also add a few related objects
  params.treatmentId = treatmentId;
  params.batchId = batchId;
  params.status = status;

  // playerIds is the reference to players stored in the game object
  params.playerIds = params.players.map(p => p._id);
  // We then need to verify all these ids exist and are unique, the
  // init function might not have returned them correctly
  const len = _.uniq(_.compact(params.playerIds)).length;
  if (len !== params.players.length || len !== players.length) {
    throw new Error("invalid player count");
  }

  // We want to copy over the changes made by the init function and save the
  // gameId in the player objects already in the DB
  params.players.forEach(({ _id, data }) => {
    Players.update(_id, { $set: { gameId, data } });
  });

  // Create the round objects
  let stageIndex = 0;
  params.roundIds = params.rounds.map((round, index) => {
    const roundId = Rounds.insert(_.extend({ gameId, index }, round));
    const stageIds = round.stages.map(stage => {
      const sParams = _.extend({ gameId, roundId, index: stageIndex }, stage);
      const stageId = Stages.insert(sParams);
      stageIndex++;
      if (!params.currentStageId) {
        params.currentStageId = stageId;
      }
      const playerStageIds = params.players.map(({ _id: playerId }) => {
        return PlayerStages.insert({
          playerId,
          stageId,
          roundId,
          gameId,
          batchId
        });
      });
      Stages.update(stageId, { $set: { playerStageIds } });
      return stageId;
    });
    const playerRoundIds = params.players.map(({ _id: playerId }) => {
      return PlayerRounds.insert({
        playerId,
        roundId,
        gameId,
        batchId
      });
    });
    Rounds.update(roundId, { $set: { stageIds, playerRoundIds } });
    return roundId;
  });

  // Insert game. As soon as it comes online, the game will start for the
  // players so all related object (rounds, stages, players) must be created
  // and ready
  return Games.insert(params);
};
