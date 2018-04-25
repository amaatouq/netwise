// Bot Bob:
// - pick a random answer for the initial stage
// - update the answer in the interactive stage to be the weighted average of the alters (including his). Weights based on performance (will require normalization so the weights add up to one).
// - follow top 'game.treatment.alterCount' people in the round outcome based on the current round's score
export const bob = {
  // // NOT IMPLEMENTED Called at the beginning of each stage (after onRoundStart/onStageStart)
  // onStageStart(bot, game, round, stage, players) {},

  // Called during each stage at tick interval (~1s at the moment)
  onStageTick(bot, game, round, stage, players, secondsRemaining) {
    if (bot.stage.submitted) {
      return;
    }

    if (stage.name !== "outcome") {
      const guess = Math.random();
      bot.stage.set("guess", guess);
      bot.round.set("guess", guess);
    }

    if (secondsRemaining <= 100) {
      bot.stage.submit();
    }
  }

  // // NOT IMPLEMENTED A player has changed a value
  // // This might happen a lot!
  // onStagePlayerChange(bot, game, round, stage, players, player) {}

  // // NOT IMPLEMENTED Called at the end of the stage (after it finished, before onStageEnd/onRoundEnd is called)
  // onStageEnd(bot, game, round, stage, players) {}
};
