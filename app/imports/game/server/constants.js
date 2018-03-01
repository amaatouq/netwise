export const roundCount = 10;
export const maxOutDegree = 2;

export const avatarPaths = [
  "/games/task/avatars/bee.png",
  "/games/task/avatars/bird.png",
  "/games/task/avatars/cat.png",
  "/games/task/avatars/cow.png",
  "/games/task/avatars/pig.png"
];

const payouts = [
  [5.5, 1.7, 7.1, 3.3],
  [5.9, 2.0, 6.3, 4.3],
  [3.8, 4.8, 8.1, 2.6],
  [8.5, 1.6, 2.7, 4.3],
  [6.6, 3.5, 8.5, 4.2],
  [1.0, 2.0, 3.0, 4.0],
  [4.0, 3.0, 2.0, 1.0],
  [6.0, 2.0, 8.0, 3.0]
]

export const taskData = payouts.map(
  payoutAmts => {
    return {
      payout: {
        cooperate_cooperate: payoutAmts[0],
        cooperate_compete: payoutAmts[1],
        compete_cooperate: payoutAmts[2],
        compete_compete: payoutAmts[3],
      }
    };
  }
);
