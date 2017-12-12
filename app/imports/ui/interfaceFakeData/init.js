const avatars = ["a", "b", "c"];
const taskData = [
  { input: 1, correctAnswer: 1 },
  { input: 8, correctAnswer: 8 },
  { input: 2, correctAnswer: 2 }
];

const stages = ["initial", "interactive", "roundOutcome"];

const getNeighbors = a => a;

// initGame should return
export const initGame = (players, treatment) => {
  const game = { rounds: [], players: [] };

  const taskIndexes = _.shuffle(_.range(0, 3));

  _.times(3, i => {
    game.rounds.push({
      stages,
      data: {
        // This object 100% open, no fields bellow are required
        input: taskData[taskIndexes[i]].input,
        taskIndex: taskIndexes[i],
        randomNumber: 123
      }
    });
  });

  players.forEach(player => {
    const neighbors = getNeighbors(player, players, 2);
    game.players.push({
      ...player,
      data: {
        avatar: Random.choice(avatars),
        neighbors
      }
    });
  });

  return game;
};

// On each response (all stages)
export const computeResponse = (game, round, stage, player, responseData) => {
  if (reponse.stage === "initial" || reponse.stage === "social") {
    return;
  }

  if (reponse.stage.state === "done") {
    // update user score
  } else {
    player.set("tempScore", response.value);

    // update intermediate score var
    sum = 0;
    game.players.forEach(element => {
      sum += player.get("tempScore");
    });

    game.set("tempScore", sum / game.players.length);
  }

  task = allMyTasks[responseData.value];

  score = scoreFunction(response.responseData.value, task.correct_answer);

  return score;
};
