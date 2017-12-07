(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var Collection2 = Package['aldeed:collection2-core'].Collection2;
var ECMAScript = Package.ecmascript.ECMAScript;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

var require = meteorInstall({"node_modules":{"meteor":{"aldeed:schema-index":{"indexing.js":function(require,exports,module){

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                  //
// packages/aldeed_schema-index/indexing.js                                                                         //
//                                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                    //
let SimpleSchema;
module.watch(require("simpl-schema"), {
  default(v) {
    SimpleSchema = v;
  }

}, 0);
let Collection2;
module.watch(require("meteor/aldeed:collection2-core"), {
  default(v) {
    Collection2 = v;
  }

}, 1);
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 2);
// Extend the schema options allowed by SimpleSchema
SimpleSchema.extendOptions(['index', // one of Number, String, Boolean
'unique', // Boolean
'sparse'] // Boolean
);
Collection2.on('schema.attached', function (collection, ss) {
  // Define validation error messages
  if (ss.version >= 2 && ss.messageBox && typeof ss.messageBox.messages === 'function') {
    ss.messageBox.messages({
      en: {
        notUnique: '{{label}} must be unique'
      }
    });
  }
});

if (Meteor.isServer) {
  Collection2.on('schema.attached', function (collection, ss) {
    function ensureIndex(index, indexName, unique, sparse) {
      Meteor.startup(function () {
        collection._collection._ensureIndex(index, {
          background: true,
          name: indexName,
          unique: unique,
          sparse: sparse
        });
      });
    }

    function dropIndex(indexName) {
      Meteor.startup(function () {
        try {
          collection._collection._dropIndex(indexName);
        } catch (err) {// no index with that name, which is what we want
        }
      });
    }

    const propName = ss.version === 2 ? 'mergedSchema' : 'schema'; // Loop over fields definitions and ensure collection indexes (server side only)

    var schema = ss[propName]();
    Object.keys(schema).forEach(function (fieldName) {
      var definition = schema[fieldName];

      if ('index' in definition || definition.unique === true) {
        var index = {},
            indexValue; // If they specified `unique: true` but not `index`,
        // we assume `index: 1` to set up the unique index in mongo

        if ('index' in definition) {
          indexValue = definition.index;
          if (indexValue === true) indexValue = 1;
        } else {
          indexValue = 1;
        }

        var indexName = 'c2_' + fieldName; // In the index object, we want object array keys without the ".$" piece

        var idxFieldName = fieldName.replace(/\.\$\./g, ".");
        index[idxFieldName] = indexValue;
        var unique = !!definition.unique && (indexValue === 1 || indexValue === -1);
        var sparse = definition.sparse || false; // If unique and optional, force sparse to prevent errors

        if (!sparse && unique && definition.optional) sparse = true;

        if (indexValue === false) {
          dropIndex(indexName);
        } else {
          ensureIndex(index, indexName, unique, sparse);
        }
      }
    });
  });
}
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

//# sourceURL=meteor://💻app/packages/aldeed_schema-index.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYWxkZWVkOnNjaGVtYS1pbmRleC9pbmRleGluZy5qcyJdLCJuYW1lcyI6WyJTaW1wbGVTY2hlbWEiLCJtb2R1bGUiLCJ3YXRjaCIsInJlcXVpcmUiLCJkZWZhdWx0IiwidiIsIkNvbGxlY3Rpb24yIiwiTWV0ZW9yIiwiZXh0ZW5kT3B0aW9ucyIsIm9uIiwiY29sbGVjdGlvbiIsInNzIiwidmVyc2lvbiIsIm1lc3NhZ2VCb3giLCJtZXNzYWdlcyIsImVuIiwibm90VW5pcXVlIiwiaXNTZXJ2ZXIiLCJlbnN1cmVJbmRleCIsImluZGV4IiwiaW5kZXhOYW1lIiwidW5pcXVlIiwic3BhcnNlIiwic3RhcnR1cCIsIl9jb2xsZWN0aW9uIiwiX2Vuc3VyZUluZGV4IiwiYmFja2dyb3VuZCIsIm5hbWUiLCJkcm9wSW5kZXgiLCJfZHJvcEluZGV4IiwiZXJyIiwicHJvcE5hbWUiLCJzY2hlbWEiLCJPYmplY3QiLCJrZXlzIiwiZm9yRWFjaCIsImZpZWxkTmFtZSIsImRlZmluaXRpb24iLCJpbmRleFZhbHVlIiwiaWR4RmllbGROYW1lIiwicmVwbGFjZSIsIm9wdGlvbmFsIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsSUFBSUEsWUFBSjtBQUFpQkMsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLGNBQVIsQ0FBYixFQUFxQztBQUFDQyxVQUFRQyxDQUFSLEVBQVU7QUFBQ0wsbUJBQWFLLENBQWI7QUFBZTs7QUFBM0IsQ0FBckMsRUFBa0UsQ0FBbEU7QUFBcUUsSUFBSUMsV0FBSjtBQUFnQkwsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLGdDQUFSLENBQWIsRUFBdUQ7QUFBQ0MsVUFBUUMsQ0FBUixFQUFVO0FBQUNDLGtCQUFZRCxDQUFaO0FBQWM7O0FBQTFCLENBQXZELEVBQW1GLENBQW5GO0FBQXNGLElBQUlFLE1BQUo7QUFBV04sT0FBT0MsS0FBUCxDQUFhQyxRQUFRLGVBQVIsQ0FBYixFQUFzQztBQUFD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U0FBVjtBQUNELFNBRkQsTUFFTztBQUNMRixzQkFBWUMsS0FBWixFQUFtQkMsU0FBbkIsRUFBOEJDLE1BQTlCLEVBQXNDQyxNQUF0QztBQUNEO0FBQ0Y7QUFDRixLQTVCRDtBQTZCRCxHQXZERDtBQXdERCxDIiwiZmlsZSI6Ii9wYWNrYWdlcy9hbGRlZWRfc2NoZW1hLWluZGV4LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gY29sbGVjdGlvbjItY29yZSBjaGVja3MgdG8gbWFrZSBzdXJlIHRoYXQgc2ltcGwtc2NoZW1hIHBhY2thZ2UgaXMgYWRkZWRcbmltcG9ydCBTaW1wbGVTY2hlbWEgZnJvbSAnc2ltcGwtc2NoZW1hJztcbmltcG9ydCBDb2xsZWN0aW9uMiBmcm9tICdtZXRlb3IvYWxkZWVkOmNvbGxlY3Rpb24yLWNvcmUnO1xuaW1wb3J0IHsgTWV0ZW9yIH0gZnJvbSAnbWV0ZW9yL21ldGVvcic7XG5cbi8vIEV4dGVuZCB0aGUgc2NoZW1hIG9wdGlvbnMgYWxsb3dlZCBieSBTaW1wbGVTY2hlbWFcblNpbXBsZVNjaGVtYS5leHRlbmRPcHRpb25zKFtcbiAgJ2luZGV4JywgLy8gb25lIG9mIE51bWJlciwgU3RyaW5nLCBCb29sZWFuXG4gICd1bmlxdWUnLCAvLyBCb29sZWFuXG4gICdzcGFyc2UnLCAvLyBCb29sZWFuXG5dKTtcblxuQ29sbGVjdGlvbjIub24oJ3NjaGVtYS5hdHRhY2hlZCcsIGZ1bmN0aW9uIChjb2xsZWN0aW9uLCBzcykge1xuICAvLyBEZWZpbmUgdmFsaWRhdGlvbiBlcnJvciBtZXNzYWdlc1xuICBpZiAoc3MudmVyc2lvbiA+PSAyICYmIHNzLm1lc3NhZ2VCb3ggJiYgdHlwZW9mIHNzLm1lc3NhZ2VCb3gubWVzc2FnZXMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBzcy5tZXNzYWdlQm94Lm1lc3NhZ2VzKHtcbiAgICAgIGVuOiB7XG4gICAgICAgIG5vdFVuaXF1ZTogJ3t7bGFiZWx9fSBtdXN0IGJlIHVuaXF1ZScsXG4gICAgICB9LFxuICAgIH0pO1xuICB9XG59KTtcblxuaWYgKE1ldGVvci5pc1NlcnZlcikge1xuICBDb2xsZWN0aW9uMi5vbignc2NoZW1hLmF0dGFjaGVkJywgZnVuY3Rpb24gKGNvbGxlY3Rpb24sIHNzKSB7XG4gICAgZnVuY3Rpb24gZW5zdXJlSW5kZXgoaW5kZXgsIGluZGV4TmFtZSwgdW5pcXVlLCBzcGFyc2UpIHtcbiAgICAgIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29sbGVjdGlvbi5fY29sbGVjdGlvbi5fZW5zdXJlSW5kZXgoaW5kZXgsIHtcbiAgICAgICAgICBiYWNrZ3JvdW5kOiB0cnVlLFxuICAgICAgICAgIG5hbWU6IGluZGV4TmFtZSxcbiAgICAgICAgICB1bmlxdWU6IHVuaXF1ZSxcbiAgICAgICAgICBzcGFyc2U6IHNwYXJzZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGRyb3BJbmRleChpbmRleE5hbWUpIHtcbiAgICAgIE1ldGVvci5zdGFydHVwKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICBjb2xsZWN0aW9uLl9jb2xsZWN0aW9uLl9kcm9wSW5kZXgoaW5kZXhOYW1lKTtcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgLy8gbm8gaW5kZXggd2l0aCB0aGF0IG5hbWUsIHdoaWNoIGlzIHdoYXQgd2Ugd2FudFxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBjb25zdCBwcm9wTmFtZSA9IHNzLnZlcnNpb24gPT09IDIgPyAnbWVyZ2VkU2NoZW1hJyA6ICdzY2hlbWEnO1xuXG4gICAgLy8gTG9vcCBvdmVyIGZpZWxkcyBkZWZpbml0aW9ucyBhbmQgZW5zdXJlIGNvbGxlY3Rpb24gaW5kZXhlcyAoc2VydmVyIHNpZGUgb25seSlcbiAgICB2YXIgc2NoZW1hID0gc3NbcHJvcE5hbWVdKCk7XG4gICAgT2JqZWN0LmtleXMoc2NoZW1hKS5mb3JFYWNoKGZ1bmN0aW9uIChmaWVsZE5hbWUpIHtcbiAgICAgIHZhciBkZWZpbml0aW9uID0gc2NoZW1hW2ZpZWxkTmFtZV07XG4gICAgICBpZiAoJ2luZGV4JyBpbiBkZWZpbml0aW9uIHx8IGRlZmluaXRpb24udW5pcXVlID09PSB0cnVlKSB7XG4gICAgICAgIHZhciBpbmRleCA9IHt9LCBpbmRleFZhbHVlO1xuICAgICAgICAvLyBJZiB0aGV5IHNwZWNpZmllZCBgdW5pcXVlOiB0cnVlYCBidXQgbm90IGBpbmRleGAsXG4gICAgICAgIC8vIHdlIGFzc3VtZSBgaW5kZXg6IDFgIHRvIHNldCB1cCB0aGUgdW5pcXVlIGluZGV4IGluIG1vbmdvXG4gICAgICAgIGlmICgnaW5kZXgnIGluIGRlZmluaXRpb24pIHtcbiAgICAgICAgICBpbmRleFZhbHVlID0gZGVmaW5pdGlvbi5pbmRleDtcbiAgICAgICAgICBpZiAoaW5kZXhWYWx1ZSA9PT0gdHJ1ZSkgaW5kZXhWYWx1ZSA9IDE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaW5kZXhWYWx1ZSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGluZGV4TmFtZSA9ICdjMl8nICsgZmllbGROYW1lO1xuICAgICAgICAvLyBJbiB0aGUgaW5kZXggb2JqZWN0LCB3ZSB3YW50IG9iamVjdCBhcnJheSBrZXlzIHdpdGhvdXQgdGhlIFwiLiRcIiBwaWVjZVxuICAgICAgICB2YXIgaWR4RmllbGROYW1lID0gZmllbGROYW1lLnJlcGxhY2UoL1xcLlxcJFxcLi9nLCBcIi5cIik7XG4gICAgICAgIGluZGV4W2lkeEZpZWxkTmFtZV0gPSBpbmRleFZhbHVlO1xuICAgICAgICB2YXIgdW5pcXVlID0gISFkZWZpbml0aW9uLnVuaXF1ZSAmJiAoaW5kZXhWYWx1ZSA9PT0gMSB8fCBpbmRleFZhbHVlID09PSAtMSk7XG4gICAgICAgIHZhciBzcGFyc2UgPSBkZWZpbml0aW9uLnNwYXJzZSB8fCBmYWxzZTtcblxuICAgICAgICAvLyBJZiB1bmlxdWUgYW5kIG9wdGlvbmFsLCBmb3JjZSBzcGFyc2UgdG8gcHJldmVudCBlcnJvcnNcbiAgICAgICAgaWYgKCFzcGFyc2UgJiYgdW5pcXVlICYmIGRlZmluaXRpb24ub3B0aW9uYWwpIHNwYXJzZSA9IHRydWU7XG5cbiAgICAgICAgaWYgKGluZGV4VmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgZHJvcEluZGV4KGluZGV4TmFtZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZW5zdXJlSW5kZXgoaW5kZXgsIGluZGV4TmFtZSwgdW5pcXVlLCBzcGFyc2UpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuIl19
