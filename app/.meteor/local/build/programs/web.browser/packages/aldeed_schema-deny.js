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
var Collection2 = Package['aldeed:collection2-core'].Collection2;
var Mongo = Package.mongo.Mongo;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;
var Symbol = Package['ecmascript-runtime-client'].Symbol;
var Map = Package['ecmascript-runtime-client'].Map;
var Set = Package['ecmascript-runtime-client'].Set;

var require = meteorInstall({"node_modules":{"meteor":{"aldeed:schema-deny":{"deny.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                        //
// packages/aldeed_schema-deny/deny.js                                                    //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////
                                                                                          //
var SimpleSchema = void 0;                                                                // 1
module.watch(require("simpl-schema"), {                                                   // 1
  "default": function (v) {                                                               // 1
    SimpleSchema = v;                                                                     // 1
  }                                                                                       // 1
}, 0);                                                                                    // 1
var Collection2 = void 0;                                                                 // 1
module.watch(require("meteor/aldeed:collection2-core"), {                                 // 1
  "default": function (v) {                                                               // 1
    Collection2 = v;                                                                      // 1
  }                                                                                       // 1
}, 1);                                                                                    // 1
// Extend the schema options allowed by SimpleSchema                                      // 5
SimpleSchema.extendOptions(['denyInsert', 'denyUpdate']);                                 // 6
Collection2.on('schema.attached', function (collection, ss) {                             // 8
  if (ss.version >= 2 && ss.messageBox && typeof ss.messageBox.messages === 'function') {
    ss.messageBox.messages({                                                              // 10
      en: {                                                                               // 11
        insertNotAllowed: '{{label}} cannot be set during an insert.',                    // 12
        updateNotAllowed: '{{label}} cannot be set during an update.'                     // 13
      }                                                                                   // 11
    });                                                                                   // 10
  }                                                                                       // 16
                                                                                          //
  ss.addValidator(function () {                                                           // 18
    if (!this.isSet) return;                                                              // 19
    var def = this.definition;                                                            // 21
    if (def.denyInsert && this.isInsert) return 'insertNotAllowed';                       // 23
    if (def.denyUpdate && (this.isUpdate || this.isUpsert)) return 'updateNotAllowed';    // 24
  });                                                                                     // 25
});                                                                                       // 26
////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("./node_modules/meteor/aldeed:schema-deny/deny.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['aldeed:schema-deny'] = exports;

})();
