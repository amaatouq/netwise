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

var require = meteorInstall({"node_modules":{"meteor":{"aldeed:schema-index":{"indexing.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/aldeed_schema-index/indexing.js                                                                         //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
var SimpleSchema = void 0;                                                                                          // 1
module.watch(require("simpl-schema"), {                                                                             // 1
  "default": function (v) {                                                                                         // 1
    SimpleSchema = v;                                                                                               // 1
  }                                                                                                                 // 1
}, 0);                                                                                                              // 1
var Collection2 = void 0;                                                                                           // 1
module.watch(require("meteor/aldeed:collection2-core"), {                                                           // 1
  "default": function (v) {                                                                                         // 1
    Collection2 = v;                                                                                                // 1
  }                                                                                                                 // 1
}, 1);                                                                                                              // 1
var Meteor = void 0;                                                                                                // 1
module.watch(require("meteor/meteor"), {                                                                            // 1
  Meteor: function (v) {                                                                                            // 1
    Meteor = v;                                                                                                     // 1
  }                                                                                                                 // 1
}, 2);                                                                                                              // 1
// Extend the schema options allowed by SimpleSchema                                                                // 6
SimpleSchema.extendOptions(['index', // one of Number, String, Boolean                                              // 7
'unique', // Boolean                                                                                                // 9
'sparse'] // Boolean                                                                                                // 10
);                                                                                                                  // 7
Collection2.on('schema.attached', function (collection, ss) {                                                       // 13
  // Define validation error messages                                                                               // 14
  if (ss.version >= 2 && ss.messageBox && typeof ss.messageBox.messages === 'function') {                           // 15
    ss.messageBox.messages({                                                                                        // 16
      en: {                                                                                                         // 17
        notUnique: '{{label}} must be unique'                                                                       // 18
      }                                                                                                             // 17
    });                                                                                                             // 16
  }                                                                                                                 // 21
});                                                                                                                 // 22
                                                                                                                    //
if (Meteor.isServer) {                                                                                              // 24
  Collection2.on('schema.attached', function (collection, ss) {                                                     // 25
    function ensureIndex(index, indexName, unique, sparse) {                                                        // 26
      Meteor.startup(function () {                                                                                  // 27
        collection._collection._ensureIndex(index, {                                                                // 28
          background: true,                                                                                         // 29
          name: indexName,                                                                                          // 30
          unique: unique,                                                                                           // 31
          sparse: sparse                                                                                            // 32
        });                                                                                                         // 28
      });                                                                                                           // 34
    }                                                                                                               // 35
                                                                                                                    //
    function dropIndex(indexName) {                                                                                 // 37
      Meteor.startup(function () {                                                                                  // 38
        try {                                                                                                       // 39
          collection._collection._dropIndex(indexName);                                                             // 40
        } catch (err) {// no index with that name, which is what we want                                            // 41
        }                                                                                                           // 43
      });                                                                                                           // 44
    }                                                                                                               // 45
                                                                                                                    //
    var propName = ss.version === 2 ? 'mergedSchema' : 'schema'; // Loop over fields definitions and ensure collection indexes (server side only)
                                                                                                                    //
    var schema = ss[propName]();                                                                                    // 50
    Object.keys(schema).forEach(function (fieldName) {                                                              // 51
      var definition = schema[fieldName];                                                                           // 52
                                                                                                                    //
      if ('index' in definition || definition.unique === true) {                                                    // 53
        var index = {},                                                                                             // 54
            indexValue; // If they specified `unique: true` but not `index`,                                        // 54
        // we assume `index: 1` to set up the unique index in mongo                                                 // 56
                                                                                                                    //
        if ('index' in definition) {                                                                                // 57
          indexValue = definition.index;                                                                            // 58
          if (indexValue === true) indexValue = 1;                                                                  // 59
        } else {                                                                                                    // 60
          indexValue = 1;                                                                                           // 61
        }                                                                                                           // 62
                                                                                                                    //
        var indexName = 'c2_' + fieldName; // In the index object, we want object array keys without the ".$" piece
                                                                                                                    //
        var idxFieldName = fieldName.replace(/\.\$\./g, ".");                                                       // 65
        index[idxFieldName] = indexValue;                                                                           // 66
        var unique = !!definition.unique && (indexValue === 1 || indexValue === -1);                                // 67
        var sparse = definition.sparse || false; // If unique and optional, force sparse to prevent errors          // 68
                                                                                                                    //
        if (!sparse && unique && definition.optional) sparse = true;                                                // 71
                                                                                                                    //
        if (indexValue === false) {                                                                                 // 73
          dropIndex(indexName);                                                                                     // 74
        } else {                                                                                                    // 75
          ensureIndex(index, indexName, unique, sparse);                                                            // 76
        }                                                                                                           // 77
      }                                                                                                             // 78
    });                                                                                                             // 79
  });                                                                                                               // 80
}                                                                                                                   // 81
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("./node_modules/meteor/aldeed:schema-index/indexing.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
Package['aldeed:schema-index'] = exports;

})();
