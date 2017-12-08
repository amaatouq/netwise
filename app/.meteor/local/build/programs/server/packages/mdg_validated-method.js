(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var ECMAScript = Package.ecmascript.ECMAScript;
var check = Package.check.check;
var Match = Package.check.Match;
var DDP = Package['ddp-client'].DDP;
var DDPServer = Package['ddp-server'].DDPServer;
var _ = Package.underscore._;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var ValidatedMethod, options, callback, args, methodInvocation;

var require = meteorInstall({"node_modules":{"meteor":{"mdg:validated-method":{"validated-method.js":function(){

//////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                  //
// packages/mdg_validated-method/validated-method.js                                                //
//                                                                                                  //
//////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                    //
/* global ValidatedMethod:true */ValidatedMethod = class ValidatedMethod {
  constructor(options) {
    // Default to no mixins
    options.mixins = options.mixins || [];
    check(options.mixins, [Function]);
    check(options.name, String);
    options = applyMixins(options, options.mixins); // connection argument defaults to Meteor, which is where Methods are defined on client and
    // server

    options.connection = options.connection || Meteor; // Allow validate: null shorthand for methods that take no arguments

    if (options.validate === null) {
      options.validate = function () {};
    } // If this is null/undefined, make it an empty object


    options.applyOptions = options.applyOptions || {};
    check(options, Match.ObjectIncluding({
      name: String,
      validate: Function,
      run: Function,
      mixins: [Function],
      connection: Object,
      applyOptions: Object
    })); // Default options passed to Meteor.apply, can be overridden with applyOptions

    const defaultApplyOptions = {
      // Make it possible to get the ID of an inserted item
      returnStubValue: true,
      // Don't call the server method if the client stub throws an error, so that we don't end
      // up doing validations twice
      throwStubExceptions: true
    };
    options.applyOptions = _.extend({}, defaultApplyOptions, options.applyOptions); // Attach all options to the ValidatedMethod instance

    _.extend(this, options);

    const method = this;
    this.connection.methods({
      [options.name](args) {
        // Silence audit-argument-checks since arguments are always checked when using this package
        check(args, Match.Any);
        const methodInvocation = this;
        return method._execute(methodInvocation, args);
      }

    });
  }

  call(args, callback) {
    // Accept calling with just a callback
    if (_.isFunction(args)) {
      callback = args;
      args = {};
    }

    try {
      return this.connection.apply(this.name, [args], this.applyOptions, callback);
    } catch (err) {
      if (callback) {
        // Get errors from the stub in the same way as from the server-side method
        callback(err);
      } else {
        // No callback passed, throw instead of silently failing; this is what
        // "normal" Methods do if you don't pass a callback.
        throw err;
      }
    }
  }

  _execute(methodInvocation, args) {
    methodInvocation = methodInvocation || {}; // Add `this.name` to reference the Method name

    methodInvocation.name = this.name;
    const validateResult = this.validate.bind(methodInvocation)(args);

    if (typeof validateResult !== 'undefined') {
      throw new Error(`Returning from validate doesn't do anything; \
perhaps you meant to throw an error?`);
    }

    return this.run.bind(methodInvocation)(args);
  }

}; // Mixins get a chance to transform the arguments before they are passed to the actual Method

function applyMixins(args, mixins) {
  // You can pass nested arrays so that people can ship mixin packs
  const flatMixins = _.flatten(mixins); // Save name of the method here, so we can attach it to potential error messages


  const {
    name
  } = args;
  flatMixins.forEach(mixin => {
    args = mixin(args);

    if (!Match.test(args, Object)) {
      const functionName = mixin.toString().match(/function\s(\w+)/);
      let msg = 'One of the mixins';

      if (functionName) {
        msg = `The function '${functionName[1]}'`;
      }

      throw new Error(`Error in ${name} method: ${msg} didn't return the options object.`);
    }
  });
  return args;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
require("./node_modules/meteor/mdg:validated-method/validated-method.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['mdg:validated-method'] = {}, {
  ValidatedMethod: ValidatedMethod
});

})();

//# sourceURL=meteor://💻app/packages/mdg_validated-method.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvbWRnOnZhbGlkYXRlZC1tZXRob2QvdmFsaWRhdGVkLW1ldGhvZC5qcyJdLCJuYW1lcyI6WyJWYWxpZGF0ZWRNZXRob2QiLCJjb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJtaXhpbnMiLCJjaGVjayIsIkZ1bmN0aW9uIiwibmFtZSIsIlN0cmluZyIsImFwcGx5TWl4aW5zIiwiY29ubmVjdGlvbiIsIk1ldGVvciIsInZhbGlkYXRlIiwiYXBwbHlPcHRpb25zIiwiTWF0Y2giLCJPYmplY3RJbmNsdWRpbmciLCJydW4iLCJPYmplY3QiLCJkZWZhdWx0QXBwbHlPcHRpb25zIiwicmV0dXJuU3R1YlZhbHVlIiwidGhyb3dTdHViRXhjZXB0aW9ucyIsIl8iLCJleHRlbmQiLCJtZXRob2QiLCJtZXRob2RzIiwiYXJncyIsIkFueSIsIm1ldGhvZEludm9jYXRpb24iLCJfZXhlY3V0ZSIsImNhbGwiLCJjYWxsYmFjayIsImlzRnVuY3Rpb24iLCJhcHBseSIsImVyciIsInZhbGlkYXRlUmVzdWx0IiwiYmluZCIsIkVycm9yIiwiZmxhdE1peGlucyIsImZsYXR0ZW4iLCJmb3JFYWNoIiwibWl4aW4iLCJ0ZXN0IiwiZnVuY3Rpb25OYW1lIiwidG9TdHJpbmciLCJtYXRjaCIsIm1zZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaUNBRUFBLGtCQUFrQixNQUFNQSxlQUFOLENBQXNCO0FBQ3RDQyxjQUFZQyxPQUFaLEVBQXFCO0FBQ25CO0FBQ0FBLFlBQVFDLE1BQVIsR0FBaUJELFFBQVFDLE1BQVIsSUFBa0IsRUFBbkM7QUFDQUMsVUFBTUYsUUFBUUMsTUFBZCxFQUFzQixDQUFDRSxRQUFELENBQXRCO0FBQ0FELFVBQU1GLFFBQVFJLElBQWQsRUFBb0JDLE1BQXBCO0FBQ0FMLGNBQVVNLFlBQVlOLE9BQVosRUFBcUJBLFFBQVFDLE1BQTdCLENBQVYsQ0FMbUIsQ0FPbkI7QUFDQTs7QUFDQUQs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QUFPZSxNQUFNZixJQUFOLENBQVA7O0FBRUEsUUFBRyxDQUFDWCxNQUFNMkIsSUFBTixDQUFXaEIsSUFBWCxFQUFpQlIsTUFBakIsQ0FBSixFQUE4QjtBQUM1QixZQUFNeUIsZUFBZUYsTUFBTUcsUUFBTixHQUFpQkMsS0FBakIsQ0FBdUIsaUJBQXZCLENBQXJCO0FBQ0EsVUFBSUMsTUFBTSxtQkFBVjs7QUFFQSxVQUFHSCxZQUFILEVBQWlCO0FBQ2ZHLGNBQU8saUJBQWdCSCxhQUFhLENBQWIsQ0FBZ0IsR0FBdkM7QUFDRDs7QUFFRCxZQUFNLElBQUlOLEtBQUosQ0FBVyxZQUFXN0IsSUFBSyxZQUFXc0MsR0FBSSxvQ0FBMUMsQ0FBTjtBQUNEO0FBQ0YsR0FiRDtBQWVBLFNBQU9wQixJQUFQO0FBQ0QsQyIsImZpbGUiOiIvcGFja2FnZXMvbWRnX3ZhbGlkYXRlZC1tZXRob2QuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWwgVmFsaWRhdGVkTWV0aG9kOnRydWUgKi9cblxuVmFsaWRhdGVkTWV0aG9kID0gY2xhc3MgVmFsaWRhdGVkTWV0aG9kIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgIC8vIERlZmF1bHQgdG8gbm8gbWl4aW5zXG4gICAgb3B0aW9ucy5taXhpbnMgPSBvcHRpb25zLm1peGlucyB8fCBbXTtcbiAgICBjaGVjayhvcHRpb25zLm1peGlucywgW0Z1bmN0aW9uXSk7XG4gICAgY2hlY2sob3B0aW9ucy5uYW1lLCBTdHJpbmcpO1xuICAgIG9wdGlvbnMgPSBhcHBseU1peGlucyhvcHRpb25zLCBvcHRpb25zLm1peGlucyk7XG5cbiAgICAvLyBjb25uZWN0aW9uIGFyZ3VtZW50IGRlZmF1bHRzIHRvIE1ldGVvciwgd2hpY2ggaXMgd2hlcmUgTWV0aG9kcyBhcmUgZGVmaW5lZCBvbiBjbGllbnQgYW5kXG4gICAgLy8gc2VydmVyXG4gICAgb3B0aW9ucy5jb25uZWN0aW9uID0gb3B0aW9ucy5jb25uZWN0aW9uIHx8IE1ldGVvcjtcblxuICAgIC8vIEFsbG93IHZhbGlkYXRlOiBudWxsIHNob3J0aGFuZCBmb3IgbWV0aG9kcyB0aGF0IHRha2Ugbm8gYXJndW1lbnRzXG4gICAgaWYgKG9wdGlvbnMudmFsaWRhdGUgPT09IG51bGwpIHtcbiAgICAgIG9wdGlvbnMudmFsaWRhdGUgPSBmdW5jdGlvbiAoKSB7fTtcbiAgICB9XG5cbiAgICAvLyBJZiB0aGlzIGlzIG51bGwvdW5kZWZpbmVkLCBtYWtlIGl0IGFuIGVtcHR5IG9iamVjdFxuICAgIG9wdGlvbnMuYXBwbHlPcHRpb25zID0gb3B0aW9ucy5hcHBseU9wdGlvbnMgfHwge307XG5cbiAgICBjaGVjayhvcHRpb25zLCBNYXRjaC5PYmplY3RJbmNsdWRpbmcoe1xuICAgICAgbmFtZTogU3RyaW5nLFxuICAgICAgdmFsaWRhdGU6IEZ1bmN0aW9uLFxuICAgICAgcnVuOiBGdW5jdGlvbixcbiAgICAgIG1peGluczogW0Z1bmN0aW9uXSxcbiAgICAgIGNvbm5lY3Rpb246IE9iamVjdCxcbiAgICAgIGFwcGx5T3B0aW9uczogT2JqZWN0LFxuICAgIH0pKTtcblxuICAgIC8vIERlZmF1bHQgb3B0aW9ucyBwYXNzZWQgdG8gTWV0ZW9yLmFwcGx5LCBjYW4gYmUgb3ZlcnJpZGRlbiB3aXRoIGFwcGx5T3B0aW9uc1xuICAgIGNvbnN0IGRlZmF1bHRBcHBseU9wdGlvbnMgPSB7XG4gICAgICAvLyBNYWtlIGl0IHBvc3NpYmxlIHRvIGdldCB0aGUgSUQgb2YgYW4gaW5zZXJ0ZWQgaXRlbVxuICAgICAgcmV0dXJuU3R1YlZhbHVlOiB0cnVlLFxuXG4gICAgICAvLyBEb24ndCBjYWxsIHRoZSBzZXJ2ZXIgbWV0aG9kIGlmIHRoZSBjbGllbnQgc3R1YiB0aHJvd3MgYW4gZXJyb3IsIHNvIHRoYXQgd2UgZG9uJ3QgZW5kXG4gICAgICAvLyB1cCBkb2luZyB2YWxpZGF0aW9ucyB0d2ljZVxuICAgICAgdGhyb3dTdHViRXhjZXB0aW9uczogdHJ1ZSxcbiAgICB9O1xuXG4gICAgb3B0aW9ucy5hcHBseU9wdGlvbnMgPSBfLmV4dGVuZCh7fSwgZGVmYXVsdEFwcGx5T3B0aW9ucywgb3B0aW9ucy5hcHBseU9wdGlvbnMpO1xuXG4gICAgLy8gQXR0YWNoIGFsbCBvcHRpb25zIHRvIHRoZSBWYWxpZGF0ZWRNZXRob2QgaW5zdGFuY2VcbiAgICBfLmV4dGVuZCh0aGlzLCBvcHRpb25zKTtcblxuICAgIGNvbnN0IG1ldGhvZCA9IHRoaXM7XG4gICAgdGhpcy5jb25uZWN0aW9uLm1ldGhvZHMoe1xuICAgICAgW29wdGlvbnMubmFtZV0oYXJncykge1xuICAgICAgICAvLyBTaWxlbmNlIGF1ZGl0LWFyZ3VtZW50LWNoZWNrcyBzaW5jZSBhcmd1bWVudHMgYXJlIGFsd2F5cyBjaGVja2VkIHdoZW4gdXNpbmcgdGhpcyBwYWNrYWdlXG4gICAgICAgIGNoZWNrKGFyZ3MsIE1hdGNoLkFueSk7XG4gICAgICAgIGNvbnN0IG1ldGhvZEludm9jYXRpb24gPSB0aGlzO1xuXG4gICAgICAgIHJldHVybiBtZXRob2QuX2V4ZWN1dGUobWV0aG9kSW52b2NhdGlvbiwgYXJncyk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBjYWxsKGFyZ3MsIGNhbGxiYWNrKSB7XG4gICAgLy8gQWNjZXB0IGNhbGxpbmcgd2l0aCBqdXN0IGEgY2FsbGJhY2tcbiAgICBpZiAoXy5pc0Z1bmN0aW9uKGFyZ3MpKSB7XG4gICAgICBjYWxsYmFjayA9IGFyZ3M7XG4gICAgICBhcmdzID0ge307XG4gICAgfVxuXG4gICAgdHJ5IHtcbiAgICAgIHJldHVybiB0aGlzLmNvbm5lY3Rpb24uYXBwbHkodGhpcy5uYW1lLCBbYXJnc10sIHRoaXMuYXBwbHlPcHRpb25zLCBjYWxsYmFjayk7XG4gICAgfSBjYXRjaCAoZXJyKSB7XG4gICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgLy8gR2V0IGVycm9ycyBmcm9tIHRoZSBzdHViIGluIHRoZSBzYW1lIHdheSBhcyBmcm9tIHRoZSBzZXJ2ZXItc2lkZSBtZXRob2RcbiAgICAgICAgY2FsbGJhY2soZXJyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIE5vIGNhbGxiYWNrIHBhc3NlZCwgdGhyb3cgaW5zdGVhZCBvZiBzaWxlbnRseSBmYWlsaW5nOyB0aGlzIGlzIHdoYXRcbiAgICAgICAgLy8gXCJub3JtYWxcIiBNZXRob2RzIGRvIGlmIHlvdSBkb24ndCBwYXNzIGEgY2FsbGJhY2suXG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBfZXhlY3V0ZShtZXRob2RJbnZvY2F0aW9uLCBhcmdzKSB7XG4gICAgbWV0aG9kSW52b2NhdGlvbiA9IG1ldGhvZEludm9jYXRpb24gfHwge307XG5cbiAgICAvLyBBZGQgYHRoaXMubmFtZWAgdG8gcmVmZXJlbmNlIHRoZSBNZXRob2QgbmFtZVxuICAgIG1ldGhvZEludm9jYXRpb24ubmFtZSA9IHRoaXMubmFtZTtcblxuICAgIGNvbnN0IHZhbGlkYXRlUmVzdWx0ID0gdGhpcy52YWxpZGF0ZS5iaW5kKG1ldGhvZEludm9jYXRpb24pKGFyZ3MpO1xuXG4gICAgaWYgKHR5cGVvZiB2YWxpZGF0ZVJlc3VsdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUmV0dXJuaW5nIGZyb20gdmFsaWRhdGUgZG9lc24ndCBkbyBhbnl0aGluZzsgXFxcbnBlcmhhcHMgeW91IG1lYW50IHRvIHRocm93IGFuIGVycm9yP2ApO1xuICAgIH1cblxuICAgIHJldHVybiB0aGlzLnJ1bi5iaW5kKG1ldGhvZEludm9jYXRpb24pKGFyZ3MpO1xuICB9XG59O1xuXG4vLyBNaXhpbnMgZ2V0IGEgY2hhbmNlIHRvIHRyYW5zZm9ybSB0aGUgYXJndW1lbnRzIGJlZm9yZSB0aGV5IGFyZSBwYXNzZWQgdG8gdGhlIGFjdHVhbCBNZXRob2RcbmZ1bmN0aW9uIGFwcGx5TWl4aW5zKGFyZ3MsIG1peGlucykge1xuICAvLyBZb3UgY2FuIHBhc3MgbmVzdGVkIGFycmF5cyBzbyB0aGF0IHBlb3BsZSBjYW4gc2hpcCBtaXhpbiBwYWNrc1xuICBjb25zdCBmbGF0TWl4aW5zID0gXy5mbGF0dGVuKG1peGlucyk7XG4gIC8vIFNhdmUgbmFtZSBvZiB0aGUgbWV0aG9kIGhlcmUsIHNvIHdlIGNhbiBhdHRhY2ggaXQgdG8gcG90ZW50aWFsIGVycm9yIG1lc3NhZ2VzXG4gIGNvbnN0IHtuYW1lfSA9IGFyZ3M7XG5cbiAgZmxhdE1peGlucy5mb3JFYWNoKChtaXhpbikgPT4ge1xuICAgIGFyZ3MgPSBtaXhpbihhcmdzKTtcblxuICAgIGlmKCFNYXRjaC50ZXN0KGFyZ3MsIE9iamVjdCkpIHtcbiAgICAgIGNvbnN0IGZ1bmN0aW9uTmFtZSA9IG1peGluLnRvU3RyaW5nKCkubWF0Y2goL2Z1bmN0aW9uXFxzKFxcdyspLyk7XG4gICAgICBsZXQgbXNnID0gJ09uZSBvZiB0aGUgbWl4aW5zJztcblxuICAgICAgaWYoZnVuY3Rpb25OYW1lKSB7XG4gICAgICAgIG1zZyA9IGBUaGUgZnVuY3Rpb24gJyR7ZnVuY3Rpb25OYW1lWzFdfSdgO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEVycm9yIGluICR7bmFtZX0gbWV0aG9kOiAke21zZ30gZGlkbid0IHJldHVybiB0aGUgb3B0aW9ucyBvYmplY3QuYCk7XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4gYXJncztcbn1cbiJdfQ==
