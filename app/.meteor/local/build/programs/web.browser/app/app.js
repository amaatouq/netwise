var require = meteorInstall({"imports":{"ui":{"games":{"task":{"Context.jsx":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// imports/ui/games/task/Context.jsx                                                                //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                             //
                                                                                                    //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                    //
                                                                                                    //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");       //
                                                                                                    //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);              //
                                                                                                    //
var _inherits2 = require("babel-runtime/helpers/inherits");                                         //
                                                                                                    //
var _inherits3 = _interopRequireDefault(_inherits2);                                                //
                                                                                                    //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }   //
                                                                                                    //
module.export({                                                                                     // 1
  "default": function () {                                                                          // 1
    return Context;                                                                                 // 1
  }                                                                                                 // 1
});                                                                                                 // 1
var PropTypes = void 0;                                                                             // 1
module.watch(require("prop-types"), {                                                               // 1
  "default": function (v) {                                                                         // 1
    PropTypes = v;                                                                                  // 1
  }                                                                                                 // 1
}, 0);                                                                                              // 1
var React = void 0;                                                                                 // 1
module.watch(require("react"), {                                                                    // 1
  "default": function (v) {                                                                         // 1
    React = v;                                                                                      // 1
  }                                                                                                 // 1
}, 1);                                                                                              // 1
                                                                                                    //
var stringToColour = function (str) {                                                               // 4
  var hash = 0;                                                                                     // 5
                                                                                                    //
  for (var i = 0; i < str.length; i++) {                                                            // 6
    hash = str.charCodeAt(i) + ((hash << 5) - hash);                                                // 7
  }                                                                                                 // 8
                                                                                                    //
  var colour = "#";                                                                                 // 9
                                                                                                    //
  for (var i = 0; i < 3; i++) {                                                                     // 10
    var value = hash >> i * 8 & 0xff;                                                               // 11
    colour += ("00" + value.toString(16)).substr(-2);                                               // 12
  }                                                                                                 // 13
                                                                                                    //
  return colour;                                                                                    // 14
};                                                                                                  // 15
                                                                                                    //
var Context = function (_React$Component) {                                                         //
  (0, _inherits3.default)(Context, _React$Component);                                               //
                                                                                                    //
  function Context() {                                                                              //
    (0, _classCallCheck3.default)(this, Context);                                                   //
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }                                                                                                 //
                                                                                                    //
  Context.prototype.render = function () {                                                          //
    function render() {                                                                             //
      var _props = this.props,                                                                      // 18
          score = _props.score,                                                                     // 18
          currentPlayerID = _props.currentPlayerID;                                                 // 18
      return React.createElement(                                                                   // 21
        "aside",                                                                                    // 22
        {                                                                                           // 22
          className: "context"                                                                      // 22
        },                                                                                          // 22
        React.createElement(                                                                        // 23
          "h3",                                                                                     // 23
          null,                                                                                     // 23
          "You Profile"                                                                             // 23
        ),                                                                                          // 23
        currentPlayerID ? React.createElement("div", {                                              // 25
          className: "player-icon",                                                                 // 27
          style: {                                                                                  // 28
            backgroundColor: stringToColour(currentPlayerID)                                        // 28
          }                                                                                         // 28
        }) : "",                                                                                    // 26
        score || score === 0 ? React.createElement(                                                 // 34
          "div",                                                                                    // 35
          {                                                                                         // 35
            className: "score"                                                                      // 35
          },                                                                                        // 35
          React.createElement(                                                                      // 36
            "h4",                                                                                   // 36
            null,                                                                                   // 36
            "Total score"                                                                           // 36
          ),                                                                                        // 36
          React.createElement(                                                                      // 37
            "span",                                                                                 // 37
            null,                                                                                   // 37
            score                                                                                   // 37
          )                                                                                         // 37
        ) : ""                                                                                      // 35
      );                                                                                            // 22
    }                                                                                               // 46
                                                                                                    //
    return render;                                                                                  //
  }();                                                                                              //
                                                                                                    //
  return Context;                                                                                   //
}(React.Component);                                                                                 //
                                                                                                    //
Context.propTypes = {                                                                               // 49
  // Current player's identifier (used to display a user profile icon)                              // 50
  currentPlayerID: PropTypes.string,                                                                // 51
  // Current player's score                                                                         // 53
  score: PropTypes.number,                                                                          // 54
  // Remaining time to complete task in seconds                                                     // 56
  remainingTime: PropTypes.number                                                                   // 57
};                                                                                                  // 49
//////////////////////////////////////////////////////////////////////////////////////////////////////

},"GameTemp.jsx":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// imports/ui/games/task/GameTemp.jsx                                                               //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                             //
                                                                                                    //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                    //
                                                                                                    //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");       //
                                                                                                    //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);              //
                                                                                                    //
var _inherits2 = require("babel-runtime/helpers/inherits");                                         //
                                                                                                    //
var _inherits3 = _interopRequireDefault(_inherits2);                                                //
                                                                                                    //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }   //
                                                                                                    //
module.export({                                                                                     // 1
  "default": function () {                                                                          // 1
    return GameTemp;                                                                                // 1
  }                                                                                                 // 1
});                                                                                                 // 1
var PropTypes = void 0;                                                                             // 1
module.watch(require("prop-types"), {                                                               // 1
  "default": function (v) {                                                                         // 1
    PropTypes = v;                                                                                  // 1
  }                                                                                                 // 1
}, 0);                                                                                              // 1
var React = void 0;                                                                                 // 1
module.watch(require("react"), {                                                                    // 1
  "default": function (v) {                                                                         // 1
    React = v;                                                                                      // 1
  }                                                                                                 // 1
}, 1);                                                                                              // 1
var Random = void 0;                                                                                // 1
module.watch(require("meteor/random"), {                                                            // 1
  Random: function (v) {                                                                            // 1
    Random = v;                                                                                     // 1
  }                                                                                                 // 1
}, 2);                                                                                              // 1
var stages = void 0;                                                                                // 1
module.watch(require("./game"), {                                                                   // 1
  stages: function (v) {                                                                            // 1
    stages = v;                                                                                     // 1
  }                                                                                                 // 1
}, 3);                                                                                              // 1
var Round = void 0;                                                                                 // 1
module.watch(require("./Round"), {                                                                  // 1
  "default": function (v) {                                                                         // 1
    Round = v;                                                                                      // 1
  }                                                                                                 // 1
}, 4);                                                                                              // 1
                                                                                                    //
var GameTemp = function (_React$Component) {                                                        //
  (0, _inherits3.default)(GameTemp, _React$Component);                                              //
                                                                                                    //
  function GameTemp() {                                                                             //
    (0, _classCallCheck3.default)(this, GameTemp);                                                  //
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }                                                                                                 //
                                                                                                    //
  GameTemp.prototype.render = function () {                                                         //
    function render() {                                                                             //
      return React.createElement(                                                                   // 11
        "div",                                                                                      // 12
        {                                                                                           // 12
          className: "game game-temp"                                                               // 12
        },                                                                                          // 12
        React.createElement(Round, {                                                                // 13
          stage: Random.choice(stages),                                                             // 14
          round: _.random(0, 9),                                                                    // 15
          score: _.random(0, 123),                                                                  // 16
          currentPlayer: {                                                                          // 17
            id: Random.id()                                                                         // 17
          }                                                                                         // 17
        })                                                                                          // 13
      );                                                                                            // 12
    }                                                                                               // 21
                                                                                                    //
    return render;                                                                                  //
  }();                                                                                              //
                                                                                                    //
  return GameTemp;                                                                                  //
}(React.Component);                                                                                 //
                                                                                                    //
GameTemp.propTypes = {                                                                              // 24
  // This is not how we're doing it yet. For now, we just do thing statically,                      // 25
  // but later the Round gets built dynamically by Netwise and is passed into                       // 26
  // the root game Component (GameTemp here) for the oppertunity to set                             // 27
  // overall game UI (progress, CSS namespacing, etc.)                                              // 28
  round: PropTypes.element                                                                          // 29
};                                                                                                  // 24
//////////////////////////////////////////////////////////////////////////////////////////////////////

},"Round.jsx":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// imports/ui/games/task/Round.jsx                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                             //
                                                                                                    //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                    //
                                                                                                    //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");       //
                                                                                                    //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);              //
                                                                                                    //
var _inherits2 = require("babel-runtime/helpers/inherits");                                         //
                                                                                                    //
var _inherits3 = _interopRequireDefault(_inherits2);                                                //
                                                                                                    //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }   //
                                                                                                    //
module.export({                                                                                     // 1
  "default": function () {                                                                          // 1
    return Round;                                                                                   // 1
  }                                                                                                 // 1
});                                                                                                 // 1
var PropTypes = void 0;                                                                             // 1
module.watch(require("prop-types"), {                                                               // 1
  "default": function (v) {                                                                         // 1
    PropTypes = v;                                                                                  // 1
  }                                                                                                 // 1
}, 0);                                                                                              // 1
var React = void 0;                                                                                 // 1
module.watch(require("react"), {                                                                    // 1
  "default": function (v) {                                                                         // 1
    React = v;                                                                                      // 1
  }                                                                                                 // 1
}, 1);                                                                                              // 1
var stages = void 0;                                                                                // 1
module.watch(require("./game"), {                                                                   // 1
  stages: function (v) {                                                                            // 1
    stages = v;                                                                                     // 1
  }                                                                                                 // 1
}, 2);                                                                                              // 1
var Context = void 0;                                                                               // 1
module.watch(require("./Context"), {                                                                // 1
  "default": function (v) {                                                                         // 1
    Context = v;                                                                                    // 1
  }                                                                                                 // 1
}, 3);                                                                                              // 1
var Social = void 0;                                                                                // 1
module.watch(require("./Social"), {                                                                 // 1
  "default": function (v) {                                                                         // 1
    Social = v;                                                                                     // 1
  }                                                                                                 // 1
}, 4);                                                                                              // 1
var Task = void 0;                                                                                  // 1
module.watch(require("./Task"), {                                                                   // 1
  "default": function (v) {                                                                         // 1
    Task = v;                                                                                       // 1
  }                                                                                                 // 1
}, 5);                                                                                              // 1
                                                                                                    //
var Round = function (_React$Component) {                                                           //
  (0, _inherits3.default)(Round, _React$Component);                                                 //
                                                                                                    //
  function Round() {                                                                                //
    (0, _classCallCheck3.default)(this, Round);                                                     //
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }                                                                                                 //
                                                                                                    //
  Round.prototype.render = function () {                                                            //
    function render() {                                                                             //
      var _props = this.props,                                                                      // 10
          round = _props.round,                                                                     // 10
          stage = _props.stage,                                                                     // 10
          score = _props.score,                                                                     // 10
          currentPlayer = _props.currentPlayer,                                                     // 10
          remainingTime = _props.remainingTime;                                                     // 10
      return React.createElement(                                                                   // 12
        "div",                                                                                      // 13
        {                                                                                           // 13
          className: "round round-plot"                                                             // 13
        },                                                                                          // 13
        React.createElement(Context, {                                                              // 14
          currentPlayerID: currentPlayer.id,                                                        // 15
          score: score,                                                                             // 16
          remainingTime: remainingTime                                                              // 17
        }),                                                                                         // 14
        React.createElement(Task, {                                                                 // 19
          round: round,                                                                             // 19
          stage: stage                                                                              // 19
        }),                                                                                         // 19
        stage === "social" ? React.createElement(Social, {                                          // 20
          round: round                                                                              // 20
        }) : ""                                                                                     // 20
      );                                                                                            // 13
    }                                                                                               // 23
                                                                                                    //
    return render;                                                                                  //
  }();                                                                                              //
                                                                                                    //
  return Round;                                                                                     //
}(React.Component);                                                                                 //
                                                                                                    //
Round.propTypes = {                                                                                 // 26
  // Current round index                                                                            // 27
  round: PropTypes.number.isRequired,                                                               // 28
  // Current stage                                                                                  // 30
  stage: PropTypes.oneOf(stages).isRequired,                                                        // 31
  // Current player                                                                                 // 33
  currentPlayer: PropTypes.shape({                                                                  // 34
    id: PropTypes.string.isRequired                                                                 // 35
  }).isRequired,                                                                                    // 34
  // Current player's score                                                                         // 38
  score: PropTypes.number.isRequired,                                                               // 39
  // Remaining time to complete task in seconds                                                     // 41
  remainingTime: PropTypes.number,                                                                  // 42
  // Other player participating in this game                                                        // 44
  otherPlayers: PropTypes.arrayOf(PropTypes.shape({                                                 // 45
    id: PropTypes.string.isRequired                                                                 // 47
  }))                                                                                               // 46
};                                                                                                  // 26
//////////////////////////////////////////////////////////////////////////////////////////////////////

},"Social.jsx":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// imports/ui/games/task/Social.jsx                                                                 //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                             //
                                                                                                    //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                    //
                                                                                                    //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");       //
                                                                                                    //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);              //
                                                                                                    //
var _inherits2 = require("babel-runtime/helpers/inherits");                                         //
                                                                                                    //
var _inherits3 = _interopRequireDefault(_inherits2);                                                //
                                                                                                    //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }   //
                                                                                                    //
module.export({                                                                                     // 1
  "default": function () {                                                                          // 1
    return Social;                                                                                  // 1
  }                                                                                                 // 1
});                                                                                                 // 1
var PropTypes = void 0;                                                                             // 1
module.watch(require("prop-types"), {                                                               // 1
  "default": function (v) {                                                                         // 1
    PropTypes = v;                                                                                  // 1
  }                                                                                                 // 1
}, 0);                                                                                              // 1
var React = void 0;                                                                                 // 1
module.watch(require("react"), {                                                                    // 1
  "default": function (v) {                                                                         // 1
    React = v;                                                                                      // 1
  }                                                                                                 // 1
}, 1);                                                                                              // 1
                                                                                                    //
var Social = function (_React$Component) {                                                          //
  (0, _inherits3.default)(Social, _React$Component);                                                //
                                                                                                    //
  function Social() {                                                                               //
    (0, _classCallCheck3.default)(this, Social);                                                    //
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }                                                                                                 //
                                                                                                    //
  Social.prototype.render = function () {                                                           //
    function render() {                                                                             //
      var round = this.props.round;                                                                 // 5
      return React.createElement(                                                                   // 7
        "div",                                                                                      // 7
        {                                                                                           // 7
          className: "social"                                                                       // 7
        },                                                                                          // 7
        "Social at round ",                                                                         // 7
        round                                                                                       // 7
      );                                                                                            // 7
    }                                                                                               // 8
                                                                                                    //
    return render;                                                                                  //
  }();                                                                                              //
                                                                                                    //
  return Social;                                                                                    //
}(React.Component);                                                                                 //
                                                                                                    //
Social.propTypes = {                                                                                // 11
  // Current round index                                                                            // 12
  round: PropTypes.number.isRequired                                                                // 13
};                                                                                                  // 11
//////////////////////////////////////////////////////////////////////////////////////////////////////

},"Task.jsx":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// imports/ui/games/task/Task.jsx                                                                   //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
var _classCallCheck2 = require("babel-runtime/helpers/classCallCheck");                             //
                                                                                                    //
var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);                                    //
                                                                                                    //
var _possibleConstructorReturn2 = require("babel-runtime/helpers/possibleConstructorReturn");       //
                                                                                                    //
var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);              //
                                                                                                    //
var _inherits2 = require("babel-runtime/helpers/inherits");                                         //
                                                                                                    //
var _inherits3 = _interopRequireDefault(_inherits2);                                                //
                                                                                                    //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }   //
                                                                                                    //
module.export({                                                                                     // 1
  "default": function () {                                                                          // 1
    return Task;                                                                                    // 1
  }                                                                                                 // 1
});                                                                                                 // 1
var PropTypes = void 0;                                                                             // 1
module.watch(require("prop-types"), {                                                               // 1
  "default": function (v) {                                                                         // 1
    PropTypes = v;                                                                                  // 1
  }                                                                                                 // 1
}, 0);                                                                                              // 1
var React = void 0;                                                                                 // 1
module.watch(require("react"), {                                                                    // 1
  "default": function (v) {                                                                         // 1
    React = v;                                                                                      // 1
  }                                                                                                 // 1
}, 1);                                                                                              // 1
var stages = void 0;                                                                                // 1
module.watch(require("./game"), {                                                                   // 1
  stages: function (v) {                                                                            // 1
    stages = v;                                                                                     // 1
  }                                                                                                 // 1
}, 2);                                                                                              // 1
                                                                                                    //
var Task = function (_React$Component) {                                                            //
  (0, _inherits3.default)(Task, _React$Component);                                                  //
                                                                                                    //
  function Task() {                                                                                 //
    (0, _classCallCheck3.default)(this, Task);                                                      //
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }                                                                                                 //
                                                                                                    //
  Task.prototype.render = function () {                                                             //
    function render() {                                                                             //
      var _props = this.props,                                                                      // 7
          round = _props.round,                                                                     // 7
          stage = _props.stage; // const plots = gameInstance.get("plots");                         // 7
      // const plot = plots[round];                                                                 // 11
                                                                                                    //
      return React.createElement(                                                                   // 13
        "div",                                                                                      // 14
        {                                                                                           // 14
          className: "task"                                                                         // 14
        },                                                                                          // 14
        "Task for Round ",                                                                          // 14
        round,                                                                                      // 15
        " at stage ",                                                                               // 14
        stage                                                                                       // 15
      );                                                                                            // 14
    }                                                                                               // 18
                                                                                                    //
    return render;                                                                                  //
  }();                                                                                              //
                                                                                                    //
  return Task;                                                                                      //
}(React.Component);                                                                                 //
                                                                                                    //
Task.propTypes = {                                                                                  // 21
  // Current round index                                                                            // 22
  round: PropTypes.number.isRequired,                                                               // 23
  // Current stage                                                                                  // 25
  stage: PropTypes.oneOf(stages).isRequired                                                         // 26
};                                                                                                  // 21
//////////////////////////////////////////////////////////////////////////////////////////////////////

},"game.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// imports/ui/games/task/game.js                                                                    //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
module.export({                                                                                     // 1
  stages: function () {                                                                             // 1
    return stages;                                                                                  // 1
  }                                                                                                 // 1
});                                                                                                 // 1
var initGame = void 0;                                                                              // 1
module.watch(require("./init"), {                                                                   // 1
  initGame: function (v) {                                                                          // 1
    initGame = v;                                                                                   // 1
  }                                                                                                 // 1
}, 0);                                                                                              // 1
var stages = ["response", "interactive", "social"];                                                 // 3
var game = initGame([], "");                                                                        // 5
console.log(game);                                                                                  // 6
//////////////////////////////////////////////////////////////////////////////////////////////////////

},"init.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// imports/ui/games/task/init.js                                                                    //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
var _extends2 = require("babel-runtime/helpers/extends");                                           //
                                                                                                    //
var _extends3 = _interopRequireDefault(_extends2);                                                  //
                                                                                                    //
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }   //
                                                                                                    //
module.export({                                                                                     // 1
  initGame: function () {                                                                           // 1
    return initGame;                                                                                // 1
  },                                                                                                // 1
  computeResponse: function () {                                                                    // 1
    return computeResponse;                                                                         // 1
  }                                                                                                 // 1
});                                                                                                 // 1
var avatars = ["a", "b", "c"];                                                                      // 1
var taskData = [{                                                                                   // 2
  input: 1,                                                                                         // 3
  correctAnswer: 1                                                                                  // 3
}, {                                                                                                // 3
  input: 8,                                                                                         // 4
  correctAnswer: 8                                                                                  // 4
}, {                                                                                                // 4
  input: 2,                                                                                         // 5
  correctAnswer: 2                                                                                  // 5
}];                                                                                                 // 5
var stages = ["initial", "interactive", "roundOutcome"];                                            // 8
                                                                                                    //
var getNeighbors = function (a) {                                                                   // 10
  return a;                                                                                         // 10
}; // initGame should return                                                                        // 10
                                                                                                    //
                                                                                                    //
var initGame = function (players, treatment) {                                                      // 13
  var game = {                                                                                      // 14
    rounds: [],                                                                                     // 14
    players: []                                                                                     // 14
  };                                                                                                // 14
                                                                                                    //
  var taskIndexes = _.shuffle(_.range(0, 3));                                                       // 16
                                                                                                    //
  _.times(3, function (i) {                                                                         // 18
    game.rounds.push({                                                                              // 19
      stages: stages,                                                                               // 20
      data: {                                                                                       // 21
        // This object 100% open, no fields bellow are required                                     // 22
        input: taskData[taskIndexes[i]].input,                                                      // 23
        taskIndex: taskIndexes[i],                                                                  // 24
        randomNumber: 123                                                                           // 25
      }                                                                                             // 21
    });                                                                                             // 19
  });                                                                                               // 28
                                                                                                    //
  players.forEach(function (player) {                                                               // 30
    var neighbors = getNeighbors(player, players, 2);                                               // 31
    game.players.push((0, _extends3.default)({}, player, {                                          // 32
      data: {                                                                                       // 34
        avatar: Random.choice(avatars),                                                             // 35
        neighbors: neighbors                                                                        // 36
      }                                                                                             // 34
    }));                                                                                            // 32
  });                                                                                               // 39
  return game;                                                                                      // 41
};                                                                                                  // 42
                                                                                                    //
var computeResponse = function (game, round, stage, player, responseData) {                         // 45
  if (reponse.stage === "initial" || reponse.stage === "social") {                                  // 46
    return;                                                                                         // 47
  }                                                                                                 // 48
                                                                                                    //
  if (reponse.stage.state === "done") {// update user score                                         // 50
  } else {                                                                                          // 52
    player.set("tempScore", response.value); // update intermediate score var                       // 53
                                                                                                    //
    sum = 0;                                                                                        // 56
    game.players.forEach(function (element) {                                                       // 57
      sum += player.get("tempScore");                                                               // 58
    });                                                                                             // 59
    game.set("tempScore", sum / game.players.length);                                               // 61
  }                                                                                                 // 62
                                                                                                    //
  task = allMyTasks[responseData.value];                                                            // 64
  score = scoreFunction(response.responseData.value, task.correct_answer);                          // 66
  return score;                                                                                     // 68
};                                                                                                  // 69
//////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"startup":{"both":{"index.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// imports/startup/both/index.js                                                                    //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
// Import modules used by both client and server through a single index entry point                 // 1
// e.g. useraccounts configuration file.                                                            // 2
//////////////////////////////////////////////////////////////////////////////////////////////////////

}},"client":{"index.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// imports/startup/client/index.js                                                                  //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
module.watch(require("./routes.js"));                                                               // 1
//////////////////////////////////////////////////////////////////////////////////////////////////////

},"routes.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// imports/startup/client/routes.js                                                                 //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
module.export({                                                                                     // 1
  renderRoutes: function () {                                                                       // 1
    return renderRoutes;                                                                            // 1
  }                                                                                                 // 1
});                                                                                                 // 1
var Route = void 0,                                                                                 // 1
    Router = void 0;                                                                                // 1
module.watch(require("react-router"), {                                                             // 1
  Route: function (v) {                                                                             // 1
    Route = v;                                                                                      // 1
  },                                                                                                // 1
  Router: function (v) {                                                                            // 1
    Router = v;                                                                                     // 1
  }                                                                                                 // 1
}, 0);                                                                                              // 1
var createBrowserHistory = void 0;                                                                  // 1
module.watch(require("history"), {                                                                  // 1
  createBrowserHistory: function (v) {                                                              // 1
    createBrowserHistory = v;                                                                       // 1
  }                                                                                                 // 1
}, 1);                                                                                              // 1
var React = void 0;                                                                                 // 1
module.watch(require("react"), {                                                                    // 1
  "default": function (v) {                                                                         // 1
    React = v;                                                                                      // 1
  }                                                                                                 // 1
}, 2);                                                                                              // 1
var GameTemp = void 0;                                                                              // 1
module.watch(require("../../ui/games/task/GameTemp"), {                                             // 1
  "default": function (v) {                                                                         // 1
    GameTemp = v;                                                                                   // 1
  }                                                                                                 // 1
}, 3);                                                                                              // 1
var browserHistory = createBrowserHistory();                                                        // 7
                                                                                                    //
var renderRoutes = function () {                                                                    // 8
  return React.createElement(                                                                       // 8
    Router,                                                                                         // 9
    {                                                                                               // 9
      history: browserHistory                                                                       // 9
    },                                                                                              // 9
    React.createElement(                                                                            // 10
      "div",                                                                                        // 10
      {                                                                                             // 10
        className: "grid"                                                                           // 10
      },                                                                                            // 10
      React.createElement(                                                                          // 11
        "header",                                                                                   // 11
        null,                                                                                       // 11
        React.createElement(                                                                        // 12
          "h1",                                                                                     // 12
          null,                                                                                     // 12
          "Netwise"                                                                                 // 12
        )                                                                                           // 12
      ),                                                                                            // 11
      React.createElement(                                                                          // 15
        "main",                                                                                     // 15
        null,                                                                                       // 15
        React.createElement(Route, {                                                                // 17
          path: "/",                                                                                // 17
          component: GameTemp                                                                       // 17
        })                                                                                          // 17
      ),                                                                                            // 15
      React.createElement(                                                                          // 20
        "footer",                                                                                   // 20
        null,                                                                                       // 20
        "footer"                                                                                    // 20
      )                                                                                             // 20
    )                                                                                               // 10
  );                                                                                                // 9
};                                                                                                  // 8
//////////////////////////////////////////////////////////////////////////////////////////////////////

}}}},"client":{"main.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// client/main.js                                                                                   //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
module.watch(require("/imports/startup/both"));                                                     // 1
module.watch(require("/imports/startup/client"));                                                   // 1
var render = void 0;                                                                                // 1
module.watch(require("react-dom"), {                                                                // 1
  render: function (v) {                                                                            // 1
    render = v;                                                                                     // 1
  }                                                                                                 // 1
}, 0);                                                                                              // 1
var renderRoutes = void 0;                                                                          // 1
module.watch(require("../imports/startup/client/routes"), {                                         // 1
  renderRoutes: function (v) {                                                                      // 1
    renderRoutes = v;                                                                               // 1
  }                                                                                                 // 1
}, 1);                                                                                              // 1
Meteor.startup(function () {                                                                        // 9
  render(renderRoutes(), document.getElementById("app"));                                           // 10
});                                                                                                 // 11
//////////////////////////////////////////////////////////////////////////////////////////////////////

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