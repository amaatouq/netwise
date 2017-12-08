var require = meteorInstall({"imports":{"startup":{"both":{"index.js":function(){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// imports/startup/both/index.js                                                    //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
// Import modules used by both client and server through a single index entry point
// e.g. useraccounts configuration file.
//////////////////////////////////////////////////////////////////////////////////////

}},"server":{"index.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// imports/startup/server/index.js                                                  //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
module.watch(require("./register-api.js"));
//////////////////////////////////////////////////////////////////////////////////////

},"register-api.js":function(){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// imports/startup/server/register-api.js                                           //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
// Register your apis here
// import '../../api/links/methods.js';
// import '../../api/links/server/publications.js';
//////////////////////////////////////////////////////////////////////////////////////

}}}},"server":{"main.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////
//                                                                                  //
// server/main.js                                                                   //
//                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////
                                                                                    //
module.watch(require("/imports/startup/server"));
module.watch(require("/imports/startup/both"));
//////////////////////////////////////////////////////////////////////////////////////

}}},{
  "extensions": [
    ".js",
    ".json",
    ".jsx"
  ]
});
require("./server/main.js");
//# sourceURL=meteor://💻app/app/app.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvaW1wb3J0cy9zdGFydHVwL2JvdGgvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvaW5kZXguanMiLCJtZXRlb3I6Ly/wn5K7YXBwL2ltcG9ydHMvc3RhcnR1cC9zZXJ2ZXIvcmVnaXN0ZXItYXBpLmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9zZXJ2ZXIvbWFpbi5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJ3YXRjaCIsInJlcXVpcmUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUE7QUFDQSx3Qzs7Ozs7Ozs7Ozs7QUNEQUEsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLG1CQUFSLENBQWIsRTs7Ozs7Ozs7Ozs7QUNBQTtBQUVBO0FBQ0EsbUQ7Ozs7Ozs7Ozs7O0FDSEFGLE9BQU9DLEtBQVAsQ0FBYUMsUUFBUSx5QkFBUixDQUFiO0FBQWlERixPQUFPQyxLQUFQLENBQWFDLFFBQVEsdUJBQVIsQ0FBYixFIiwiZmlsZSI6Ii9hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBJbXBvcnQgbW9kdWxlcyB1c2VkIGJ5IGJvdGggY2xpZW50IGFuZCBzZXJ2ZXIgdGhyb3VnaCBhIHNpbmdsZSBpbmRleCBlbnRyeSBwb2ludFxuLy8gZS5nLiB1c2VyYWNjb3VudHMgY29uZmlndXJhdGlvbiBmaWxlLlxuIiwiLy8gSW1wb3J0IHNlcnZlciBzdGFydHVwIHRocm91Z2ggYSBzaW5nbGUgaW5kZXggZW50cnkgcG9pbnRcblxuLy8gaW1wb3J0ICcuL2ZpeHR1cmVzLmpzJztcbmltcG9ydCBcIi4vcmVnaXN0ZXItYXBpLmpzXCI7XG4iLCIvLyBSZWdpc3RlciB5b3VyIGFwaXMgaGVyZVxuXG4vLyBpbXBvcnQgJy4uLy4uL2FwaS9saW5rcy9tZXRob2RzLmpzJztcbi8vIGltcG9ydCAnLi4vLi4vYXBpL2xpbmtzL3NlcnZlci9wdWJsaWNhdGlvbnMuanMnO1xuIiwiLy8gU2VydmVyIGVudHJ5IHBvaW50LCBpbXBvcnRzIGFsbCBzZXJ2ZXIgY29kZVxuXG5pbXBvcnQgXCIvaW1wb3J0cy9zdGFydHVwL3NlcnZlclwiO1xuaW1wb3J0IFwiL2ltcG9ydHMvc3RhcnR1cC9ib3RoXCI7XG4iXX0=
