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
        React.createElement(                                                                                    // 18
          "div",                                                                                                // 18
          {                                                                                                     // 18
            className: "profile-score"                                                                          // 18
          },                                                                                                    // 18
          React.createElement(                                                                                  // 19
            "h4",                                                                                               // 19
            null,                                                                                               // 19
            "Total score"                                                                                       // 19
          ),                                                                                                    // 19
          React.createElement(                                                                                  // 20
            "span",                                                                                             // 20
            null,                                                                                               // 20
            currentPlayer.data.score                                                                            // 20
          )                                                                                                     // 20
        )                                                                                                       // 18
      );                                                                                                        // 9
    }                                                                                                           // 24
                                                                                                                //
    return render;                                                                                              //
  }();                                                                                                          //
                                                                                                                //
  return PlayerProfile;                                                                                         //
}(React.Component);                                                                                             //
                                                                                                                //
PlayerProfile.propTypes = {                                                                                     // 27
  // Current player with all the attribute about the player:                                                    // 28
  //Things include: Avatar, Score, Bonus, Gender Team membership (Whether came from Mturk or Crowdflower)       // 29
  currentPlayer: PropTypes.object.isRequired                                                                    // 30
};                                                                                                              // 27
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
var TaskResponse = void 0;                                                                                      // 1
module.watch(require("./TaskResponse"), {                                                                       // 1
  "default": function (v) {                                                                                     // 1
    TaskResponse = v;                                                                                           // 1
  }                                                                                                             // 1
}, 3);                                                                                                          // 1
var TaskFeedback = void 0;                                                                                      // 1
module.watch(require("./TaskFeedback"), {                                                                       // 1
  "default": function (v) {                                                                                     // 1
    TaskFeedback = v;                                                                                           // 1
  }                                                                                                             // 1
}, 4);                                                                                                          // 1
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
      var taskData = this.props.task.data;                                                                      // 9
      var taskPath = taskData.difficultyPath[this.props.currentPlayer.data.difficulty]; //get user specific task difficulty
                                                                                                                //
      var stage = this.props.stage;                                                                             // 11
      console.log('currentPlayer.difficulty', this.props.currentPlayer.data.difficulty);                        // 12
      console.log("task from inside task", taskData);                                                           // 13
      console.log("stage from inside task", stage);                                                             // 14
      return React.createElement(                                                                               // 16
        "div",                                                                                                  // 17
        {                                                                                                       // 17
          className: "task"                                                                                     // 17
        },                                                                                                      // 17
        React.createElement(TaskStimulus, {                                                                     // 18
          taskParam: taskPath                                                                                   // 18
        }),                                                                                                     // 18
        stage !== "outcome" ? React.createElement(TaskResponse, null) : React.createElement(TaskFeedback, null)
      );                                                                                                        // 17
    }                                                                                                           // 22
                                                                                                                //
    return render;                                                                                              //
  }();                                                                                                          //
                                                                                                                //
  return Task;                                                                                                  //
}(React.Component);                                                                                             //
                                                                                                                //
Task.propTypes = {                                                                                              // 25
  // Current round index                                                                                        // 26
  task: PropTypes.object.isRequired,                                                                            // 27
  stage: PropTypes.string.isRequired,                                                                           // 28
  currentPlayer: PropTypes.object.isRequired                                                                    // 29
};                                                                                                              // 25
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"TaskFeedback.jsx":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// imports/ui/components/TaskFeedback.jsx                                                                       //
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
    function render() {}                                                                                        //
                                                                                                                //
    return render;                                                                                              //
  }();                                                                                                          //
                                                                                                                //
  return Task;                                                                                                  //
}(React.Component);                                                                                             //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"TaskResponse.jsx":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                              //
// imports/ui/components/TaskResponse.jsx                                                                       //
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
    return TaskResponse;                                                                                        // 1
  }                                                                                                             // 1
});                                                                                                             // 1
var React = void 0;                                                                                             // 1
module.watch(require("react"), {                                                                                // 1
  "default": function (v) {                                                                                     // 1
    React = v;                                                                                                  // 1
  }                                                                                                             // 1
}, 0);                                                                                                          // 1
var Slider = void 0;                                                                                            // 1
module.watch(require("react-rangeslider"), {                                                                    // 1
  "default": function (v) {                                                                                     // 1
    Slider = v;                                                                                                 // 1
  }                                                                                                             // 1
}, 1);                                                                                                          // 1
                                                                                                                //
var TaskResponse = function (_React$Component) {                                                                //
  (0, _inherits3.default)(TaskResponse, _React$Component);                                                      //
                                                                                                                //
  function TaskResponse(props, context) {                                                                       // 5
    (0, _classCallCheck3.default)(this, TaskResponse);                                                          // 5
                                                                                                                //
    var _this = (0, _possibleConstructorReturn3.default)(this, _React$Component.call(this, props, context));    // 5
                                                                                                                //
    _this.handleChangeStart = function () {                                                                     // 5
      console.log('Change event started');                                                                      // 13
    };                                                                                                          // 14
                                                                                                                //
    _this.handleChange = function (value) {                                                                     // 5
      _this.setState({                                                                                          // 17
        value: value                                                                                            // 18
      });                                                                                                       // 17
    };                                                                                                          // 20
                                                                                                                //
    _this.handleChangeComplete = function () {                                                                  // 5
      console.log('Change event completed'); //here log the data to the database                                // 23
    };                                                                                                          // 25
                                                                                                                //
    _this.state = {                                                                                             // 7
      value: 50                                                                                                 // 8
    };                                                                                                          // 7
    return _this;                                                                                               // 5
  }                                                                                                             // 10
                                                                                                                //
  TaskResponse.prototype.render = function () {                                                                 //
    function render() {                                                                                         //
      var value = this.state.value;                                                                             // 27
      return React.createElement(                                                                               // 29
        "div",                                                                                                  // 30
        {                                                                                                       // 30
          className: "slider"                                                                                   // 30
        },                                                                                                      // 30
        React.createElement(Slider, {                                                                           // 31
          min: 0,                                                                                               // 32
          max: 100,                                                                                             // 33
          value: value,                                                                                         // 34
          onChangeStart: this.handleChangeStart,                                                                // 35
          onChange: this.handleChange,                                                                          // 36
          onChangeComplete: this.handleChangeComplete                                                           // 37
        }),                                                                                                     // 31
        React.createElement(                                                                                    // 39
          "div",                                                                                                // 39
          {                                                                                                     // 39
            className: "value"                                                                                  // 39
          },                                                                                                    // 39
          value                                                                                                 // 39
        )                                                                                                       // 39
      );                                                                                                        // 30
    }                                                                                                           // 42
                                                                                                                //
    return render;                                                                                              //
  }();                                                                                                          //
                                                                                                                //
  return TaskResponse;                                                                                          //
}(React.Component);                                                                                             //
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
      console.log('inside stim', this.props);                                                                   // 6
      return React.createElement(                                                                               // 7
        "div",                                                                                                  // 8
        null,                                                                                                   // 8
        React.createElement("img", {                                                                            // 9
          src: this.props.taskParam,                                                                            // 9
          className: "task-image"                                                                               // 9
        })                                                                                                      // 9
      );                                                                                                        // 8
    }                                                                                                           // 12
                                                                                                                //
    return render;                                                                                              //
  }();                                                                                                          //
                                                                                                                //
  return TaskStimulus;                                                                                          //
}(React.Component);                                                                                             //
                                                                                                                //
TaskStimulus.propTypes = {                                                                                      // 15
  task: PropTypes.object                                                                                        // 16
};                                                                                                              // 15
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
var Tasks = _.shuffle([{                                                                                        // 15
  _id: "1",                                                                                                     // 17
  data: {                                                                                                       // 18
    correctAnswer: 0.1,                                                                                         // 19
    difficultyPath: {                                                                                           // 20
      easy: "/tasks/1.png",                                                                                     // 20
      hard: "/tasks/2.png"                                                                                      // 20
    }                                                                                                           // 20
  }                                                                                                             // 18
}, {                                                                                                            // 16
  _id: "2",                                                                                                     // 25
  data: {                                                                                                       // 26
    correctAnswer: 0.5,                                                                                         // 27
    difficultyPath: {                                                                                           // 28
      easy: "/tasks/3.png",                                                                                     // 28
      hard: "/tasks/4.png"                                                                                      // 28
    }                                                                                                           // 28
  }                                                                                                             // 26
}, {                                                                                                            // 24
  _id: "3",                                                                                                     // 33
  data: {                                                                                                       // 34
    correctAnswer: 1.0,                                                                                         // 35
    difficultyPath: {                                                                                           // 36
      easy: "/tasks/5.png",                                                                                     // 36
      hard: "/tasks/6.png"                                                                                      // 36
    }                                                                                                           // 36
  }                                                                                                             // 34
}]); /*                                                                                                         // 32
     Creating dummy players data: this will be provided to us by netwise                                        //
     */ //create empty list of players                                                                          //
                                                                                                                //
                                                                                                                //
var nPlayers = 3;                                                                                               // 45
var players = []; //fill the list with random players information                                               // 46
                                                                                                                //
_.times(nPlayers, function (i) {                                                                                // 48
  players.push({                                                                                                // 49
    _id: Random.id(),                                                                                           // 50
    createdAt: new Date(),                                                                                      // 51
    alters: null,                                                                                               // 52
    data: {                                                                                                     // 53
      avatar: avatars[i],                                                                                       // 54
      score: _.random(0, 123),                                                                                  // 55
      difficulty: Random.choice(['easy', 'hard'])                                                               // 56
    }                                                                                                           // 53
  });                                                                                                           // 49
}); //add alters                                                                                                // 59
//todo: we need to think of the network structure. What if it changes every round? how can we keep a history of the entire networks etc.
                                                                                                                //
                                                                                                                //
var maxOutDegree = 2; //maximum number of out going degree (i.e., how many 'alters' the 'ego' is connected to   // 62
                                                                                                                //
players.forEach(function (player) {                                                                             // 63
  player.alters = Array.from(new Set(_.sample(removeElement(players, player), maxOutDegree)));                  // 64
}); //select one players at random to be the currentPlayer                                                      // 67
                                                                                                                //
var currentPlayer = Random.choice(players);                                                                     // 69
/*                                                                                                              // 71
Creating dummy round data: this will be created at the initiation of the game                                   //
TODO: this round structure I do not like. The main unit of analysis is the user per round  for example:         //
    Players might have a different task for the same round                                                      //
    We want to know the answer for each player per round                                                        //
    We want to know the alters for each player per round                                                        //
    What about if different player types (dictator, recipient) have different number of stages?                 //
    Therefore: we need better PlayerRound data structure                                                        //
    For now: I'll just assume that the Rounds object is for the current player (filtered)                       //
*/var nRounds = 3; //the number of rounds in this game                                                          //
//stages per round                                                                                              // 82
                                                                                                                //
var stages = ["initial", "interactive", "outcome"]; //const currentStage = Random.choice(stages);//random stage
                                                                                                                //
var currentStage = stages[0];                                                                                   // 85
var rounds = [];                                                                                                // 86
                                                                                                                //
_.times(nRounds, function (i) {                                                                                 // 87
  rounds.push({                                                                                                 // 88
    _id: i,                                                                                                     // 89
    createdAt: new Date(),                                                                                      // 90
    stages: stages,                                                                                             // 91
    currentStage: currentStage,                                                                                 // 92
    task: Tasks[i],                                                                                             // 93
    data: {}                                                                                                    // 94
  });                                                                                                           // 88
}); //TODO: can treatment be an array to describe factor experimental design?                                   // 96
//Imagine we have two factors: number of players [high, mid, low] and network status [static,dynamic]           // 99
//Then we will have 6 treatments: [high,static], [high, dynamic], [mid,static],[mid,dynamic],[low,static],[low,dynamic]
//notice that the choice of high/low effects the recruitment of participants (number of players)                // 101
//However static/dynamic effects the stage 'round outcome'                                                      // 102
//It makes sense that in the round outcome I just have to check static/dynamic without checking                 // 103
//whether the number of players is high/low .. also, at recruitment, I should be able to specify the number of people I want, regardless of static/dynamic
                                                                                                                //
                                                                                                                //
var game = {                                                                                                    // 105
  _id: Random.id(),                                                                                             // 106
  treatments: [],                                                                                               // 107
  players: players,                                                                                             // 108
  rounds: rounds,                                                                                               // 109
  currentRoundId: _.random(0, nRounds - 1)                                                                      // 110
};                                                                                                              // 105
                                                                                                                //
//Helper functions to create the dummy data                                                                     // 113
//function to remove element from an array in an non-mutable way                                                // 114
function removeElement(array, element) {                                                                        // 115
  return array.filter(function (e) {                                                                            // 116
    return e !== element;                                                                                       // 116
  });                                                                                                           // 116
}                                                                                                               // 117
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
        React.createElement(Task, {                                                                             // 19
          task: currentRound.task,                                                                              // 20
          stage: currentRound.currentStage,                                                                     // 21
          currentPlayer: currentPlayer                                                                          // 22
        })                                                                                                      // 19
      );                                                                                                        // 13
    }                                                                                                           // 27
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