import { Random } from "meteor/random";

//list of avatars
const avatars = [
  "/avatars/bee.png",
  "/avatars/bird.png",
  "/avatars/cat.png",
  "/avatars/cow.png",
  "/avatars/pig.png"
];

/*
Creating dummy Tasks data: we will shuffle them at the game level
*/
const Tasks = _.shuffle([
  {
    _id: "1",
    data: { taskPath: "/tasks/1.png", correctAnswer: 0.1, difficulty: "easy" }
  },
  {
    _id: "2",
    data: { taskPath: "/tasks/2.png", correctAnswer: 0.6, difficulty: "easy" }
  },
  {
    _id: "3",
    data: { taskPath: "/tasks/3.png", correctAnswer: 0.3, difficulty: "easy" }
  },
  {
    _id: "4",
    data: { taskPath: "/tasks/4.png", correctAnswer: 0.54, difficulty: "easy" }
  }
]);

/*
Creating dummy players data: this will be provided to us by netwise
*/
//create empty list of players
const nPlayers = 3;
let players = [];
//fill the list with random players information
_.times(nPlayers, i => {
  players.push({
    _id: Random.id(),
    createdAt: new Date(),
    alters: null,
    data: {
      avatar: avatars[i],
      score: _.random(0, 123)
    }
  });
});
//add alters
//todo: we need to think of the network structure. What if it changes every round? how can we keep a history of the entire networks etc.
const maxOutDegree = 2; //maximum number of out going degree (i.e., how many 'alters' the 'ego' is connected to
players.forEach(player => {
  player.alters = Array.from(
    new Set(_.sample(removeElement(players, player), maxOutDegree))
  );
});
//select one players at random to be the currentPlayer
export const currentPlayer = Random.choice(players);

/*
Creating dummy round data: this will be created at the initiation of the game
TODO: this round structure I do not like. The main unit of analysis is the user per round  for example:
    Players might have a different task for the same round
    We want to know the answer for each player per round
    We want to know the alters for each player per round
    What about if different player types (dictator, recipient) have different number of stages?
    Therefore: we need better PlayerRound data structure
    For now: I'll just assume that the Rounds object is for the current player (filtered)
*/
const nRounds = 3; //the number of rounds in this game
//stages per round
const stages = ["initial", "interactive", "outcome"];
//const currentStage = Random.choice(stages);//random stage
export const currentStage = stages[0]; //explicitly chosen stage
export let rounds = [];
_.times(nRounds, i => {
  rounds.push({
    _id: i,
    createdAt: new Date(),
    stages,
    currentStage: currentStage,
    data: { task: Tasks[i] }
  });
});

//TODO: can treatment be an array to describe factor experimental design?
//Imagine we have two factors: number of players [high, mid, low] and network status [static,dynamic]
//Then we will have 6 treatments: [high,static], [high, dynamic], [mid,static],[mid,dynamic],[low,static],[low,dynamic]
//notice that the choice of high/low effects the recruitment of participants (number of players)
//However static/dynamic effects the stage 'round outcome'
//It makes sense that in the round outcome I just have to check static/dynamic without checking
//whether the number of players is high/low .. also, at recruitment, I should be able to specify the number of people I want, regardless of static/dynamic
export const game = {
  _id: Random.id(),
  treatments: [],
  players,
  rounds,
  currentRoundId: _.random(0, nRounds - 1)
};

//Helper functions to create the dummy data
//function to remove element from an array in an non-mutable way
function removeElement(array, element) {
  return array.filter(e => e !== element);
}
