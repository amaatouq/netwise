//////////////////////////////////////////////////////////////////////////
//                                                                      //
// This is a generated file. You can view the original                  //
// source in your browser if your browser supports source maps.         //
// Source maps are supported by all recent versions of Chrome, Safari,  //
// and Firefox, and by Internet Explorer 11.                            //
//                                                                      //
//////////////////////////////////////////////////////////////////////////


(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var meteorInstall = Package.modules.meteorInstall;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var meteorBabelHelpers;

var require = meteorInstall({"node_modules":{"meteor":{"babel-runtime":{"babel-runtime.js":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
// packages/babel-runtime/babel-runtime.js                                         //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
                                                                                   //
exports.meteorBabelHelpers = require("meteor-babel-helpers");                      // 1
                                                                                   // 2
// Returns true if a given absolute identifier will be provided at runtime         // 3
// by the babel-runtime package.                                                   // 4
exports.checkHelper = function checkHelper(id) {                                   // 5
  // There used to be more complicated logic here, when the babel-runtime          // 6
  // package provided helper implementations of its own, but now this              // 7
  // function exists just for backwards compatibility.                             // 8
  return false;                                                                    // 9
};                                                                                 // 10
                                                                                   // 11
try {                                                                              // 12
  var babelRuntimeVersion = require("babel-runtime/package.json").version;         // 13
  var regeneratorRuntime = require("babel-runtime/regenerator");                   // 14
} catch (e) {                                                                      // 15
  throw new Error([                                                                // 16
    "The babel-runtime npm package could not be found in your node_modules ",      // 17
    "directory. Please run the following command to install it:",                  // 18
    "",                                                                            // 19
    "  meteor npm install --save babel-runtime",                                   // 20
    ""                                                                             // 21
  ].join("\n"));                                                                   // 22
}                                                                                  // 23
                                                                                   // 24
if (parseInt(babelRuntimeVersion, 10) < 6) {                                       // 25
  throw new Error([                                                                // 26
    "The version of babel-runtime installed in your node_modules directory ",      // 27
    "(" + babelRuntimeVersion + ") is out of date. Please upgrade it by running ",
    "",                                                                            // 29
    "  meteor npm install --save babel-runtime",                                   // 30
    "",                                                                            // 31
    "in your application directory.",                                              // 32
    ""                                                                             // 33
  ].join("\n"));                                                                   // 34
}                                                                                  // 35
                                                                                   // 36
if (regeneratorRuntime &&                                                          // 37
    typeof Promise === "function" &&                                               // 38
    typeof Promise.asyncApply === "function") {                                    // 39
  // If Promise.asyncApply is defined, use it to wrap calls to                     // 40
  // runtime.async so that the entire async function will run in its own           // 41
  // Fiber, not just the code that comes after the first await.                    // 42
  var realAsync = regeneratorRuntime.async;                                        // 43
  regeneratorRuntime.async = function () {                                         // 44
    return Promise.asyncApply(realAsync, regeneratorRuntime, arguments);           // 45
  };                                                                               // 46
}                                                                                  // 47
                                                                                   // 48
/////////////////////////////////////////////////////////////////////////////////////

},"node_modules":{"meteor-babel-helpers":{"package.json":function(require,exports){

/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
// ../../.1.1.1.xegi74.7zqb++os+web.browser+web.cordova/npm/node_modules/meteor-ba //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
                                                                                   //
exports.name = "meteor-babel-helpers";                                             // 1
exports.version = "0.0.3";                                                         // 2
exports.main = "index.js";                                                         // 3
                                                                                   // 4
/////////////////////////////////////////////////////////////////////////////////////

},"index.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////
//                                                                                 //
// node_modules/meteor/babel-runtime/node_modules/meteor-babel-helpers/index.js    //
//                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////
                                                                                   //
function canDefineNonEnumerableProperties() {                                      // 1
  var testObj = {};                                                                // 2
  var testPropName = "t";                                                          // 3
                                                                                   // 4
  try {                                                                            // 5
    Object.defineProperty(testObj, testPropName, {                                 // 6
      enumerable: false,                                                           // 7
      value: testObj                                                               // 8
    });                                                                            // 9
                                                                                   // 10
    for (var k in testObj) {                                                       // 11
      if (k === testPropName) {                                                    // 12
        return false;                                                              // 13
      }                                                                            // 14
    }                                                                              // 15
  } catch (e) {                                                                    // 16
    return false;                                                                  // 17
  }                                                                                // 18
                                                                                   // 19
  return testObj[testPropName] === testObj;                                        // 20
}                                                                                  // 21
                                                                                   // 22
function sanitizeEasy(value) {                                                     // 23
  return value;                                                                    // 24
}                                                                                  // 25
                                                                                   // 26
function sanitizeHard(obj) {                                                       // 27
  if (Array.isArray(obj)) {                                                        // 28
    var newObj = {};                                                               // 29
    var keys = Object.keys(obj);                                                   // 30
    var keyCount = keys.length;                                                    // 31
    for (var i = 0; i < keyCount; ++i) {                                           // 32
      var key = keys[i];                                                           // 33
      newObj[key] = obj[key];                                                      // 34
    }                                                                              // 35
    return newObj;                                                                 // 36
  }                                                                                // 37
                                                                                   // 38
  return obj;                                                                      // 39
}                                                                                  // 40
                                                                                   // 41
meteorBabelHelpers = module.exports = {                                            // 42
  // Meteor-specific runtime helper for wrapping the object of for-in              // 43
  // loops, so that inherited Array methods defined by es5-shim can be             // 44
  // ignored in browsers where they cannot be defined as non-enumerable.           // 45
  sanitizeForInObject: canDefineNonEnumerableProperties()                          // 46
    ? sanitizeEasy                                                                 // 47
    : sanitizeHard,                                                                // 48
                                                                                   // 49
  // Exposed so that we can test sanitizeForInObject in environments that          // 50
  // support defining non-enumerable properties.                                   // 51
  _sanitizeForInObjectHard: sanitizeHard                                           // 52
};                                                                                 // 53
                                                                                   // 54
/////////////////////////////////////////////////////////////////////////////////////

}}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("./node_modules/meteor/babel-runtime/babel-runtime.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['babel-runtime'] = exports, {
  meteorBabelHelpers: meteorBabelHelpers
});

})();