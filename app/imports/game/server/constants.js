export const avatarPaths = [
  "/games/avatars/bee.png",
  "/games/avatars/bird.png",
  "/games/avatars/cat.png",
  "/games/avatars/cow.png",
  "/games/avatars/pig.png"
];

export const difficulties = ["easy", "medium", "hard"];

const randomAngle = () => (2 * Math.random() - 1) * Math.PI;

const generateTaskData = (length) => (
  Array.from({length}).map(i => ({
    _id: i,
    correctAnswer: randomAngle(),
    answerProportion: 0.9,
    dotSpeed: 120,
  }))
);

export const taskData = generateTaskData(50);
