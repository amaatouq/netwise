export const gameConfigs = {};

// NewGame is how Game register themselves with Netwise.
// TODO add full docs on NewGame usage
export const RegisterGame = (name, config) => {
  // console.log(name, config);
  if (!gameConfigs[name]) {
    gameConfigs[name] = {};
  }

  _.extend(gameConfigs[name], config);
};
