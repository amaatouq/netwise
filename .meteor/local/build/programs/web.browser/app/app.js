var require = meteorInstall({"imports":{"startup":{"both":{"index.js":function(){

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
var Home = void 0;                                                                                  // 1
module.watch(require("../../ui/pages/Home"), {                                                      // 1
  "default": function (v) {                                                                         // 1
    Home = v;                                                                                       // 1
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
    React.createElement(Route, {                                                                    // 10
      path: "/",                                                                                    // 10
      component: Home                                                                               // 10
    })                                                                                              // 10
  );                                                                                                // 9
};                                                                                                  // 8
//////////////////////////////////////////////////////////////////////////////////////////////////////

}}},"ui":{"pages":{"Home.jsx":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// imports/ui/pages/Home.jsx                                                                        //
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
    return Home;                                                                                    // 1
  }                                                                                                 // 1
});                                                                                                 // 1
var React = void 0;                                                                                 // 1
module.watch(require("react"), {                                                                    // 1
  "default": function (v) {                                                                         // 1
    React = v;                                                                                      // 1
  }                                                                                                 // 1
}, 0);                                                                                              // 1
                                                                                                    //
var Home = function (_React$Component) {                                                            //
  (0, _inherits3.default)(Home, _React$Component);                                                  //
                                                                                                    //
  function Home() {                                                                                 //
    (0, _classCallCheck3.default)(this, Home);                                                      //
    return (0, _possibleConstructorReturn3.default)(this, _React$Component.apply(this, arguments));
  }                                                                                                 //
                                                                                                    //
  Home.prototype.render = function () {                                                             //
    function render() {                                                                             //
      return React.createElement(                                                                   // 5
        "h1",                                                                                       // 5
        null,                                                                                       // 5
        " Hello World "                                                                             // 5
      );                                                                                            // 5
    }                                                                                               // 6
                                                                                                    //
    return render;                                                                                  //
  }();                                                                                              //
                                                                                                    //
  return Home;                                                                                      //
}(React.Component);                                                                                 //
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
  render(renderRoutes(), document.getElementById('netwise-app'));                                   // 10
});                                                                                                 // 11
//////////////////////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".html",
    ".jsx",
    ".less"
  ]
});
require("./client/main.js");