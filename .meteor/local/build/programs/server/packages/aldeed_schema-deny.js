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

var require = meteorInstall({"node_modules":{"meteor":{"aldeed:schema-deny":{"deny.js":function(require,exports,module){

////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                        //
// packages/aldeed_schema-deny/deny.js                                                    //
//                                                                                        //
////////////////////////////////////////////////////////////////////////////////////////////
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
// Extend the schema options allowed by SimpleSchema
SimpleSchema.extendOptions(['denyInsert', 'denyUpdate']);
Collection2.on('schema.attached', function (collection, ss) {
  if (ss.version >= 2 && ss.messageBox && typeof ss.messageBox.messages === 'function') {
    ss.messageBox.messages({
      en: {
        insertNotAllowed: '{{label}} cannot be set during an insert.',
        updateNotAllowed: '{{label}} cannot be set during an update.'
      }
    });
  }

  ss.addValidator(function () {
    if (!this.isSet) return;
    const def = this.definition;
    if (def.denyInsert && this.isInsert) return 'insertNotAllowed';
    if (def.denyUpdate && (this.isUpdate || this.isUpsert)) return 'updateNotAllowed';
  });
});
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

//# sourceURL=meteor://💻app/packages/aldeed_schema-deny.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYWxkZWVkOnNjaGVtYS1kZW55L2RlbnkuanMiXSwibmFtZXMiOlsiU2ltcGxlU2NoZW1hIiwibW9kdWxlIiwid2F0Y2giLCJyZXF1aXJlIiwiZGVmYXVsdCIsInYiLCJDb2xsZWN0aW9uMiIsImV4dGVuZE9wdGlvbnMiLCJvbiIsImNvbGxlY3Rpb24iLCJzcyIsInZlcnNpb24iLCJtZXNzYWdlQm94IiwibWVzc2FnZXMiLCJlbiIsImluc2VydE5vdEFsbG93ZWQiLCJ1cGRhdGVOb3RBbGxvd2VkIiwiYWRkVmFsaWRhdG9yIiwiaXNTZXQiLCJkZWYiLCJkZWZpbml0aW9uIiwiZGVueUluc2VydCIsImlzSW5zZXJ0IiwiZGVueVVwZGF0ZSIsImlzVXBkYXRlIiwiaXNVcHNlcnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxZQUFKO0FBQWlCQyxPQUFPQyxLQUFQLENBQWFDLFFBQVEsY0FBUixDQUFiLEVBQXFDO0FBQUNDLFVBQVFDLENBQVIsRUFBVTtBQUFDTCxtQkFBYUssQ0FBYjtBQUFlOztBQUEzQixDQUFyQyxFQUFrRSxDQUFsRTtBQUFxRSxJQUFJQyxXQUFKO0FBQWdCTCxPQUFPQyxLQUFQLENBQWFDLFFBQVEsZ0NBQVIsQ0FBYixFQUF1RDtBQUFDQyxVQUFRQyxDQUFSLEVBQVU7QUFBQ0Msa0JBQVlELENBQVo7QUFBYzs7QUFBMUIsQ0FBdkQsRUFBbUYsQ0FBbkY7QUFJdEc7QUFDQUwsYUFBYU8sYUFBYixDQUEyQixDQUFDLFlBQUQsRUFBZSxZQUFmLENBQTNCO0FBRUFELFlBQVlFLEVBQVosQ0FBZSxpQkFBZixFQUFrQyxVQUFVQyxVQUFWLEVBQXNCQyxFQUF0QixFQUEwQjtBQUMxRCxNQUFJQSxHQUFHQyxPQUFILElBQWMsQ0FBZCxJQUFtQkQsR0FBR0UsVUFBdEIsSUFBb0MsT0FBT0YsR0FBR0UsVUFBSCxDQUFjQyxRQUFyQixLQUFrQyxVQUExRSxFQUFzRjtBQUNwRkgsT0FBR0UsVUFBSCxDQUFjQyxRQUFkLENBQXVCO0FBQ3JCQyxVQUFJO0FBQ0ZDLDBCQUFrQiwyQ0FEaEI7QUFFRkMsMEJBQWtCO0FBRmhCO0FBRGlCLEtBQXZCO0FBTUQ7O0FBRUROLEtBQUdPLFlBQUgsQ0FBZ0IsWUFBVztBQUN6QixRQUFJLENBQUMsS0FBS0MsS0FBVixFQUFpQjtBQUVqQixVQUFNQyxNQUFNLEtBQUtDLFVBQWpCO0FBRUEsUUFBSUQsSUFBSUUsVUFBSixJQUFrQixLQUFLQyxRQUEzQixFQUFxQyxPQUFPLGtCQUFQO0FBQ3JDLFFBQUlILElBQUlJLFVBQUosS0FBbUIsS0FBS0MsUUFBTCxJQUFpQixLQUFLQyxRQUF6QyxDQUFKLEVBQXdELE9BQU8sa0JBQVA7QUFDekQsR0FQRDtBQVFELENBbEJELEUiLCJmaWxlIjoiL3BhY2thZ2VzL2FsZGVlZF9zY2hlbWEtZGVueS5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGNvbGxlY3Rpb24yLWNvcmUgY2hlY2tzIHRvIG1ha2Ugc3VyZSB0aGF0IHNpbXBsLXNjaGVtYSBwYWNrYWdlIGlzIGFkZGVkXG5pbXBvcnQgU2ltcGxlU2NoZW1hIGZyb20gJ3NpbXBsLXNjaGVtYSc7XG5pbXBvcnQgQ29sbGVjdGlvbjIgZnJvbSAnbWV0ZW9yL2FsZGVlZDpjb2xsZWN0aW9uMi1jb3JlJztcblxuLy8gRXh0ZW5kIHRoZSBzY2hlbWEgb3B0aW9ucyBhbGxvd2VkIGJ5IFNpbXBsZVNjaGVtYVxuU2ltcGxlU2NoZW1hLmV4dGVuZE9wdGlvbnMoWydkZW55SW5zZXJ0JywgJ2RlbnlVcGRhdGUnXSk7XG5cbkNvbGxlY3Rpb24yLm9uKCdzY2hlbWEuYXR0YWNoZWQnLCBmdW5jdGlvbiAoY29sbGVjdGlvbiwgc3MpIHtcbiAgaWYgKHNzLnZlcnNpb24gPj0gMiAmJiBzcy5tZXNzYWdlQm94ICYmIHR5cGVvZiBzcy5tZXNzYWdlQm94Lm1lc3NhZ2VzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgc3MubWVzc2FnZUJveC5tZXNzYWdlcyh7XG4gICAgICBlbjoge1xuICAgICAgICBpbnNlcnROb3RBbGxvd2VkOiAne3tsYWJlbH19IGNhbm5vdCBiZSBzZXQgZHVyaW5nIGFuIGluc2VydC4nLFxuICAgICAgICB1cGRhdGVOb3RBbGxvd2VkOiAne3tsYWJlbH19IGNhbm5vdCBiZSBzZXQgZHVyaW5nIGFuIHVwZGF0ZS4nXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBzcy5hZGRWYWxpZGF0b3IoZnVuY3Rpb24oKSB7XG4gICAgaWYgKCF0aGlzLmlzU2V0KSByZXR1cm47XG5cbiAgICBjb25zdCBkZWYgPSB0aGlzLmRlZmluaXRpb247XG5cbiAgICBpZiAoZGVmLmRlbnlJbnNlcnQgJiYgdGhpcy5pc0luc2VydCkgcmV0dXJuICdpbnNlcnROb3RBbGxvd2VkJztcbiAgICBpZiAoZGVmLmRlbnlVcGRhdGUgJiYgKHRoaXMuaXNVcGRhdGUgfHwgdGhpcy5pc1Vwc2VydCkpIHJldHVybiAndXBkYXRlTm90QWxsb3dlZCc7XG4gIH0pO1xufSk7XG4iXX0=
