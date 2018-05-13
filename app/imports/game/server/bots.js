// Bot Bob:
// - pick a random answer for the initial stage
// - update the answer in the interactive stage to be the weighted average of the alters (including his). Weights based on performance (will require normalization so the weights add up to one).
// - follow top 'game.treatment.alterCount' people in the round outcome based on the current round's score
export const bob = {
  // // NOT IMPLEMENTED Called at the beginning of each stage (after onRoundStart/onStageStart)
  // onStageStart(bot, game, round, stage, players) {},

  // Called during each stage at tick interval (~1s at the moment)
  // TODO: the bot should have something that indicates that everyone else submitted.
  // something like: if all.submitted? bot.submit();
  onStageTick(bot, game, round, stage, players, secondsRemaining) {
    if (bot.stage.submitted) {
      return;
    }

    // Get alters of the bot
    const alterIds = bot.get("alterIds");

    const allPlayers = _.sortBy(game.players, p =>
      p.get("cumulativeScore")
    ).reverse();
    const alters = allPlayers.filter(p => alterIds.includes(p._id));

    if (stage.name === "response") {
      const guess = Math.random();
      bot.stage.set("guess", guess);
      bot.round.set("guess", guess);
      bot.stage.submit();
    } else if (stage.name === "interactive") {
      // This should run when a player has changed a value, not every second
      // NOTE(np) Not sure what this was what you wanted, but it was cummulative
      // so it went beyond bounds before, now it's just the mean of the alters.
      const sum = alters.reduce(
        (sum, alter) => sum + alter.round.get("guess"),
        0
      );
      const currentGuess = sum / alterIds.length;
      console.log("bob's updated guess", currentGuess);
      bot.stage.set("guess", currentGuess);
      bot.round.set("guess", currentGuess);
    } else if (stage.name === "outcome") {
      // Follow top k performing players
      // console.log("from inside bot in round outcome",game);

      // if (game.treatment.rewiring) {
      // bot.set("alterIds", allPlayers.slice(0, game.treatment.altersCount));
      bot.set("alterIds", allPlayers.slice(0, 2));
      bot.stage.submit();
    }

    if (secondsRemaining <= 50) {
      bot.stage.submit();
    }
  }

  // // NOT IMPLEMENTED A player has changed a value
  // // This might happen a lot!
  // onStagePlayerChange(bot, game, round, stage, players, player) {}

  // // NOT IMPLEMENTED Called at the end of the stage (after it finished, before onStageEnd/onRoundEnd is called)
  // onStageEnd(bot, game, round, stage, players) {}
};
