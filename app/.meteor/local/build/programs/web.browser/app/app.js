var require = meteorInstall({"imports":{"startup":{"both":{"index.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// imports/startup/both/index.js                                                                                //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
// Import modules used by both client and server through a single index entry point                             // 1
// e.g. useraccounts configuration file.                                                                        // 2
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"client":{"index.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// imports/startup/client/index.js                                                                              //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
module.watch(require("./routes.js"));                                                                           // 1
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"routes.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// imports/startup/client/routes.js                                                                             //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
module.export({                                                                                                 // 1
  renderRoutes: function () {                                                                                   // 1
    return renderRoutes;                                                                                        // 1
  }                                                                                                             // 1
});                                                                                                             // 1
var Route = void 0,                                                                                             // 1
    Router = void 0;                                                                                            // 1
module.watch(require("react-router"), {                                                                         // 1
  Route: function (v) {                                                                                         // 1
    Route = v;                                                                                                  // 1
  },                                                                                                            // 1
  Router: function (v) {                                                                                        // 1
    Router = v;                                                                                                 // 1
  }                                                                                                             // 1
}, 0);                                                                                                          // 1
var createBrowserHistory = void 0;                                                                              // 1
module.watch(require("history"), {                                                                              // 1
  createBrowserHistory: function (v) {                                                                          // 1
    createBrowserHistory = v;                                                                                   // 1
  }                                                                                                             // 1
}, 1);                                                                                                          // 1
var React = void 0;                                                                                             // 1
module.watch(require("react"), {                                                                                // 1
  "default": function (v) {                                                                                     // 1
    React = v;                                                                                                  // 1
  }                                                                                                             // 1
}, 2);                                                                                                          // 1
var Round = void 0;                                                                                             // 1
module.watch(require("../../ui/pages/Round"), {                                                                 // 1
  "default": function (v) {                                                                                     // 1
    Round = v;                                                                                                  // 1
  }                                                                                                             // 1
}, 3);                                                                                                          // 1
var browserHistory = createBrowserHistory();                                                                    // 7
                                                                                                                //
var renderRoutes = function () {                                                                                // 8
  return React.createElement(                                                                                   // 8
    Router,                                                                                                     // 9
    {                                                                                                           // 9
      history: browserHistory                                                                                   // 9
    },                                                                                                          // 9
    React.createElement(                                                                                        // 10
      "div",                                                                                                    // 10
      {                                                                                                         // 10
        className: "grid"                                                                                       // 10
      },                                                                                                        // 10
      React.createElement(                                                                                      // 11
        "header",                                                                                               // 11
        null,                                                                                                   // 11
        React.createElement(                                                                                    // 12
          "h1",                                                                                                 // 12
          null,                                                                                                 // 12
          "Netwise"                                                                                             // 12
        )                                                                                                       // 12
      ),                                                                                                        // 11
      React.createElement(                                                                                      // 15
        "main",                                                                                                 // 15
        null,                                                                                                   // 15
        React.createElement(Route, {                                                                            // 17
          path: "/",                                                                                            // 17
          component: Round                                                                                      // 17
        })                                                                                                      // 17
      ),                                                                                                        // 15
      React.createElement(                                                                                      // 20
        "footer",                                                                                               // 20
        null,                                                                                                   // 20
        "footer"                                                                                                // 20
      )                                                                                                         // 20
    )                                                                                                           // 10
  );                                                                                                            // 9
};                                                                                                              // 8
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"ui":{"components":{"PlayerProfile.jsx":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// imports/ui/components/PlayerProfile.jsx                                                                      //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                         //
                                                                                                                //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                //
                                                                                                                //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                   //
                                                                                                                //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                          //
                                                                                                                //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                     //
                                                                                                                //
var _inherits3 = _interopRequireDefault(_inherits2);                                                            //
                                                                                                                //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }               //
                                                                                                                //
module.export({                                                                                                 // 1
  "default": function () {                                                                                      // 1
    return PlayerProfile;                                                                                       // 1
  }                                                                                                             // 1
});                                                                                                             // 1
var PropTypes = void 0;                                                                                         // 1
module.watch(require("prop-types"), {                                                                           // 1
  "default": function (v) {                                                                                     // 1
    PropTypes = v;                                                                                              // 1
  }                                                                                                             // 1
}, 0);                                                                                                          // 1
var React = void 0;                                                                                             // 1
module.watch(require("react"), {                                                                                // 1
  "default": function (v) {                                                                                     // 1
    React = v;                                                                                                  // 1
  }                                                                                                             // 1
}, 1);                                                                                                          // 1
                                                                                                                //
var PlayerProfile = function (_React$Component) {                                                               //
  (0, _inherits3.default)(PlayerProfile, _React$Component);                                                     //
                                                                                                                //
  function PlayerProfile() {                                                                                    //
    (0, _classCallCheck3.default)(this, PlayerProfile);                                                         //
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));             //
  }                                                                                                             //
                                                                                                                //
  PlayerProfile.prototype.render = function () {                                                                //
    function render() {                                                                                         //
      var currentPlayer = this.props.currentPlayer;                                                             // 5
      return React.createElement(                                                                               // 8
        "aside",                                                                                                // 9
        {                                                                                                       // 9
          className: "player-profile"                                                                           // 9
        },                                                                                                      // 9
        React.createElement(                                                                                    // 10
          "h3",                                                                                                 // 10
          null,                                                                                                 // 10
          "Your Profile"                                                                                        // 10
        ),                                                                                                      // 10
        React.createElement("img", {                                                                            // 11
          src: currentPlayer.data.avatar,                                                                       // 11
          className: "profile-avatar"                                                                           // 11
        }),                                                                                                     // 11
        React.createElement(                                                                                    // 13
          "div",                                                                                                // 13
          null,                                                                                                 // 13
          "ID:",                                                                                                // 13
          currentPlayer._id                                                                                     // 13
        ),                                                                                                      // 13
        React.createElement(                                                                                    // 20
          "div",                                                                                                // 20
          {                                                                                                     // 20
            className: "profile-score"                                                                          // 20
          },                                                                                                    // 20
          React.createElement(                                                                                  // 21
            "h4",                                                                                               // 21
            null,                                                                                               // 21
            "Total score"                                                                                       // 21
          ),                                                                                                    // 21
          React.createElement(                                                                                  // 22
            "span",                                                                                             // 22
            null,                                                                                               // 22
            currentPlayer.data.score                                                                            // 22
          )                                                                                                     // 22
        )                                                                                                       // 20
      );                                                                                                        // 9
    }                                                                                                           // 26
                                                                                                                //
    return render;                                                                                              //
  }();                                                                                                          //
                                                                                                                //
  return PlayerProfile;                                                                                         //
}(React.Component);                                                                                             //
                                                                                                                //
PlayerProfile.propTypes = {                                                                                     // 29
  // Current player with all the attribute about the player:                                                    // 30
  //Things include: Avatar, Score, Bonus, Gender Team membership (Whether came from Mturk or Crowdflower)       // 31
  currentPlayer: PropTypes.object.isRequired                                                                    // 32
};                                                                                                              // 29
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"Task.jsx":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// imports/ui/components/Task.jsx                                                                               //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                         //
                                                                                                                //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                //
                                                                                                                //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                   //
                                                                                                                //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                          //
                                                                                                                //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                     //
                                                                                                                //
var _inherits3 = _interopRequireDefault(_inherits2);                                                            //
                                                                                                                //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }               //
                                                                                                                //
module.export({                                                                                                 // 1
  "default": function () {                                                                                      // 1
    return Task;                                                                                                // 1
  }                                                                                                             // 1
});                                                                                                             // 1
var PropTypes = void 0;                                                                                         // 1
module.watch(require("prop-types"), {                                                                           // 1
  "default": function (v) {                                                                                     // 1
    PropTypes = v;                                                                                              // 1
  }                                                                                                             // 1
}, 0);                                                                                                          // 1
var React = void 0;                                                                                             // 1
module.watch(require("react"), {                                                                                // 1
  "default": function (v) {                                                                                     // 1
    React = v;                                                                                                  // 1
  }                                                                                                             // 1
}, 1);                                                                                                          // 1
var TaskStimulus = void 0;                                                                                      // 1
module.watch(require("./TaskStimulus"), {                                                                       // 1
  "default": function (v) {                                                                                     // 1
    TaskStimulus = v;                                                                                           // 1
  }                                                                                                             // 1
}, 2);                                                                                                          // 1
                                                                                                                //
var Task = function (_React$Component) {                                                                        //
  (0, _inherits3.default)(Task, _React$Component);                                                              //
                                                                                                                //
  function Task() {                                                                                             //
    (0, _classCallCheck3.default)(this, Task);                                                                  //
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));             //
  }                                                                                                             //
                                                                                                                //
  Task.prototype.render = function () {                                                                         //
    function render() {                                                                                         //
      var task = this.props.task;                                                                               // 7
      var stage = this.props.stage;                                                                             // 8
      console.log("task from inside task", task);                                                               // 9
      console.log("stage from inside task", stage);                                                             // 10
      return React.createElement(                                                                               // 12
        "main",                                                                                                 // 13
        {                                                                                                       // 13
          className: "task"                                                                                     // 13
        },                                                                                                      // 13
        React.createElement(TaskStimulus, {                                                                     // 14
          task: task                                                                                            // 14
        })                                                                                                      // 14
      );                                                                                                        // 13
    }                                                                                                           // 17
                                                                                                                //
    return render;                                                                                              //
  }();                                                                                                          //
                                                                                                                //
  return Task;                                                                                                  //
}(React.Component);                                                                                             //
                                                                                                                //
Task.propTypes = {                                                                                              // 20
  // Current round index                                                                                        // 21
  task: PropTypes.object.isRequired,                                                                            // 22
  stage: PropTypes.string.isRequired                                                                            // 23
};                                                                                                              // 20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"TaskStimulus.jsx":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// imports/ui/components/TaskStimulus.jsx                                                                       //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                         //
                                                                                                                //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                //
                                                                                                                //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                   //
                                                                                                                //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                          //
                                                                                                                //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                     //
                                                                                                                //
var _inherits3 = _interopRequireDefault(_inherits2);                                                            //
                                                                                                                //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }               //
                                                                                                                //
module.export({                                                                                                 // 1
  "default": function () {                                                                                      // 1
    return TaskStimulus;                                                                                        // 1
  }                                                                                                             // 1
});                                                                                                             // 1
var PropTypes = void 0;                                                                                         // 1
module.watch(require("prop-types"), {                                                                           // 1
  "default": function (v) {                                                                                     // 1
    PropTypes = v;                                                                                              // 1
  }                                                                                                             // 1
}, 0);                                                                                                          // 1
var React = void 0;                                                                                             // 1
module.watch(require("react"), {                                                                                // 1
  "default": function (v) {                                                                                     // 1
    React = v;                                                                                                  // 1
  }                                                                                                             // 1
}, 1);                                                                                                          // 1
                                                                                                                //
var TaskStimulus = function (_React$Component) {                                                                //
  (0, _inherits3.default)(TaskStimulus, _React$Component);                                                      //
                                                                                                                //
  function TaskStimulus() {                                                                                     //
    (0, _classCallCheck3.default)(this, TaskStimulus);                                                          //
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));             //
  }                                                                                                             //
                                                                                                                //
  TaskStimulus.prototype.render = function () {                                                                 //
    function render() {                                                                                         //
      console.log('taskPath', this.props.task.data.taskPath);                                                   // 8
      return React.createElement("img", {                                                                       // 9
        src: this.props.task.data.taskPath,                                                                     // 9
        className: "task-image"                                                                                 // 9
      });                                                                                                       // 9
    }                                                                                                           // 10
                                                                                                                //
    return render;                                                                                              //
  }();                                                                                                          //
                                                                                                                //
  return TaskStimulus;                                                                                          //
}(React.Component);                                                                                             //
                                                                                                                //
TaskStimulus.propTypes = {                                                                                      // 14
  task: PropTypes.object                                                                                        // 15
};                                                                                                              // 14
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"interfaceFakeData":{"data.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// imports/ui/interfaceFakeData/data.js                                                                         //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
module.export({                                                                                                 // 1
  currentPlayer: function () {                                                                                  // 1
    return currentPlayer;                                                                                       // 1
  },                                                                                                            // 1
  currentStage: function () {                                                                                   // 1
    return currentStage;                                                                                        // 1
  },                                                                                                            // 1
  rounds: function () {                                                                                         // 1
    return rounds;                                                                                              // 1
  },                                                                                                            // 1
  game: function () {                                                                                           // 1
    return game;                                                                                                // 1
  }                                                                                                             // 1
});                                                                                                             // 1
var Random = void 0;                                                                                            // 1
module.watch(require("meteor/random"), {                                                                        // 1
  Random: function (v) {                                                                                        // 1
    Random = v;                                                                                                 // 1
  }                                                                                                             // 1
}, 0);                                                                                                          // 1
//list of avatars                                                                                               // 3
var avatars = ["/avatars/bee.png", "/avatars/bird.png", "/avatars/cat.png", "/avatars/cow.png", "/avatars/pig.png"]; /*
                                                                                                                     Creating dummy Tasks data: we will shuffle them at the game level
                                                                                                                     */
                                                                                                                //
var Tasks = _.shuffle([{                                                                                        // 17
  _id: "1",                                                                                                     // 19
  data: {                                                                                                       // 20
    taskPath: "/tasks/1.png",                                                                                   // 20
    correctAnswer: 0.1,                                                                                         // 20
    difficulty: "easy"                                                                                          // 20
  }                                                                                                             // 20
}, {                                                                                                            // 18
  _id: "2",                                                                                                     // 23
  data: {                                                                                                       // 24
    taskPath: "/tasks/2.png",                                                                                   // 24
    correctAnswer: 0.6,                                                                                         // 24
    difficulty: "easy"                                                                                          // 24
  }                                                                                                             // 24
}, {                                                                                                            // 22
  _id: "3",                                                                                                     // 27
  data: {                                                                                                       // 28
    taskPath: "/tasks/3.png",                                                                                   // 28
    correctAnswer: 0.3,                                                                                         // 28
    difficulty: "easy"                                                                                          // 28
  }                                                                                                             // 28
}, {                                                                                                            // 26
  _id: "4",                                                                                                     // 31
  data: {                                                                                                       // 32
    taskPath: "/tasks/4.png",                                                                                   // 32
    correctAnswer: 0.54,                                                                                        // 32
    difficulty: "easy"                                                                                          // 32
  }                                                                                                             // 32
}]); /*                                                                                                         // 30
     Creating dummy players data: this will be provided to us by netwise                                        //
     */ //create empty list of players                                                                          //
                                                                                                                //
                                                                                                                //
var nPlayers = 3;                                                                                               // 42
var players = []; //fill the list with random players information                                               // 43
                                                                                                                //
_.times(nPlayers, function (i) {                                                                                // 45
  players.push({                                                                                                // 46
    _id: Random.id(),                                                                                           // 47
    createdAt: new Date(),                                                                                      // 48
    alters: null,                                                                                               // 49
    data: {                                                                                                     // 50
      avatar: avatars[i],                                                                                       // 51
      score: _.random(0, 123)                                                                                   // 52
    }                                                                                                           // 50
  });                                                                                                           // 46
}); //add alters                                                                                                // 55
//todo: we need to think of the network structure. What if it changes every round? how can we keep a history of the entire networks etc.
                                                                                                                //
                                                                                                                //
var maxOutDegree = 2; //maximum number of out going degree (i.e., how many 'alters' the 'ego' is connected to   // 58
                                                                                                                //
players.forEach(function (player) {                                                                             // 59
  player.alters = Array.from(new Set(_.sample(removeElement(players, player), maxOutDegree)));                  // 60
}); //select one players at random to be the currentPlayer                                                      // 63
                                                                                                                //
var currentPlayer = Random.choice(players);                                                                     // 65
/*                                                                                                              // 68
Creating dummy round data: this will be created at the initiation of the game                                   //
TODO: this round structure I do not like. The main unit of analysis is the user per round  for example:         //
    Players might have a different task for the same round                                                      //
    We want to know the answer for each player per round                                                        //
    We want to know the alters for each player per round                                                        //
    What about if different player types (dictator, recipient) have different number of stages?                 //
    Therefore: we need better PlayerRound data structure                                                        //
    For now: I'll just assume that the Rounds object is for the current player (filtered)                       //
*/var nRounds = 3; //the number of rounds in this game                                                          //
//stages per round                                                                                              // 79
                                                                                                                //
var stages = ["initial", "interactive", "outcome"]; //const currentStage = Random.choice(stages);//random stage
                                                                                                                //
var currentStage = stages[0];                                                                                   // 82
var rounds = [];                                                                                                // 83
                                                                                                                //
_.times(nRounds, function (i) {                                                                                 // 84
  rounds.push({                                                                                                 // 85
    _id: i,                                                                                                     // 86
    createdAt: new Date(),                                                                                      // 87
    stages: stages,                                                                                             // 88
    currentStage: currentStage,                                                                                 // 89
    data: {                                                                                                     // 90
      task: Tasks[i]                                                                                            // 90
    }                                                                                                           // 90
  });                                                                                                           // 85
}); //TODO: can treatment be an array to describe factor experimental design?                                   // 92
//Imagine we have two factors: number of players [high, mid, low] and network status [static,dynamic]           // 96
//Then we will have 6 treatments: [high,static], [high, dynamic], [mid,static],[mid,dynamic],[low,static],[low,dynamic]
//notice that the choice of high/low effects the recruitment of participants (number of players)                // 98
//However static/dynamic effects the stage 'round outcome'                                                      // 99
//It makes sense that in the round outcome I just have to check static/dynamic without checking                 // 100
//whether the number of players is high/low .. also, at recruitment, I should be able to specify the number of people I want, regardless of static/dynamic
                                                                                                                //
                                                                                                                //
var game = {                                                                                                    // 102
  _id: Random.id(),                                                                                             // 102
  treatments: [],                                                                                               // 102
  players: players,                                                                                             // 102
  rounds: rounds,                                                                                               // 102
  currentRoundId: _.random(0, nRounds - 1)                                                                      // 102
};                                                                                                              // 102
                                                                                                                //
//Helper functions to create the dummy data                                                                     // 106
//function to remove element from an array in an non-mutable way                                                // 107
function removeElement(array, element) {                                                                        // 108
  return array.filter(function (e) {                                                                            // 109
    return e !== element;                                                                                       // 109
  });                                                                                                           // 109
}                                                                                                               // 110
                                                                                                                //
;                                                                                                               // 110
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}},"pages":{"Round.jsx":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// imports/ui/pages/Round.jsx                                                                                   //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                                         //
                                                                                                                //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                                //
                                                                                                                //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");                   //
                                                                                                                //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);                          //
                                                                                                                //
var _inherits2 = require("babel-runtime/helpers/inherits");                                                     //
                                                                                                                //
var _inherits3 = _interopRequireDefault(_inherits2);                                                            //
                                                                                                                //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }               //
                                                                                                                //
module.export({                                                                                                 // 1
  "default": function () {                                                                                      // 1
    return Round;                                                                                               // 1
  }                                                                                                             // 1
});                                                                                                             // 1
var React = void 0;                                                                                             // 1
module.watch(require("react"), {                                                                                // 1
  "default": function (v) {                                                                                     // 1
    React = v;                                                                                                  // 1
  }                                                                                                             // 1
}, 0);                                                                                                          // 1
var Random = void 0;                                                                                            // 1
module.watch(require("meteor/random"), {                                                                        // 1
  Random: function (v) {                                                                                        // 1
    Random = v;                                                                                                 // 1
  }                                                                                                             // 1
}, 1);                                                                                                          // 1
var PlayerProfile = void 0;                                                                                     // 1
module.watch(require("../components/PlayerProfile"), {                                                          // 1
  "default": function (v) {                                                                                     // 1
    PlayerProfile = v;                                                                                          // 1
  }                                                                                                             // 1
}, 2);                                                                                                          // 1
var game = void 0,                                                                                              // 1
    currentPlayer = void 0;                                                                                     // 1
module.watch(require("../interfaceFakeData/data"), {                                                            // 1
  game: function (v) {                                                                                          // 1
    game = v;                                                                                                   // 1
  },                                                                                                            // 1
  currentPlayer: function (v) {                                                                                 // 1
    currentPlayer = v;                                                                                          // 1
  }                                                                                                             // 1
}, 3);                                                                                                          // 1
var Task = void 0;                                                                                              // 1
module.watch(require("../components/Task"), {                                                                   // 1
  "default": function (v) {                                                                                     // 1
    Task = v;                                                                                                   // 1
  }                                                                                                             // 1
}, 4);                                                                                                          // 1
                                                                                                                //
var Round = function (_React$Component) {                                                                       //
  (0, _inherits3.default)(Round, _React$Component);                                                             //
                                                                                                                //
  function Round() {                                                                                            //
    (0, _classCallCheck3.default)(this, Round);                                                                 //
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));             //
  }                                                                                                             //
                                                                                                                //
  Round.prototype.render = function () {                                                                        //
    function render() {                                                                                         //
      var allRounds = game.rounds;                                                                              // 9
      var currentRound = allRounds[game.currentRoundId];                                                        // 10
      return React.createElement(                                                                               // 12
        "div",                                                                                                  // 13
        {                                                                                                       // 13
          className: "round"                                                                                    // 13
        },                                                                                                      // 13
        React.createElement(PlayerProfile, {                                                                    // 17
          currentPlayer: currentPlayer                                                                          // 17
        }),                                                                                                     // 17
        React.createElement(Task, {                                                                             // 20
          task: currentRound.data.task,                                                                         // 20
          stage: currentRound.currentStage                                                                      // 20
        })                                                                                                      // 20
      );                                                                                                        // 13
    }                                                                                                           // 23
                                                                                                                //
    return render;                                                                                              //
  }();                                                                                                          //
                                                                                                                //
  return Round;                                                                                                 //
}(React.Component);                                                                                             //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"client":{"main.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// client/main.js                                                                                               //
//                                                                                                              //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                //
module.watch(require("/imports/startup/both"));                                                                 // 1
module.watch(require("/imports/startup/client"));                                                               // 1
var render = void 0;                                                                                            // 1
module.watch(require("react-dom"), {                                                                            // 1
  render: function (v) {                                                                                        // 1
    render = v;                                                                                                 // 1
  }                                                                                                             // 1
}, 0);                                                                                                          // 1
var renderRoutes = void 0;                                                                                      // 1
module.watch(require("../imports/startup/client/routes"), {                                                     // 1
  renderRoutes: function (v) {                                                                                  // 1
    renderRoutes = v;                                                                                           // 1
  }                                                                                                             // 1
}, 1);                                                                                                          // 1
Meteor.startup(function () {                                                                                    // 9
  render(renderRoutes(), document.getElementById("app"));                                                       // 10
});                                                                                                             // 11
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".html",
    ".jsx",
    ".less",
    ".css"
  ]
});
require("./client/main.js");