(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var _ = Package.underscore._;
var MongoInternals = Package.mongo.MongoInternals;
var Mongo = Package.mongo.Mongo;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;
var EJSON = Package.ejson.EJSON;
var EventEmitter = Package['raix:eventemitter'].EventEmitter;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var Collection2;

var require = meteorInstall({"node_modules":{"meteor":{"aldeed:collection2-core":{"collection2.js":function(require,exports,module){

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                   //
// packages/aldeed_collection2-core/collection2.js                                                                   //
//                                                                                                                   //
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                     //
let EventEmitter;
module.watch(require("meteor/raix:eventemitter"), {
  EventEmitter(v) {
    EventEmitter = v;
  }

}, 0);
let Meteor;
module.watch(require("meteor/meteor"), {
  Meteor(v) {
    Meteor = v;
  }

}, 1);
let EJSON;
module.watch(require("meteor/ejson"), {
  EJSON(v) {
    EJSON = v;
  }

}, 2);

let _;

module.watch(require("meteor/underscore"), {
  _(v) {
    _ = v;
  }

}, 3);
let checkNpmVersions;
module.watch(require("meteor/tmeasday:check-npm-versions"), {
  checkNpmVersions(v) {
    checkNpmVersions = v;
  }

}, 4);
checkNpmVersions({
  'simpl-schema': '>=0.0.0'
}, 'aldeed:meteor-collection2-core');

const SimpleSchema = require('simpl-schema').default; // Exported only for listening to events


const Collection2 = new EventEmitter(); /**
                                         * Mongo.Collection.prototype.attachSchema
                                         * @param {SimpleSchema|Object} ss - SimpleSchema instance or a schema definition object
                                         *    from which to create a new SimpleSchema instance
                                         * @param {Object} [options]
                                         * @param {Boolean} [options.transform=false] Set to `true` if your document must be passed
                                         *    through the collection's transform to properly validate.
                                         * @param {Boolean} [options.replace=false] Set to `true` to replace any existing schema instead of combining
                                         * @return {undefined}
                                         *
                                         * Use this method to attach a schema to a collection created by another package,
                                         * such as Meteor.users. It is most likely unsafe to call this method more than
                                         * once for a single collection, or to call this for a collection that had a
                                         * schema object passed to its constructor.
                                         */

Mongo.Collection.prototype.attachSchema = function c2AttachSchema(ss, options) {
  var self = this;
  options = options || {}; // Allow passing just the schema object

  if (!(ss instanceof SimpleSchema)) {
    ss = new SimpleSchema(ss);
  }

  self._c2 = self._c2 || {}; // If we've already attached one schema, we combine both into a new schema unless options.replace is `true`

  if (self._c2._simpleSchema && options.replace !== true) {
    if (ss.version >= 2) {
      var newSS = new SimpleSchema(self._c2._simpleSchema);
      newSS.extend(ss);
      ss = newSS;
    } else {
      ss = new SimpleSchema([self._c2._simpleSchema, ss]);
    }
  }

  var selector = options.selector;

  function attachTo(obj) {
    if (typeof selector === "object") {
      // Index of existing schema with identical selector
      var schemaIndex = -1; // we need an array to hold multiple schemas

      obj._c2._simpleSchemas = obj._c2._simpleSchemas || []; // Loop through existing schemas with selectors

      obj._c2._simpleSchemas.forEach(function (schema, index) {
        // if we find a schema with an identical selector, save it's index
        if (_.isEqual(schema.selector, selector)) {
          schemaIndex = index;
        }
      });

      if (schemaIndex === -1) {
        // We didn't find the schema in our array - push it into the array
        obj._c2._simpleSchemas.push({
          schema: new SimpleSchema(ss),
          selector: selector
        });
      } else {
        // We found a schema with an identical selector in our array,
        if (options.replace !== true) {
          // Merge with existing schema unless options.replace is `true`
          if (obj._c2._simpleSchemas[schemaIndex].schema.version >= 2) {
            obj._c2._simpleSchemas[schemaIndex].schema.extend(ss);
          } else {
            obj._c2._simpleSchemas[schemaIndex].schema = new SimpleSchema([obj._c2._simpleSchemas[schemaIndex].schema, ss]);
          }
        } else {
          // If options.repalce is `true` replace existing schema with new schema
          obj._c2._simpleSchemas[schemaIndex].schema = ss;
        }
      } // Remove existing schemas without selector


      delete obj._c2._simpleSchema;
    } else {
      // Track the schema in the collection
      obj._c2._simpleSchema = ss; // Remove existing schemas with selector

      delete obj._c2._simpleSchemas;
    }
  }

  attachTo(self); // Attach the schema to the underlying LocalCollection, too

  if (self._collection instanceof LocalCollection) {
    self._collection._c2 = self._collection._c2 || {};
    attachTo(self._collection);
  }

  defineDeny(self, options);
  keepInsecure(self);
  Collection2.emit('schema.attached', self, ss, options);
};

_.each([Mongo.Collection, LocalCollection], function (obj) {
  /**
   * simpleSchema
   * @description function detect the correct schema by given params. If it
   * detect multi-schema presence in `self`, then it made an attempt to find a
   * `selector` in args
   * @param {Object} doc - It could be <update> on update/upsert or document
   * itself on insert/remove
   * @param {Object} [options] - It could be <update> on update/upsert etc
   * @param {Object} [query] - it could be <query> on update/upsert
   * @return {Object} Schema
   */obj.prototype.simpleSchema = function (doc, options, query) {
    if (!this._c2) return null;
    if (this._c2._simpleSchema) return this._c2._simpleSchema;
    var schemas = this._c2._simpleSchemas;

    if (schemas && schemas.length > 0) {
      if (!doc) throw new Error('collection.simpleSchema() requires doc argument when there are multiple schemas');
      var schema, selector, target;

      for (var i = 0; i < schemas.length; i++) {
        schema = schemas[i];
        selector = Object.keys(schema.selector)[0]; // We will set this to undefined because in theory you might want to select
        // on a null value.

        target = undefined; // here we are looking for selector in different places
        // $set should have more priority here

        if (doc.$set && typeof doc.$set[selector] !== 'undefined') {
          target = doc.$set[selector];
        } else if (typeof doc[selector] !== 'undefined') {
          target = doc[selector];
        } else if (options && options.selector) {
          target = options.selector[selector];
        } else if (query && query[selector]) {
          // on upsert/update operations
          target = query[selector];
        } // we need to compare given selector with doc property or option to
        // find right schema


        if (target !== undefined && target === schema.selector[selector]) {
          return schema.schema;
        }
      }
    }

    return null;
  };
}); // Wrap DB write operation methods


_.each(['insert', 'update'], function (methodName) {
  var _super = Mongo.Collection.prototype[methodName];

  Mongo.Collection.prototype[methodName] = function () {
    var self = this,
        options,
        args = _.toArray(arguments);

    options = methodName === "insert" ? args[1] : args[2]; // Support missing options arg

    if (!options || typeof options === "function") {
      options = {};
    }

    if (self._c2 && options.bypassCollection2 !== true) {
      var userId = null;

      try {
        // https://github.com/aldeed/meteor-collection2/issues/175
        userId = Meteor.userId();
      } catch (err) {}

      args = doValidate.call(self, methodName, args, Meteor.isServer || self._connection === null, // getAutoValues
      userId, Meteor.isServer // isFromTrustedCode
      );

      if (!args) {
        // doValidate already called the callback or threw the error so we're done.
        // But insert should always return an ID to match core behavior.
        return methodName === "insert" ? self._makeNewID() : undefined;
      }
    } else {
      // We still need to adjust args because insert does not take options
      if (methodName === "insert" && typeof args[1] !== 'function') args.splice(1, 1);
    }

    return _super.apply(self, args);
  };
}); /*
     * Private
     */

function doValidate(type, args, getAutoValues, userId, isFromTrustedCode) {
  var self = this,
      doc,
      callback,
      error,
      options,
      isUpsert,
      selector,
      last,
      hasCallback;

  if (!args.length) {
    throw new Error(type + " requires an argument");
  } // Gather arguments and cache the selector


  if (type === "insert") {
    doc = args[0];
    options = args[1];
    callback = args[2]; // The real insert doesn't take options

    if (typeof options === "function") {
      args = [doc, options];
    } else if (typeof callback === "function") {
      args = [doc, callback];
    } else {
      args = [doc];
    }
  } else if (type === "update") {
    selector = args[0];
    doc = args[1];
    options = args[2];
    callback = args[3];
  } else {
    throw new Error("invalid type argument");
  }

  var validatedObjectWasInitiallyEmpty = _.isEmpty(doc); // Support missing options arg


  if (!callback && typeof options === "function") {
    callback = options;
    options = {};
  }

  options = options || {};
  last = args.length - 1;
  hasCallback = typeof args[last] === 'function'; // If update was called with upsert:true, flag as an upsert

  isUpsert = type === "update" && options.upsert === true; // we need to pass `doc` and `options` to `simpleSchema` method, that's why
  // schema declaration moved here

  var schema = self.simpleSchema(doc, options, selector);
  var isLocalCollection = self._connection === null; // On the server and for local collections, we allow passing `getAutoValues: false` to disable autoValue functions

  if ((Meteor.isServer || isLocalCollection) && options.getAutoValues === false) {
    getAutoValues = false;
  } // Determine validation context


  var validationContext = options.validationContext;

  if (validationContext) {
    if (typeof validationContext === 'string') {
      validationContext = schema.namedContext(validationContext);
    }
  } else {
    validationContext = schema.namedContext();
  } // Add a default callback function if we're on the client and no callback was given


  if (Meteor.isClient && !callback) {
    // Client can't block, so it can't report errors by exception,
    // only by callback. If they forget the callback, give them a
    // default one that logs the error, so they aren't totally
    // baffled if their writes don't work because their database is
    // down.
    callback = function (err) {
      if (err) {
        Meteor._debug(type + " failed: " + (err.reason || err.stack));
      }
    };
  } // If client validation is fine or is skipped but then something
  // is found to be invalid on the server, we get that error back
  // as a special Meteor.Error that we need to parse.


  if (Meteor.isClient && hasCallback) {
    callback = args[last] = wrapCallbackForParsingServerErrors(validationContext, callback);
  }

  var schemaAllowsId = schema.allowsKey("_id");

  if (type === "insert" && !doc._id && schemaAllowsId) {
    doc._id = self._makeNewID();
  } // Get the docId for passing in the autoValue/custom context


  var docId;

  if (type === 'insert') {
    docId = doc._id; // might be undefined
  } else if (type === "update" && selector) {
    docId = typeof selector === 'string' || selector instanceof Mongo.ObjectID ? selector : selector._id;
  } // If _id has already been added, remove it temporarily if it's
  // not explicitly defined in the schema.


  var cachedId;

  if (doc._id && !schemaAllowsId) {
    cachedId = doc._id;
    delete doc._id;
  }

  function doClean(docToClean, getAutoValues, filter, autoConvert, removeEmptyStrings, trimStrings) {
    // Clean the doc/modifier in place
    schema.clean(docToClean, {
      mutate: true,
      filter: filter,
      autoConvert: autoConvert,
      getAutoValues: getAutoValues,
      isModifier: type !== "insert",
      removeEmptyStrings: removeEmptyStrings,
      trimStrings: trimStrings,
      extendAutoValueContext: _.extend({
        isInsert: type === "insert",
        isUpdate: type === "update" && options.upsert !== true,
        isUpsert: isUpsert,
        userId: userId,
        isFromTrustedCode: isFromTrustedCode,
        docId: docId,
        isLocalCollection: isLocalCollection
      }, options.extendAutoValueContext || {})
    });
  } // Preliminary cleaning on both client and server. On the server and for local
  // collections, automatic values will also be set at this point.


  doClean(doc, getAutoValues, options.filter !== false, options.autoConvert !== false, options.removeEmptyStrings !== false, options.trimStrings !== false); // We clone before validating because in some cases we need to adjust the
  // object a bit before validating it. If we adjusted `doc` itself, our
  // changes would persist into the database.

  var docToValidate = {};

  for (var prop in doc) {
    // We omit prototype properties when cloning because they will not be valid
    // and mongo omits them when saving to the database anyway.
    if (Object.prototype.hasOwnProperty.call(doc, prop)) {
      docToValidate[prop] = doc[prop];
    }
  } // On the server, upserts are possible; SimpleSchema handles upserts pretty
  // well by default, but it will not know about the fields in the selector,
  // which are also stored in the database if an insert is performed. So we
  // will allow these fields to be considered for validation by adding them
  // to the $set in the modifier. This is no doubt prone to errors, but there
  // probably isn't any better way right now.


  if (Meteor.isServer && isUpsert && _.isObject(selector)) {
    var set = docToValidate.$set || {}; // If selector uses $and format, convert to plain object selector

    if (Array.isArray(selector.$and)) {
      const plainSelector = {};
      selector.$and.forEach(sel => {
        _.extend(plainSelector, sel);
      });
      docToValidate.$set = plainSelector;
    } else {
      docToValidate.$set = _.clone(selector);
    }

    if (!schemaAllowsId) delete docToValidate.$set._id;

    _.extend(docToValidate.$set, set);
  } // Set automatic values for validation on the client.
  // On the server, we already updated doc with auto values, but on the client,
  // we will add them to docToValidate for validation purposes only.
  // This is because we want all actual values generated on the server.


  if (Meteor.isClient && !isLocalCollection) {
    doClean(docToValidate, true, false, false, false, false);
  } // XXX Maybe move this into SimpleSchema


  if (!validatedObjectWasInitiallyEmpty && _.isEmpty(docToValidate)) {
    throw new Error('After filtering out keys not in the schema, your ' + (type === 'update' ? 'modifier' : 'object') + ' is now empty');
  } // Validate doc


  var isValid;

  if (options.validate === false) {
    isValid = true;
  } else {
    isValid = validationContext.validate(docToValidate, {
      modifier: type === "update" || type === "upsert",
      upsert: isUpsert,
      extendedCustomContext: _.extend({
        isInsert: type === "insert",
        isUpdate: type === "update" && options.upsert !== true,
        isUpsert: isUpsert,
        userId: userId,
        isFromTrustedCode: isFromTrustedCode,
        docId: docId,
        isLocalCollection: isLocalCollection
      }, options.extendedCustomContext || {})
    });
  }

  if (isValid) {
    // Add the ID back
    if (cachedId) {
      doc._id = cachedId;
    } // Update the args to reflect the cleaned doc
    // XXX not sure this is necessary since we mutate


    if (type === "insert") {
      args[0] = doc;
    } else {
      args[1] = doc;
    } // If callback, set invalidKey when we get a mongo unique error


    if (Meteor.isServer && hasCallback) {
      args[last] = wrapCallbackForParsingMongoValidationErrors(validationContext, args[last]);
    }

    return args;
  } else {
    error = getErrorObject(validationContext);

    if (callback) {
      // insert/update/upsert pass `false` when there's an error, so we do that
      callback(error, false);
    } else {
      throw error;
    }
  }
}

function getErrorObject(context) {
  var message;
  var invalidKeys = typeof context.validationErrors === 'function' ? context.validationErrors() : context.invalidKeys();

  if (invalidKeys.length) {
    message = context.keyErrorMessage(invalidKeys[0].name);
  } else {
    message = "Failed validation";
  }

  var error = new Error(message);
  error.invalidKeys = invalidKeys;
  error.validationContext = context; // If on the server, we add a sanitized error, too, in case we're
  // called from a method.

  if (Meteor.isServer) {
    error.sanitizedError = new Meteor.Error(400, message, EJSON.stringify(error.invalidKeys));
  }

  return error;
}

function addUniqueError(context, errorMessage) {
  var name = errorMessage.split('c2_')[1].split(' ')[0];
  var val = errorMessage.split('dup key:')[1].split('"')[1];
  var addValidationErrorsPropName = typeof context.addValidationErrors === 'function' ? 'addValidationErrors' : 'addInvalidKeys';
  context[addValidationErrorsPropName]([{
    name: name,
    type: 'notUnique',
    value: val
  }]);
}

function wrapCallbackForParsingMongoValidationErrors(validationContext, cb) {
  return function wrappedCallbackForParsingMongoValidationErrors(error) {
    var args = _.toArray(arguments);

    if (error && (error.name === "MongoError" && error.code === 11001 || error.message.indexOf('MongoError: E11000' !== -1)) && error.message.indexOf('c2_') !== -1) {
      addUniqueError(validationContext, error.message);
      args[0] = getErrorObject(validationContext);
    }

    return cb.apply(this, args);
  };
}

function wrapCallbackForParsingServerErrors(validationContext, cb) {
  var addValidationErrorsPropName = typeof validationContext.addValidationErrors === 'function' ? 'addValidationErrors' : 'addInvalidKeys';
  return function wrappedCallbackForParsingServerErrors(error) {
    var args = _.toArray(arguments); // Handle our own validation errors


    if (error instanceof Meteor.Error && error.error === 400 && error.reason === "INVALID" && typeof error.details === "string") {
      var invalidKeysFromServer = EJSON.parse(error.details);
      validationContext[addValidationErrorsPropName](invalidKeysFromServer);
      args[0] = getErrorObject(validationContext);
    } // Handle Mongo unique index errors, which are forwarded to the client as 409 errors
    else if (error instanceof Meteor.Error && error.error === 409 && error.reason && error.reason.indexOf('E11000') !== -1 && error.reason.indexOf('c2_') !== -1) {
        addUniqueError(validationContext, error.reason);
        args[0] = getErrorObject(validationContext);
      }

    return cb.apply(this, args);
  };
}

var alreadyInsecured = {};

function keepInsecure(c) {
  // If insecure package is in use, we need to add allow rules that return
  // true. Otherwise, it would seemingly turn off insecure mode.
  if (Package && Package.insecure && !alreadyInsecured[c._name]) {
    c.allow({
      insert: function () {
        return true;
      },
      update: function () {
        return true;
      },
      remove: function () {
        return true;
      },
      fetch: [],
      transform: null
    });
    alreadyInsecured[c._name] = true;
  } // If insecure package is NOT in use, then adding the two deny functions
  // does not have any effect on the main app's security paradigm. The
  // user will still be required to add at least one allow function of her
  // own for each operation for this collection. And the user may still add
  // additional deny functions, but does not have to.

}

var alreadyDefined = {};

function defineDeny(c, options) {
  if (!alreadyDefined[c._name]) {
    var isLocalCollection = c._connection === null; // First define deny functions to extend doc with the results of clean
    // and autovalues. This must be done with "transform: null" or we would be
    // extending a clone of doc and therefore have no effect.

    c.deny({
      insert: function (userId, doc) {
        // Referenced doc is cleaned in place
        c.simpleSchema(doc).clean(doc, {
          mutate: true,
          isModifier: false,
          // We don't do these here because they are done on the client if desired
          filter: false,
          autoConvert: false,
          removeEmptyStrings: false,
          trimStrings: false,
          extendAutoValueContext: {
            isInsert: true,
            isUpdate: false,
            isUpsert: false,
            userId: userId,
            isFromTrustedCode: false,
            docId: doc._id,
            isLocalCollection: isLocalCollection
          }
        });
        return false;
      },
      update: function (userId, doc, fields, modifier) {
        // Referenced modifier is cleaned in place
        c.simpleSchema(modifier).clean(modifier, {
          mutate: true,
          isModifier: true,
          // We don't do these here because they are done on the client if desired
          filter: false,
          autoConvert: false,
          removeEmptyStrings: false,
          trimStrings: false,
          extendAutoValueContext: {
            isInsert: false,
            isUpdate: true,
            isUpsert: false,
            userId: userId,
            isFromTrustedCode: false,
            docId: doc && doc._id,
            isLocalCollection: isLocalCollection
          }
        });
        return false;
      },
      fetch: ['_id'],
      transform: null
    }); // Second define deny functions to validate again on the server
    // for client-initiated inserts and updates. These should be
    // called after the clean/autovalue functions since we're adding
    // them after. These must *not* have "transform: null" if options.transform is true because
    // we need to pass the doc through any transforms to be sure
    // that custom types are properly recognized for type validation.

    c.deny(_.extend({
      insert: function (userId, doc) {
        // We pass the false options because we will have done them on client if desired
        doValidate.call(c, "insert", [doc, {
          trimStrings: false,
          removeEmptyStrings: false,
          filter: false,
          autoConvert: false
        }, function (error) {
          if (error) {
            throw new Meteor.Error(400, 'INVALID', EJSON.stringify(error.invalidKeys));
          }
        }], false, // getAutoValues
        userId, false // isFromTrustedCode
        );
        return false;
      },
      update: function (userId, doc, fields, modifier) {
        // NOTE: This will never be an upsert because client-side upserts
        // are not allowed once you define allow/deny functions.
        // We pass the false options because we will have done them on client if desired
        doValidate.call(c, "update", [{
          _id: doc && doc._id
        }, modifier, {
          trimStrings: false,
          removeEmptyStrings: false,
          filter: false,
          autoConvert: false
        }, function (error) {
          if (error) {
            throw new Meteor.Error(400, 'INVALID', EJSON.stringify(error.invalidKeys));
          }
        }], false, // getAutoValues
        userId, false // isFromTrustedCode
        );
        return false;
      },
      fetch: ['_id']
    }, options.transform === true ? {} : {
      transform: null
    })); // note that we've already done this collection so that we don't do it again
    // if attachSchema is called again

    alreadyDefined[c._name] = true;
  }
}

module.exportDefault(Collection2);
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("./node_modules/meteor/aldeed:collection2-core/collection2.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['aldeed:collection2-core'] = exports, {
  Collection2: Collection2
});

})();

//# sourceURL=meteor://💻app/packages/aldeed_collection2-core.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvYWxkZWVkOmNvbGxlY3Rpb24yLWNvcmUvY29sbGVjdGlvbjIuanMiXSwibmFtZXMiOlsiRXZlbnRFbWl0dGVyIiwibW9kdWxlIiwid2F0Y2giLCJyZXF1aXJlIiwidiIsIk1ldGVvciIsIkVKU09OIiwiXyIsImNoZWNrTnBtVmVyc2lvbnMiLCJTaW1wbGVTY2hlbWEiLCJkZWZhdWx0IiwiQ29sbGVjdGlvbjIiLCJNb25nbyIsIkNvbGxlY3Rpb24iLCJwcm90b3R5cGUiLCJhdHRhY2hTY2hlbWEiLCJjMkF0dGFjaFNjaGVtYSIsInNzIiwib3B0aW9ucyIsInNlbGYiLCJfYzIiLCJfc2ltcGxlU2NoZW1hIiwicmVwbGFjZSIsInZlcnNpb24iLCJuZXdTUyIsImV4dGVuZCIsInNlbGVjdG9yIiwiYXR0YWNoVG8iLCJvYmoiLCJzY2hlbWFJbmRleCIsIl9zaW1wbGVTY2hlbWFzIiwiZm9yRWFjaCIsInNjaGVtYSIsImluZGV4IiwiaXNFcXVhbCIsInB1c2giLCJfY29sbGVjdGlvbiIsIkxvY2FsQ29sbGVjdGlvbiIsImRlZmluZURlbnkiLCJrZWVwSW5zZWN1cmUiLCJlbWl0IiwiZWFjaCIsInNpbXBsZVNjaGVtYSIsImRvYyIsInF1ZXJ5Iiwic2NoZW1hcyIsImxlbmd0aCIsIkVycm9yIiwidGFyZ2V0IiwiaSIsIk9iamVjdCIsImtleXMiLCJ1bmRlZmluZWQiLCIkc2V0IiwibWV0aG9kTmFtZSIsIl9zdXBlciIsImFyZ3MiLCJ0b0FycmF5IiwiYXJndW1lbnRzIiwiYnlwYXNzQ29sbGVjdGlvbjIiLCJ1c2VySWQiLCJlcnIiLCJkb1ZhbGlkYXRlIiwiY2FsbCIsImlzU2VydmVyIiwiX2Nvbm5lY3Rpb24iLCJfbWFrZU5ld0lEIiwic3BsaWNlIiwiYXBwbHkiLCJ0eXBlIiwiZ2V0QXV0b1ZhbHVlcyIsImlzRnJvbVRydXN0ZWRDb2RlIiwiY2FsbGJhY2siLCJlcnJvciIsImlzVXBzZXJ0IiwibGFzdCIsImhhc0NhbGxiYWNrIiwidmFsaWRhdGVkT2JqZWN0V2FzSW5pdGlhbGx5RW1wdHkiLCJpc0VtcHR5IiwidXBzZXJ0IiwiaXNMb2NhbENvbGxlY3Rpb24iLCJ2YWxpZGF0aW9uQ29udGV4dCIsIm5hbWVkQ29udGV4dCIsImlzQ2xpZW50IiwiX2RlYnVnIiwicmVhc29uIiwic3RhY2siLCJ3cmFwQ2FsbGJhY2tGb3JQYXJzaW5nU2VydmVyRXJyb3JzIiwic2NoZW1hQWxsb3dzSWQiLCJhbGxvd3NLZXkiLCJfaWQiLCJkb2NJZCIsIk9iamVjdElEIiwiY2FjaGVkSWQiLCJkb0NsZWFuIiwiZG9jVG9DbGVhbiIsImZpbHRlciIsImF1dG9Db252ZXJ0IiwicmVtb3ZlRW1wdHlTdHJpbmdzIiwidHJpbVN0cmluZ3MiLCJjbGVhbiIsIm11dGF0ZSIsImlzTW9kaWZpZXIiLCJleHRlbmRBdXRvVmFsdWVDb250ZXh0IiwiaXNJbnNlcnQiLCJpc1VwZGF0ZSIsImRvY1RvVmFsaWRhdGUiLCJwcm9wIiwiaGFzT3duUHJvcGVydHkiLCJpc09iamVjdCIsInNldCIsIkFycmF5IiwiaXNBcnJheSIsIiRhbmQiLCJwbGFpblNlbGVjdG9yIiwic2VsIiwiY2xvbmUiLCJpc1ZhbGlkIiwidmFsaWRhdGUiLCJtb2RpZmllciIsImV4dGVuZGVkQ3VzdG9tQ29udGV4dCIsIndyYXBDYWxsYmFja0ZvclBhcnNpbmdNb25nb1ZhbGlkYXRpb25FcnJvcnMiLCJnZXRFcnJvck9iamVjdCIsImNvbnRleHQiLCJtZXNzYWdlIiwiaW52YWxpZEtleXMiLCJ2YWxpZGF0aW9uRXJyb3JzIiwia2V5RXJyb3JNZXNzYWdlIiwibmFtZSIsInNhbml0aXplZEVycm9yIiwic3RyaW5naWZ5IiwiYWRkVW5pcXVlRXJyb3IiLCJlcnJvck1lc3NhZ2UiLCJzcGxpdCIsInZhbCIsImFkZFZhbGlkYXRpb25FcnJvcnNQcm9wTmFtZSIsImFkZFZhbGlkYXRpb25FcnJvcnMiLCJ2YWx1ZSIsImNiIiwid3JhcHBlZENhbGxiYWNrRm9yUGFyc2luZ01vbmdvVmFsaWRhdGlvbkVycm9ycyIsImNvZGUiLCJpbmRleE9mIiwid3JhcHBlZENhbGxiYWNrRm9yUGFyc2luZ1NlcnZlckVycm9ycyIsImRldGFpbHMiLCJpbnZhbGlkS2V5c0Zyb21TZXJ2ZXIiLCJwYXJzZSIsImFscmVhZHlJbnNlY3VyZWQiLCJjIiwiUGFja2FnZSIsImluc2VjdXJlIiwiX25hbWUiLCJhbGxvdyIsImluc2VydCIsInVwZGF0ZSIsInJlbW92ZSIsImZldGNoIiwidHJhbnNmb3JtIiwiYWxyZWFkeURlZmluZWQiLCJkZW55IiwiZmllbGRzIiwiZXhwb3J0RGVmYXVsdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFJQSxZQUFKO0FBQWlCQyxPQUFPQyxLQUFQLENBQWFDLFFBQVEsMEJBQVIsQ0FBYixFQUFpRDtBQUFDSCxlQUFhSSxDQUFiLEVBQWU7QUFBQ0osbUJBQWFJLENBQWI7QUFBZTs7QUFBaEMsQ0FBakQsRUFBbUYsQ0FBbkY7QUFBc0YsSUFBSUMsTUFBSjtBQUFXSixPQUFPQyxLQUFQLENBQWFDLFFBQVEsZUFBUixDQUFiLEVBQXNDO0FBQUNFLFNBQU9ELENBQVAsRUFBUztBQUFDQyxhQUFPRCxDQUFQO0FBQVM7O0FBQXBCLENBQXRDLEVBQTRELENBQTVEO0FBQStELElBQUlFLEtBQUo7QUFBVUwsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLGNBQVIsQ0FBYixFQUFxQztBQUFDRyxRQUFNRixDQUFOLEVBQVE7QUFBQ0UsWUFBTUYsQ0FBTjtBQUFROztBQUFsQixDQUFyQyxFQUF5RCxDQUF6RDs7QUFBNEQsSUFBSUcsQ0FBSjs7QUFBTU4sT0FBT0MsS0FBUCxDQUFhQyxRQUFRLG1CQUFSLENBQWIsRUFBMEM7QUFBQ0ksSUFBRUgsQ0FBRixFQUFJO0FBQUNHLFFBQUVILENBQUY7QUFBSTs7QUFBVixDQUExQyxFQUFzRCxDQUF0RDtBQUF5RCxJQUFJSSxnQkFBSjtBQUFxQlAsT0FBT0MsS0FBUCxDQUFhQyxRQUFRLG9DQUFSLENBQWIsRUFBMkQ7QUFB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LEVBa0JFLEtBbEJGLEVBa0JTO0FBQ1BqRSxjQW5CRixFQW9CRSxLQXBCRixDQW9CUTtBQXBCUjtBQXVCQSxlQUFPLEtBQVA7QUFDRCxPQXZEYTtBQXdEZCtGLGFBQU8sQ0FBQyxLQUFEO0FBeERPLEtBQVQsRUF5REp6SSxRQUFRMEksU0FBUixLQUFzQixJQUF0QixHQUE2QixFQUE3QixHQUFrQztBQUFDQSxpQkFBVztBQUFaLEtBekQ5QixDQUFQLEVBaEU0QixDQTJINUI7QUFDQTs7QUFDQUMsbUJBQWVWLEVBQUVHLEtBQWpCLElBQTBCLElBQTFCO0FBQ0Q7QUFDRjs7QUF6cUJEckosT0FBTytKLGFBQVAsQ0EycUJlckosV0EzcUJmLEUiLCJmaWxlIjoiL3BhY2thZ2VzL2FsZGVlZF9jb2xsZWN0aW9uMi1jb3JlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnbWV0ZW9yL3JhaXg6ZXZlbnRlbWl0dGVyJztcbmltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgRUpTT04gfSBmcm9tICdtZXRlb3IvZWpzb24nO1xuaW1wb3J0IHsgXyB9IGZyb20gJ21ldGVvci91bmRlcnNjb3JlJztcbmltcG9ydCB7IGNoZWNrTnBtVmVyc2lvbnMgfSBmcm9tICdtZXRlb3IvdG1lYXNkYXk6Y2hlY2stbnBtLXZlcnNpb25zJztcblxuY2hlY2tOcG1WZXJzaW9ucyh7ICdzaW1wbC1zY2hlbWEnOiAnPj0wLjAuMCcgfSwgJ2FsZGVlZDptZXRlb3ItY29sbGVjdGlvbjItY29yZScpO1xuXG5jb25zdCBTaW1wbGVTY2hlbWEgPSByZXF1aXJlKCdzaW1wbC1zY2hlbWEnKS5kZWZhdWx0O1xuXG4vLyBFeHBvcnRlZCBvbmx5IGZvciBsaXN0ZW5pbmcgdG8gZXZlbnRzXG5jb25zdCBDb2xsZWN0aW9uMiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuLyoqXG4gKiBNb25nby5Db2xsZWN0aW9uLnByb3RvdHlwZS5hdHRhY2hTY2hlbWFcbiAqIEBwYXJhbSB7U2ltcGxlU2NoZW1hfE9iamVjdH0gc3MgLSBTaW1wbGVTY2hlbWEgaW5zdGFuY2Ugb3IgYSBzY2hlbWEgZGVmaW5pdGlvbiBvYmplY3RcbiAqICAgIGZyb20gd2hpY2ggdG8gY3JlYXRlIGEgbmV3IFNpbXBsZVNjaGVtYSBpbnN0YW5jZVxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy50cmFuc2Zvcm09ZmFsc2VdIFNldCB0byBgdHJ1ZWAgaWYgeW91ciBkb2N1bWVudCBtdXN0IGJlIHBhc3NlZFxuICogICAgdGhyb3VnaCB0aGUgY29sbGVjdGlvbidzIHRyYW5zZm9ybSB0byBwcm9wZXJseSB2YWxpZGF0ZS5cbiAqIEBwYXJhbSB7Qm9vbGVhbn0gW29wdGlvbnMucmVwbGFjZT1mYWxzZV0gU2V0IHRvIGB0cnVlYCB0byByZXBsYWNlIGFueSBleGlzdGluZyBzY2hlbWEgaW5zdGVhZCBvZiBjb21iaW5pbmdcbiAqIEByZXR1cm4ge3VuZGVmaW5lZH1cbiAqXG4gKiBVc2UgdGhpcyBtZXRob2QgdG8gYXR0YWNoIGEgc2NoZW1hIHRvIGEgY29sbGVjdGlvbiBjcmVhdGVkIGJ5IGFub3RoZXIgcGFja2FnZSxcbiAqIHN1Y2ggYXMgTWV0ZW9yLnVzZXJzLiBJdCBpcyBtb3N0IGxpa2VseSB1bnNhZmUgdG8gY2FsbCB0aGlzIG1ldGhvZCBtb3JlIHRoYW5cbiAqIG9uY2UgZm9yIGEgc2luZ2xlIGNvbGxlY3Rpb24sIG9yIHRvIGNhbGwgdGhpcyBmb3IgYSBjb2xsZWN0aW9uIHRoYXQgaGFkIGFcbiAqIHNjaGVtYSBvYmplY3QgcGFzc2VkIHRvIGl0cyBjb25zdHJ1Y3Rvci5cbiAqL1xuTW9uZ28uQ29sbGVjdGlvbi5wcm90b3R5cGUuYXR0YWNoU2NoZW1hID0gZnVuY3Rpb24gYzJBdHRhY2hTY2hlbWEoc3MsIG9wdGlvbnMpIHtcbiAgdmFyIHNlbGYgPSB0aGlzO1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAvLyBBbGxvdyBwYXNzaW5nIGp1c3QgdGhlIHNjaGVtYSBvYmplY3RcbiAgaWYgKCEoc3MgaW5zdGFuY2VvZiBTaW1wbGVTY2hlbWEpKSB7XG4gICAgc3MgPSBuZXcgU2ltcGxlU2NoZW1hKHNzKTtcbiAgfVxuXG4gIHNlbGYuX2MyID0gc2VsZi5fYzIgfHwge307XG5cbiAgLy8gSWYgd2UndmUgYWxyZWFkeSBhdHRhY2hlZCBvbmUgc2NoZW1hLCB3ZSBjb21iaW5lIGJvdGggaW50byBhIG5ldyBzY2hlbWEgdW5sZXNzIG9wdGlvbnMucmVwbGFjZSBpcyBgdHJ1ZWBcbiAgaWYgKHNlbGYuX2MyLl9zaW1wbGVTY2hlbWEgJiYgb3B0aW9ucy5yZXBsYWNlICE9PSB0cnVlKSB7XG4gICAgaWYgKHNzLnZlcnNpb24gPj0gMikge1xuICAgICAgdmFyIG5ld1NTID0gbmV3IFNpbXBsZVNjaGVtYShzZWxmLl9jMi5fc2ltcGxlU2NoZW1hKTtcbiAgICAgIG5ld1NTLmV4dGVuZChzcyk7XG4gICAgICBzcyA9IG5ld1NTO1xuICAgIH0gZWxzZSB7XG4gICAgICBzcyA9IG5ldyBTaW1wbGVTY2hlbWEoW3NlbGYuX2MyLl9zaW1wbGVTY2hlbWEsIHNzXSk7XG4gICAgfVxuICB9XG5cbiAgdmFyIHNlbGVjdG9yID0gb3B0aW9ucy5zZWxlY3RvcjtcblxuICBmdW5jdGlvbiBhdHRhY2hUbyhvYmopIHtcbiAgICBpZiAodHlwZW9mIHNlbGVjdG9yID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAvLyBJbmRleCBvZiBleGlzdGluZyBzY2hlbWEgd2l0aCBpZGVudGljYWwgc2VsZWN0b3JcbiAgICAgIHZhciBzY2hlbWFJbmRleCA9IC0xO1xuXG4gICAgICAvLyB3ZSBuZWVkIGFuIGFycmF5IHRvIGhvbGQgbXVsdGlwbGUgc2NoZW1hc1xuICAgICAgb2JqLl9jMi5fc2ltcGxlU2NoZW1hcyA9IG9iai5fYzIuX3NpbXBsZVNjaGVtYXMgfHwgW107XG5cbiAgICAgIC8vIExvb3AgdGhyb3VnaCBleGlzdGluZyBzY2hlbWFzIHdpdGggc2VsZWN0b3JzXG4gICAgICBvYmouX2MyLl9zaW1wbGVTY2hlbWFzLmZvckVhY2goZnVuY3Rpb24gKHNjaGVtYSwgaW5kZXgpIHtcbiAgICAgICAgLy8gaWYgd2UgZmluZCBhIHNjaGVtYSB3aXRoIGFuIGlkZW50aWNhbCBzZWxlY3Rvciwgc2F2ZSBpdCdzIGluZGV4XG4gICAgICAgIGlmKF8uaXNFcXVhbChzY2hlbWEuc2VsZWN0b3IsIHNlbGVjdG9yKSkge1xuICAgICAgICAgIHNjaGVtYUluZGV4ID0gaW5kZXg7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKHNjaGVtYUluZGV4ID09PSAtMSkge1xuICAgICAgICAvLyBXZSBkaWRuJ3QgZmluZCB0aGUgc2NoZW1hIGluIG91ciBhcnJheSAtIHB1c2ggaXQgaW50byB0aGUgYXJyYXlcbiAgICAgICAgb2JqLl9jMi5fc2ltcGxlU2NoZW1hcy5wdXNoKHtcbiAgICAgICAgICBzY2hlbWE6IG5ldyBTaW1wbGVTY2hlbWEoc3MpLFxuICAgICAgICAgIHNlbGVjdG9yOiBzZWxlY3RvcixcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBXZSBmb3VuZCBhIHNjaGVtYSB3aXRoIGFuIGlkZW50aWNhbCBzZWxlY3RvciBpbiBvdXIgYXJyYXksXG4gICAgICAgIGlmIChvcHRpb25zLnJlcGxhY2UgIT09IHRydWUpIHtcbiAgICAgICAgICAvLyBNZXJnZSB3aXRoIGV4aXN0aW5nIHNjaGVtYSB1bmxlc3Mgb3B0aW9ucy5yZXBsYWNlIGlzIGB0cnVlYFxuICAgICAgICAgIGlmIChvYmouX2MyLl9zaW1wbGVTY2hlbWFzW3NjaGVtYUluZGV4XS5zY2hlbWEudmVyc2lvbiA+PSAyKSB7XG4gICAgICAgICAgICBvYmouX2MyLl9zaW1wbGVTY2hlbWFzW3NjaGVtYUluZGV4XS5zY2hlbWEuZXh0ZW5kKHNzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgb2JqLl9jMi5fc2ltcGxlU2NoZW1hc1tzY2hlbWFJbmRleF0uc2NoZW1hID0gbmV3IFNpbXBsZVNjaGVtYShbb2JqLl9jMi5fc2ltcGxlU2NoZW1hc1tzY2hlbWFJbmRleF0uc2NoZW1hLCBzc10pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBJZiBvcHRpb25zLnJlcGFsY2UgaXMgYHRydWVgIHJlcGxhY2UgZXhpc3Rpbmcgc2NoZW1hIHdpdGggbmV3IHNjaGVtYVxuICAgICAgICAgIG9iai5fYzIuX3NpbXBsZVNjaGVtYXNbc2NoZW1hSW5kZXhdLnNjaGVtYSA9IHNzO1xuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgICAgLy8gUmVtb3ZlIGV4aXN0aW5nIHNjaGVtYXMgd2l0aG91dCBzZWxlY3RvclxuICAgICAgZGVsZXRlIG9iai5fYzIuX3NpbXBsZVNjaGVtYTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVHJhY2sgdGhlIHNjaGVtYSBpbiB0aGUgY29sbGVjdGlvblxuICAgICAgb2JqLl9jMi5fc2ltcGxlU2NoZW1hID0gc3M7XG5cbiAgICAgIC8vIFJlbW92ZSBleGlzdGluZyBzY2hlbWFzIHdpdGggc2VsZWN0b3JcbiAgICAgIGRlbGV0ZSBvYmouX2MyLl9zaW1wbGVTY2hlbWFzO1xuICAgIH1cbiAgfVxuXG4gIGF0dGFjaFRvKHNlbGYpO1xuICAvLyBBdHRhY2ggdGhlIHNjaGVtYSB0byB0aGUgdW5kZXJseWluZyBMb2NhbENvbGxlY3Rpb24sIHRvb1xuICBpZiAoc2VsZi5fY29sbGVjdGlvbiBpbnN0YW5jZW9mIExvY2FsQ29sbGVjdGlvbikge1xuICAgIHNlbGYuX2NvbGxlY3Rpb24uX2MyID0gc2VsZi5fY29sbGVjdGlvbi5fYzIgfHwge307XG4gICAgYXR0YWNoVG8oc2VsZi5fY29sbGVjdGlvbik7XG4gIH1cblxuICBkZWZpbmVEZW55KHNlbGYsIG9wdGlvbnMpO1xuICBrZWVwSW5zZWN1cmUoc2VsZik7XG5cbiAgQ29sbGVjdGlvbjIuZW1pdCgnc2NoZW1hLmF0dGFjaGVkJywgc2VsZiwgc3MsIG9wdGlvbnMpO1xufTtcblxuXy5lYWNoKFtNb25nby5Db2xsZWN0aW9uLCBMb2NhbENvbGxlY3Rpb25dLCBmdW5jdGlvbiAob2JqKSB7XG4gIC8qKlxuICAgKiBzaW1wbGVTY2hlbWFcbiAgICogQGRlc2NyaXB0aW9uIGZ1bmN0aW9uIGRldGVjdCB0aGUgY29ycmVjdCBzY2hlbWEgYnkgZ2l2ZW4gcGFyYW1zLiBJZiBpdFxuICAgKiBkZXRlY3QgbXVsdGktc2NoZW1hIHByZXNlbmNlIGluIGBzZWxmYCwgdGhlbiBpdCBtYWRlIGFuIGF0dGVtcHQgdG8gZmluZCBhXG4gICAqIGBzZWxlY3RvcmAgaW4gYXJnc1xuICAgKiBAcGFyYW0ge09iamVjdH0gZG9jIC0gSXQgY291bGQgYmUgPHVwZGF0ZT4gb24gdXBkYXRlL3Vwc2VydCBvciBkb2N1bWVudFxuICAgKiBpdHNlbGYgb24gaW5zZXJ0L3JlbW92ZVxuICAgKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnNdIC0gSXQgY291bGQgYmUgPHVwZGF0ZT4gb24gdXBkYXRlL3Vwc2VydCBldGNcbiAgICogQHBhcmFtIHtPYmplY3R9IFtxdWVyeV0gLSBpdCBjb3VsZCBiZSA8cXVlcnk+IG9uIHVwZGF0ZS91cHNlcnRcbiAgICogQHJldHVybiB7T2JqZWN0fSBTY2hlbWFcbiAgICovXG4gIG9iai5wcm90b3R5cGUuc2ltcGxlU2NoZW1hID0gZnVuY3Rpb24gKGRvYywgb3B0aW9ucywgcXVlcnkpIHtcbiAgICBpZiAoIXRoaXMuX2MyKSByZXR1cm4gbnVsbDtcbiAgICBpZiAodGhpcy5fYzIuX3NpbXBsZVNjaGVtYSkgcmV0dXJuIHRoaXMuX2MyLl9zaW1wbGVTY2hlbWE7XG5cbiAgICB2YXIgc2NoZW1hcyA9IHRoaXMuX2MyLl9zaW1wbGVTY2hlbWFzO1xuICAgIGlmIChzY2hlbWFzICYmIHNjaGVtYXMubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKCFkb2MpIHRocm93IG5ldyBFcnJvcignY29sbGVjdGlvbi5zaW1wbGVTY2hlbWEoKSByZXF1aXJlcyBkb2MgYXJndW1lbnQgd2hlbiB0aGVyZSBhcmUgbXVsdGlwbGUgc2NoZW1hcycpO1xuXG4gICAgICB2YXIgc2NoZW1hLCBzZWxlY3RvciwgdGFyZ2V0O1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzY2hlbWFzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHNjaGVtYSA9IHNjaGVtYXNbaV07XG4gICAgICAgIHNlbGVjdG9yID0gT2JqZWN0LmtleXMoc2NoZW1hLnNlbGVjdG9yKVswXTtcblxuICAgICAgICAvLyBXZSB3aWxsIHNldCB0aGlzIHRvIHVuZGVmaW5lZCBiZWNhdXNlIGluIHRoZW9yeSB5b3UgbWlnaHQgd2FudCB0byBzZWxlY3RcbiAgICAgICAgLy8gb24gYSBudWxsIHZhbHVlLlxuICAgICAgICB0YXJnZXQgPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgLy8gaGVyZSB3ZSBhcmUgbG9va2luZyBmb3Igc2VsZWN0b3IgaW4gZGlmZmVyZW50IHBsYWNlc1xuICAgICAgICAvLyAkc2V0IHNob3VsZCBoYXZlIG1vcmUgcHJpb3JpdHkgaGVyZVxuICAgICAgICBpZiAoZG9jLiRzZXQgJiYgdHlwZW9mIGRvYy4kc2V0W3NlbGVjdG9yXSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICB0YXJnZXQgPSBkb2MuJHNldFtzZWxlY3Rvcl07XG4gICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGRvY1tzZWxlY3Rvcl0gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgdGFyZ2V0ID0gZG9jW3NlbGVjdG9yXTtcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zICYmIG9wdGlvbnMuc2VsZWN0b3IpIHtcbiAgICAgICAgICB0YXJnZXQgPSBvcHRpb25zLnNlbGVjdG9yW3NlbGVjdG9yXTtcbiAgICAgICAgfSBlbHNlIGlmIChxdWVyeSAmJiBxdWVyeVtzZWxlY3Rvcl0pIHsgLy8gb24gdXBzZXJ0L3VwZGF0ZSBvcGVyYXRpb25zXG4gICAgICAgICAgdGFyZ2V0ID0gcXVlcnlbc2VsZWN0b3JdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gd2UgbmVlZCB0byBjb21wYXJlIGdpdmVuIHNlbGVjdG9yIHdpdGggZG9jIHByb3BlcnR5IG9yIG9wdGlvbiB0b1xuICAgICAgICAvLyBmaW5kIHJpZ2h0IHNjaGVtYVxuICAgICAgICBpZiAodGFyZ2V0ICE9PSB1bmRlZmluZWQgJiYgdGFyZ2V0ID09PSBzY2hlbWEuc2VsZWN0b3Jbc2VsZWN0b3JdKSB7XG4gICAgICAgICAgcmV0dXJuIHNjaGVtYS5zY2hlbWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbiAgfTtcbn0pO1xuXG4vLyBXcmFwIERCIHdyaXRlIG9wZXJhdGlvbiBtZXRob2RzXG5fLmVhY2goWydpbnNlcnQnLCAndXBkYXRlJ10sIGZ1bmN0aW9uKG1ldGhvZE5hbWUpIHtcbiAgdmFyIF9zdXBlciA9IE1vbmdvLkNvbGxlY3Rpb24ucHJvdG90eXBlW21ldGhvZE5hbWVdO1xuICBNb25nby5Db2xsZWN0aW9uLnByb3RvdHlwZVttZXRob2ROYW1lXSA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBzZWxmID0gdGhpcywgb3B0aW9ucyxcbiAgICAgICAgYXJncyA9IF8udG9BcnJheShhcmd1bWVudHMpO1xuXG4gICAgb3B0aW9ucyA9IChtZXRob2ROYW1lID09PSBcImluc2VydFwiKSA/IGFyZ3NbMV0gOiBhcmdzWzJdO1xuXG4gICAgLy8gU3VwcG9ydCBtaXNzaW5nIG9wdGlvbnMgYXJnXG4gICAgaWYgKCFvcHRpb25zIHx8IHR5cGVvZiBvcHRpb25zID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICBpZiAoc2VsZi5fYzIgJiYgb3B0aW9ucy5ieXBhc3NDb2xsZWN0aW9uMiAhPT0gdHJ1ZSkge1xuICAgICAgdmFyIHVzZXJJZCA9IG51bGw7XG4gICAgICB0cnkgeyAvLyBodHRwczovL2dpdGh1Yi5jb20vYWxkZWVkL21ldGVvci1jb2xsZWN0aW9uMi9pc3N1ZXMvMTc1XG4gICAgICAgIHVzZXJJZCA9IE1ldGVvci51c2VySWQoKTtcbiAgICAgIH0gY2F0Y2ggKGVycikge31cblxuICAgICAgYXJncyA9IGRvVmFsaWRhdGUuY2FsbChcbiAgICAgICAgc2VsZixcbiAgICAgICAgbWV0aG9kTmFtZSxcbiAgICAgICAgYXJncyxcbiAgICAgICAgTWV0ZW9yLmlzU2VydmVyIHx8IHNlbGYuX2Nvbm5lY3Rpb24gPT09IG51bGwsIC8vIGdldEF1dG9WYWx1ZXNcbiAgICAgICAgdXNlcklkLFxuICAgICAgICBNZXRlb3IuaXNTZXJ2ZXIgLy8gaXNGcm9tVHJ1c3RlZENvZGVcbiAgICAgICk7XG4gICAgICBpZiAoIWFyZ3MpIHtcbiAgICAgICAgLy8gZG9WYWxpZGF0ZSBhbHJlYWR5IGNhbGxlZCB0aGUgY2FsbGJhY2sgb3IgdGhyZXcgdGhlIGVycm9yIHNvIHdlJ3JlIGRvbmUuXG4gICAgICAgIC8vIEJ1dCBpbnNlcnQgc2hvdWxkIGFsd2F5cyByZXR1cm4gYW4gSUQgdG8gbWF0Y2ggY29yZSBiZWhhdmlvci5cbiAgICAgICAgcmV0dXJuIG1ldGhvZE5hbWUgPT09IFwiaW5zZXJ0XCIgPyBzZWxmLl9tYWtlTmV3SUQoKSA6IHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gV2Ugc3RpbGwgbmVlZCB0byBhZGp1c3QgYXJncyBiZWNhdXNlIGluc2VydCBkb2VzIG5vdCB0YWtlIG9wdGlvbnNcbiAgICAgIGlmIChtZXRob2ROYW1lID09PSBcImluc2VydFwiICYmIHR5cGVvZiBhcmdzWzFdICE9PSAnZnVuY3Rpb24nKSBhcmdzLnNwbGljZSgxLCAxKTtcbiAgICB9XG5cbiAgICByZXR1cm4gX3N1cGVyLmFwcGx5KHNlbGYsIGFyZ3MpO1xuICB9O1xufSk7XG5cbi8qXG4gKiBQcml2YXRlXG4gKi9cblxuZnVuY3Rpb24gZG9WYWxpZGF0ZSh0eXBlLCBhcmdzLCBnZXRBdXRvVmFsdWVzLCB1c2VySWQsIGlzRnJvbVRydXN0ZWRDb2RlKSB7XG4gIHZhciBzZWxmID0gdGhpcywgZG9jLCBjYWxsYmFjaywgZXJyb3IsIG9wdGlvbnMsIGlzVXBzZXJ0LCBzZWxlY3RvciwgbGFzdCwgaGFzQ2FsbGJhY2s7XG5cbiAgaWYgKCFhcmdzLmxlbmd0aCkge1xuICAgIHRocm93IG5ldyBFcnJvcih0eXBlICsgXCIgcmVxdWlyZXMgYW4gYXJndW1lbnRcIik7XG4gIH1cblxuICAvLyBHYXRoZXIgYXJndW1lbnRzIGFuZCBjYWNoZSB0aGUgc2VsZWN0b3JcbiAgaWYgKHR5cGUgPT09IFwiaW5zZXJ0XCIpIHtcbiAgICBkb2MgPSBhcmdzWzBdO1xuICAgIG9wdGlvbnMgPSBhcmdzWzFdO1xuICAgIGNhbGxiYWNrID0gYXJnc1syXTtcblxuICAgIC8vIFRoZSByZWFsIGluc2VydCBkb2Vzbid0IHRha2Ugb3B0aW9uc1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICBhcmdzID0gW2RvYywgb3B0aW9uc107XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgY2FsbGJhY2sgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgYXJncyA9IFtkb2MsIGNhbGxiYWNrXTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXJncyA9IFtkb2NdO1xuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlID09PSBcInVwZGF0ZVwiKSB7XG4gICAgc2VsZWN0b3IgPSBhcmdzWzBdO1xuICAgIGRvYyA9IGFyZ3NbMV07XG4gICAgb3B0aW9ucyA9IGFyZ3NbMl07XG4gICAgY2FsbGJhY2sgPSBhcmdzWzNdO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcihcImludmFsaWQgdHlwZSBhcmd1bWVudFwiKTtcbiAgfVxuXG4gIHZhciB2YWxpZGF0ZWRPYmplY3RXYXNJbml0aWFsbHlFbXB0eSA9IF8uaXNFbXB0eShkb2MpO1xuXG4gIC8vIFN1cHBvcnQgbWlzc2luZyBvcHRpb25zIGFyZ1xuICBpZiAoIWNhbGxiYWNrICYmIHR5cGVvZiBvcHRpb25zID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICBjYWxsYmFjayA9IG9wdGlvbnM7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gIGxhc3QgPSBhcmdzLmxlbmd0aCAtIDE7XG5cbiAgaGFzQ2FsbGJhY2sgPSAodHlwZW9mIGFyZ3NbbGFzdF0gPT09ICdmdW5jdGlvbicpO1xuXG4gIC8vIElmIHVwZGF0ZSB3YXMgY2FsbGVkIHdpdGggdXBzZXJ0OnRydWUsIGZsYWcgYXMgYW4gdXBzZXJ0XG4gIGlzVXBzZXJ0ID0gKHR5cGUgPT09IFwidXBkYXRlXCIgJiYgb3B0aW9ucy51cHNlcnQgPT09IHRydWUpO1xuXG4gIC8vIHdlIG5lZWQgdG8gcGFzcyBgZG9jYCBhbmQgYG9wdGlvbnNgIHRvIGBzaW1wbGVTY2hlbWFgIG1ldGhvZCwgdGhhdCdzIHdoeVxuICAvLyBzY2hlbWEgZGVjbGFyYXRpb24gbW92ZWQgaGVyZVxuICB2YXIgc2NoZW1hID0gc2VsZi5zaW1wbGVTY2hlbWEoZG9jLCBvcHRpb25zLCBzZWxlY3Rvcik7XG4gIHZhciBpc0xvY2FsQ29sbGVjdGlvbiA9IChzZWxmLl9jb25uZWN0aW9uID09PSBudWxsKTtcblxuICAvLyBPbiB0aGUgc2VydmVyIGFuZCBmb3IgbG9jYWwgY29sbGVjdGlvbnMsIHdlIGFsbG93IHBhc3NpbmcgYGdldEF1dG9WYWx1ZXM6IGZhbHNlYCB0byBkaXNhYmxlIGF1dG9WYWx1ZSBmdW5jdGlvbnNcbiAgaWYgKChNZXRlb3IuaXNTZXJ2ZXIgfHwgaXNMb2NhbENvbGxlY3Rpb24pICYmIG9wdGlvbnMuZ2V0QXV0b1ZhbHVlcyA9PT0gZmFsc2UpIHtcbiAgICBnZXRBdXRvVmFsdWVzID0gZmFsc2U7XG4gIH1cblxuICAvLyBEZXRlcm1pbmUgdmFsaWRhdGlvbiBjb250ZXh0XG4gIHZhciB2YWxpZGF0aW9uQ29udGV4dCA9IG9wdGlvbnMudmFsaWRhdGlvbkNvbnRleHQ7XG4gIGlmICh2YWxpZGF0aW9uQ29udGV4dCkge1xuICAgIGlmICh0eXBlb2YgdmFsaWRhdGlvbkNvbnRleHQgPT09ICdzdHJpbmcnKSB7XG4gICAgICB2YWxpZGF0aW9uQ29udGV4dCA9IHNjaGVtYS5uYW1lZENvbnRleHQodmFsaWRhdGlvbkNvbnRleHQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YWxpZGF0aW9uQ29udGV4dCA9IHNjaGVtYS5uYW1lZENvbnRleHQoKTtcbiAgfVxuXG4gIC8vIEFkZCBhIGRlZmF1bHQgY2FsbGJhY2sgZnVuY3Rpb24gaWYgd2UncmUgb24gdGhlIGNsaWVudCBhbmQgbm8gY2FsbGJhY2sgd2FzIGdpdmVuXG4gIGlmIChNZXRlb3IuaXNDbGllbnQgJiYgIWNhbGxiYWNrKSB7XG4gICAgLy8gQ2xpZW50IGNhbid0IGJsb2NrLCBzbyBpdCBjYW4ndCByZXBvcnQgZXJyb3JzIGJ5IGV4Y2VwdGlvbixcbiAgICAvLyBvbmx5IGJ5IGNhbGxiYWNrLiBJZiB0aGV5IGZvcmdldCB0aGUgY2FsbGJhY2ssIGdpdmUgdGhlbSBhXG4gICAgLy8gZGVmYXVsdCBvbmUgdGhhdCBsb2dzIHRoZSBlcnJvciwgc28gdGhleSBhcmVuJ3QgdG90YWxseVxuICAgIC8vIGJhZmZsZWQgaWYgdGhlaXIgd3JpdGVzIGRvbid0IHdvcmsgYmVjYXVzZSB0aGVpciBkYXRhYmFzZSBpc1xuICAgIC8vIGRvd24uXG4gICAgY2FsbGJhY2sgPSBmdW5jdGlvbihlcnIpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgTWV0ZW9yLl9kZWJ1Zyh0eXBlICsgXCIgZmFpbGVkOiBcIiArIChlcnIucmVhc29uIHx8IGVyci5zdGFjaykpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICAvLyBJZiBjbGllbnQgdmFsaWRhdGlvbiBpcyBmaW5lIG9yIGlzIHNraXBwZWQgYnV0IHRoZW4gc29tZXRoaW5nXG4gIC8vIGlzIGZvdW5kIHRvIGJlIGludmFsaWQgb24gdGhlIHNlcnZlciwgd2UgZ2V0IHRoYXQgZXJyb3IgYmFja1xuICAvLyBhcyBhIHNwZWNpYWwgTWV0ZW9yLkVycm9yIHRoYXQgd2UgbmVlZCB0byBwYXJzZS5cbiAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiBoYXNDYWxsYmFjaykge1xuICAgIGNhbGxiYWNrID0gYXJnc1tsYXN0XSA9IHdyYXBDYWxsYmFja0ZvclBhcnNpbmdTZXJ2ZXJFcnJvcnModmFsaWRhdGlvbkNvbnRleHQsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIHZhciBzY2hlbWFBbGxvd3NJZCA9IHNjaGVtYS5hbGxvd3NLZXkoXCJfaWRcIik7XG4gIGlmICh0eXBlID09PSBcImluc2VydFwiICYmICFkb2MuX2lkICYmIHNjaGVtYUFsbG93c0lkKSB7XG4gICAgZG9jLl9pZCA9IHNlbGYuX21ha2VOZXdJRCgpO1xuICB9XG5cbiAgLy8gR2V0IHRoZSBkb2NJZCBmb3IgcGFzc2luZyBpbiB0aGUgYXV0b1ZhbHVlL2N1c3RvbSBjb250ZXh0XG4gIHZhciBkb2NJZDtcbiAgaWYgKHR5cGUgPT09ICdpbnNlcnQnKSB7XG4gICAgZG9jSWQgPSBkb2MuX2lkOyAvLyBtaWdodCBiZSB1bmRlZmluZWRcbiAgfSBlbHNlIGlmICh0eXBlID09PSBcInVwZGF0ZVwiICYmIHNlbGVjdG9yKSB7XG4gICAgZG9jSWQgPSB0eXBlb2Ygc2VsZWN0b3IgPT09ICdzdHJpbmcnIHx8IHNlbGVjdG9yIGluc3RhbmNlb2YgTW9uZ28uT2JqZWN0SUQgPyBzZWxlY3RvciA6IHNlbGVjdG9yLl9pZDtcbiAgfVxuXG4gIC8vIElmIF9pZCBoYXMgYWxyZWFkeSBiZWVuIGFkZGVkLCByZW1vdmUgaXQgdGVtcG9yYXJpbHkgaWYgaXQnc1xuICAvLyBub3QgZXhwbGljaXRseSBkZWZpbmVkIGluIHRoZSBzY2hlbWEuXG4gIHZhciBjYWNoZWRJZDtcbiAgaWYgKGRvYy5faWQgJiYgIXNjaGVtYUFsbG93c0lkKSB7XG4gICAgY2FjaGVkSWQgPSBkb2MuX2lkO1xuICAgIGRlbGV0ZSBkb2MuX2lkO1xuICB9XG5cbiAgZnVuY3Rpb24gZG9DbGVhbihkb2NUb0NsZWFuLCBnZXRBdXRvVmFsdWVzLCBmaWx0ZXIsIGF1dG9Db252ZXJ0LCByZW1vdmVFbXB0eVN0cmluZ3MsIHRyaW1TdHJpbmdzKSB7XG4gICAgLy8gQ2xlYW4gdGhlIGRvYy9tb2RpZmllciBpbiBwbGFjZVxuICAgIHNjaGVtYS5jbGVhbihkb2NUb0NsZWFuLCB7XG4gICAgICBtdXRhdGU6IHRydWUsXG4gICAgICBmaWx0ZXI6IGZpbHRlcixcbiAgICAgIGF1dG9Db252ZXJ0OiBhdXRvQ29udmVydCxcbiAgICAgIGdldEF1dG9WYWx1ZXM6IGdldEF1dG9WYWx1ZXMsXG4gICAgICBpc01vZGlmaWVyOiAodHlwZSAhPT0gXCJpbnNlcnRcIiksXG4gICAgICByZW1vdmVFbXB0eVN0cmluZ3M6IHJlbW92ZUVtcHR5U3RyaW5ncyxcbiAgICAgIHRyaW1TdHJpbmdzOiB0cmltU3RyaW5ncyxcbiAgICAgIGV4dGVuZEF1dG9WYWx1ZUNvbnRleHQ6IF8uZXh0ZW5kKHtcbiAgICAgICAgaXNJbnNlcnQ6ICh0eXBlID09PSBcImluc2VydFwiKSxcbiAgICAgICAgaXNVcGRhdGU6ICh0eXBlID09PSBcInVwZGF0ZVwiICYmIG9wdGlvbnMudXBzZXJ0ICE9PSB0cnVlKSxcbiAgICAgICAgaXNVcHNlcnQ6IGlzVXBzZXJ0LFxuICAgICAgICB1c2VySWQ6IHVzZXJJZCxcbiAgICAgICAgaXNGcm9tVHJ1c3RlZENvZGU6IGlzRnJvbVRydXN0ZWRDb2RlLFxuICAgICAgICBkb2NJZDogZG9jSWQsXG4gICAgICAgIGlzTG9jYWxDb2xsZWN0aW9uOiBpc0xvY2FsQ29sbGVjdGlvblxuICAgICAgfSwgb3B0aW9ucy5leHRlbmRBdXRvVmFsdWVDb250ZXh0IHx8IHt9KVxuICAgIH0pO1xuICB9XG5cbiAgLy8gUHJlbGltaW5hcnkgY2xlYW5pbmcgb24gYm90aCBjbGllbnQgYW5kIHNlcnZlci4gT24gdGhlIHNlcnZlciBhbmQgZm9yIGxvY2FsXG4gIC8vIGNvbGxlY3Rpb25zLCBhdXRvbWF0aWMgdmFsdWVzIHdpbGwgYWxzbyBiZSBzZXQgYXQgdGhpcyBwb2ludC5cbiAgZG9DbGVhbihcbiAgICBkb2MsXG4gICAgZ2V0QXV0b1ZhbHVlcyxcbiAgICBvcHRpb25zLmZpbHRlciAhPT0gZmFsc2UsXG4gICAgb3B0aW9ucy5hdXRvQ29udmVydCAhPT0gZmFsc2UsXG4gICAgb3B0aW9ucy5yZW1vdmVFbXB0eVN0cmluZ3MgIT09IGZhbHNlLFxuICAgIG9wdGlvbnMudHJpbVN0cmluZ3MgIT09IGZhbHNlXG4gICk7XG5cbiAgLy8gV2UgY2xvbmUgYmVmb3JlIHZhbGlkYXRpbmcgYmVjYXVzZSBpbiBzb21lIGNhc2VzIHdlIG5lZWQgdG8gYWRqdXN0IHRoZVxuICAvLyBvYmplY3QgYSBiaXQgYmVmb3JlIHZhbGlkYXRpbmcgaXQuIElmIHdlIGFkanVzdGVkIGBkb2NgIGl0c2VsZiwgb3VyXG4gIC8vIGNoYW5nZXMgd291bGQgcGVyc2lzdCBpbnRvIHRoZSBkYXRhYmFzZS5cbiAgdmFyIGRvY1RvVmFsaWRhdGUgPSB7fTtcbiAgZm9yICh2YXIgcHJvcCBpbiBkb2MpIHtcbiAgICAvLyBXZSBvbWl0IHByb3RvdHlwZSBwcm9wZXJ0aWVzIHdoZW4gY2xvbmluZyBiZWNhdXNlIHRoZXkgd2lsbCBub3QgYmUgdmFsaWRcbiAgICAvLyBhbmQgbW9uZ28gb21pdHMgdGhlbSB3aGVuIHNhdmluZyB0byB0aGUgZGF0YWJhc2UgYW55d2F5LlxuICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwoZG9jLCBwcm9wKSkge1xuICAgICAgZG9jVG9WYWxpZGF0ZVtwcm9wXSA9IGRvY1twcm9wXTtcbiAgICB9XG4gIH1cblxuICAvLyBPbiB0aGUgc2VydmVyLCB1cHNlcnRzIGFyZSBwb3NzaWJsZTsgU2ltcGxlU2NoZW1hIGhhbmRsZXMgdXBzZXJ0cyBwcmV0dHlcbiAgLy8gd2VsbCBieSBkZWZhdWx0LCBidXQgaXQgd2lsbCBub3Qga25vdyBhYm91dCB0aGUgZmllbGRzIGluIHRoZSBzZWxlY3RvcixcbiAgLy8gd2hpY2ggYXJlIGFsc28gc3RvcmVkIGluIHRoZSBkYXRhYmFzZSBpZiBhbiBpbnNlcnQgaXMgcGVyZm9ybWVkLiBTbyB3ZVxuICAvLyB3aWxsIGFsbG93IHRoZXNlIGZpZWxkcyB0byBiZSBjb25zaWRlcmVkIGZvciB2YWxpZGF0aW9uIGJ5IGFkZGluZyB0aGVtXG4gIC8vIHRvIHRoZSAkc2V0IGluIHRoZSBtb2RpZmllci4gVGhpcyBpcyBubyBkb3VidCBwcm9uZSB0byBlcnJvcnMsIGJ1dCB0aGVyZVxuICAvLyBwcm9iYWJseSBpc24ndCBhbnkgYmV0dGVyIHdheSByaWdodCBub3cuXG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIgJiYgaXNVcHNlcnQgJiYgXy5pc09iamVjdChzZWxlY3RvcikpIHtcbiAgICB2YXIgc2V0ID0gZG9jVG9WYWxpZGF0ZS4kc2V0IHx8IHt9O1xuXG4gICAgLy8gSWYgc2VsZWN0b3IgdXNlcyAkYW5kIGZvcm1hdCwgY29udmVydCB0byBwbGFpbiBvYmplY3Qgc2VsZWN0b3JcbiAgICBpZiAoQXJyYXkuaXNBcnJheShzZWxlY3Rvci4kYW5kKSkge1xuICAgICAgY29uc3QgcGxhaW5TZWxlY3RvciA9IHt9O1xuICAgICAgc2VsZWN0b3IuJGFuZC5mb3JFYWNoKHNlbCA9PiB7XG4gICAgICAgIF8uZXh0ZW5kKHBsYWluU2VsZWN0b3IsIHNlbCk7XG4gICAgICB9KTtcbiAgICAgIGRvY1RvVmFsaWRhdGUuJHNldCA9IHBsYWluU2VsZWN0b3I7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRvY1RvVmFsaWRhdGUuJHNldCA9IF8uY2xvbmUoc2VsZWN0b3IpO1xuICAgIH1cblxuICAgIGlmICghc2NoZW1hQWxsb3dzSWQpIGRlbGV0ZSBkb2NUb1ZhbGlkYXRlLiRzZXQuX2lkO1xuICAgIF8uZXh0ZW5kKGRvY1RvVmFsaWRhdGUuJHNldCwgc2V0KTtcbiAgfVxuXG4gIC8vIFNldCBhdXRvbWF0aWMgdmFsdWVzIGZvciB2YWxpZGF0aW9uIG9uIHRoZSBjbGllbnQuXG4gIC8vIE9uIHRoZSBzZXJ2ZXIsIHdlIGFscmVhZHkgdXBkYXRlZCBkb2Mgd2l0aCBhdXRvIHZhbHVlcywgYnV0IG9uIHRoZSBjbGllbnQsXG4gIC8vIHdlIHdpbGwgYWRkIHRoZW0gdG8gZG9jVG9WYWxpZGF0ZSBmb3IgdmFsaWRhdGlvbiBwdXJwb3NlcyBvbmx5LlxuICAvLyBUaGlzIGlzIGJlY2F1c2Ugd2Ugd2FudCBhbGwgYWN0dWFsIHZhbHVlcyBnZW5lcmF0ZWQgb24gdGhlIHNlcnZlci5cbiAgaWYgKE1ldGVvci5pc0NsaWVudCAmJiAhaXNMb2NhbENvbGxlY3Rpb24pIHtcbiAgICBkb0NsZWFuKGRvY1RvVmFsaWRhdGUsIHRydWUsIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlKTtcbiAgfVxuXG4gIC8vIFhYWCBNYXliZSBtb3ZlIHRoaXMgaW50byBTaW1wbGVTY2hlbWFcbiAgaWYgKCF2YWxpZGF0ZWRPYmplY3RXYXNJbml0aWFsbHlFbXB0eSAmJiBfLmlzRW1wdHkoZG9jVG9WYWxpZGF0ZSkpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0FmdGVyIGZpbHRlcmluZyBvdXQga2V5cyBub3QgaW4gdGhlIHNjaGVtYSwgeW91ciAnICtcbiAgICAgICh0eXBlID09PSAndXBkYXRlJyA/ICdtb2RpZmllcicgOiAnb2JqZWN0JykgK1xuICAgICAgJyBpcyBub3cgZW1wdHknKTtcbiAgfVxuXG4gIC8vIFZhbGlkYXRlIGRvY1xuICB2YXIgaXNWYWxpZDtcbiAgaWYgKG9wdGlvbnMudmFsaWRhdGUgPT09IGZhbHNlKSB7XG4gICAgaXNWYWxpZCA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgaXNWYWxpZCA9IHZhbGlkYXRpb25Db250ZXh0LnZhbGlkYXRlKGRvY1RvVmFsaWRhdGUsIHtcbiAgICAgIG1vZGlmaWVyOiAodHlwZSA9PT0gXCJ1cGRhdGVcIiB8fCB0eXBlID09PSBcInVwc2VydFwiKSxcbiAgICAgIHVwc2VydDogaXNVcHNlcnQsXG4gICAgICBleHRlbmRlZEN1c3RvbUNvbnRleHQ6IF8uZXh0ZW5kKHtcbiAgICAgICAgaXNJbnNlcnQ6ICh0eXBlID09PSBcImluc2VydFwiKSxcbiAgICAgICAgaXNVcGRhdGU6ICh0eXBlID09PSBcInVwZGF0ZVwiICYmIG9wdGlvbnMudXBzZXJ0ICE9PSB0cnVlKSxcbiAgICAgICAgaXNVcHNlcnQ6IGlzVXBzZXJ0LFxuICAgICAgICB1c2VySWQ6IHVzZXJJZCxcbiAgICAgICAgaXNGcm9tVHJ1c3RlZENvZGU6IGlzRnJvbVRydXN0ZWRDb2RlLFxuICAgICAgICBkb2NJZDogZG9jSWQsXG4gICAgICAgIGlzTG9jYWxDb2xsZWN0aW9uOiBpc0xvY2FsQ29sbGVjdGlvblxuICAgICAgfSwgb3B0aW9ucy5leHRlbmRlZEN1c3RvbUNvbnRleHQgfHwge30pXG4gICAgfSk7XG4gIH1cblxuICBpZiAoaXNWYWxpZCkge1xuICAgIC8vIEFkZCB0aGUgSUQgYmFja1xuICAgIGlmIChjYWNoZWRJZCkge1xuICAgICAgZG9jLl9pZCA9IGNhY2hlZElkO1xuICAgIH1cblxuICAgIC8vIFVwZGF0ZSB0aGUgYXJncyB0byByZWZsZWN0IHRoZSBjbGVhbmVkIGRvY1xuICAgIC8vIFhYWCBub3Qgc3VyZSB0aGlzIGlzIG5lY2Vzc2FyeSBzaW5jZSB3ZSBtdXRhdGVcbiAgICBpZiAodHlwZSA9PT0gXCJpbnNlcnRcIikge1xuICAgICAgYXJnc1swXSA9IGRvYztcbiAgICB9IGVsc2Uge1xuICAgICAgYXJnc1sxXSA9IGRvYztcbiAgICB9XG5cbiAgICAvLyBJZiBjYWxsYmFjaywgc2V0IGludmFsaWRLZXkgd2hlbiB3ZSBnZXQgYSBtb25nbyB1bmlxdWUgZXJyb3JcbiAgICBpZiAoTWV0ZW9yLmlzU2VydmVyICYmIGhhc0NhbGxiYWNrKSB7XG4gICAgICBhcmdzW2xhc3RdID0gd3JhcENhbGxiYWNrRm9yUGFyc2luZ01vbmdvVmFsaWRhdGlvbkVycm9ycyh2YWxpZGF0aW9uQ29udGV4dCwgYXJnc1tsYXN0XSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGFyZ3M7XG4gIH0gZWxzZSB7XG4gICAgZXJyb3IgPSBnZXRFcnJvck9iamVjdCh2YWxpZGF0aW9uQ29udGV4dCk7XG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAvLyBpbnNlcnQvdXBkYXRlL3Vwc2VydCBwYXNzIGBmYWxzZWAgd2hlbiB0aGVyZSdzIGFuIGVycm9yLCBzbyB3ZSBkbyB0aGF0XG4gICAgICBjYWxsYmFjayhlcnJvciwgZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0RXJyb3JPYmplY3QoY29udGV4dCkge1xuICB2YXIgbWVzc2FnZTtcbiAgdmFyIGludmFsaWRLZXlzID0gKHR5cGVvZiBjb250ZXh0LnZhbGlkYXRpb25FcnJvcnMgPT09ICdmdW5jdGlvbicpID8gY29udGV4dC52YWxpZGF0aW9uRXJyb3JzKCkgOiBjb250ZXh0LmludmFsaWRLZXlzKCk7XG4gIGlmIChpbnZhbGlkS2V5cy5sZW5ndGgpIHtcbiAgICBtZXNzYWdlID0gY29udGV4dC5rZXlFcnJvck1lc3NhZ2UoaW52YWxpZEtleXNbMF0ubmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgbWVzc2FnZSA9IFwiRmFpbGVkIHZhbGlkYXRpb25cIjtcbiAgfVxuICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIGVycm9yLmludmFsaWRLZXlzID0gaW52YWxpZEtleXM7XG4gIGVycm9yLnZhbGlkYXRpb25Db250ZXh0ID0gY29udGV4dDtcbiAgLy8gSWYgb24gdGhlIHNlcnZlciwgd2UgYWRkIGEgc2FuaXRpemVkIGVycm9yLCB0b28sIGluIGNhc2Ugd2UncmVcbiAgLy8gY2FsbGVkIGZyb20gYSBtZXRob2QuXG4gIGlmIChNZXRlb3IuaXNTZXJ2ZXIpIHtcbiAgICBlcnJvci5zYW5pdGl6ZWRFcnJvciA9IG5ldyBNZXRlb3IuRXJyb3IoNDAwLCBtZXNzYWdlLCBFSlNPTi5zdHJpbmdpZnkoZXJyb3IuaW52YWxpZEtleXMpKTtcbiAgfVxuICByZXR1cm4gZXJyb3I7XG59XG5cbmZ1bmN0aW9uIGFkZFVuaXF1ZUVycm9yKGNvbnRleHQsIGVycm9yTWVzc2FnZSkge1xuICB2YXIgbmFtZSA9IGVycm9yTWVzc2FnZS5zcGxpdCgnYzJfJylbMV0uc3BsaXQoJyAnKVswXTtcbiAgdmFyIHZhbCA9IGVycm9yTWVzc2FnZS5zcGxpdCgnZHVwIGtleTonKVsxXS5zcGxpdCgnXCInKVsxXTtcblxuICB2YXIgYWRkVmFsaWRhdGlvbkVycm9yc1Byb3BOYW1lID0gKHR5cGVvZiBjb250ZXh0LmFkZFZhbGlkYXRpb25FcnJvcnMgPT09ICdmdW5jdGlvbicpID8gJ2FkZFZhbGlkYXRpb25FcnJvcnMnIDogJ2FkZEludmFsaWRLZXlzJztcbiAgY29udGV4dFthZGRWYWxpZGF0aW9uRXJyb3JzUHJvcE5hbWVdKFt7XG4gICAgbmFtZTogbmFtZSxcbiAgICB0eXBlOiAnbm90VW5pcXVlJyxcbiAgICB2YWx1ZTogdmFsXG4gIH1dKTtcbn1cblxuZnVuY3Rpb24gd3JhcENhbGxiYWNrRm9yUGFyc2luZ01vbmdvVmFsaWRhdGlvbkVycm9ycyh2YWxpZGF0aW9uQ29udGV4dCwgY2IpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIHdyYXBwZWRDYWxsYmFja0ZvclBhcnNpbmdNb25nb1ZhbGlkYXRpb25FcnJvcnMoZXJyb3IpIHtcbiAgICB2YXIgYXJncyA9IF8udG9BcnJheShhcmd1bWVudHMpO1xuICAgIGlmIChlcnJvciAmJlxuICAgICAgICAoKGVycm9yLm5hbWUgPT09IFwiTW9uZ29FcnJvclwiICYmIGVycm9yLmNvZGUgPT09IDExMDAxKSB8fCBlcnJvci5tZXNzYWdlLmluZGV4T2YoJ01vbmdvRXJyb3I6IEUxMTAwMCcgIT09IC0xKSkgJiZcbiAgICAgICAgZXJyb3IubWVzc2FnZS5pbmRleE9mKCdjMl8nKSAhPT0gLTEpIHtcbiAgICAgIGFkZFVuaXF1ZUVycm9yKHZhbGlkYXRpb25Db250ZXh0LCBlcnJvci5tZXNzYWdlKTtcbiAgICAgIGFyZ3NbMF0gPSBnZXRFcnJvck9iamVjdCh2YWxpZGF0aW9uQ29udGV4dCk7XG4gICAgfVxuICAgIHJldHVybiBjYi5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gd3JhcENhbGxiYWNrRm9yUGFyc2luZ1NlcnZlckVycm9ycyh2YWxpZGF0aW9uQ29udGV4dCwgY2IpIHtcbiAgdmFyIGFkZFZhbGlkYXRpb25FcnJvcnNQcm9wTmFtZSA9ICh0eXBlb2YgdmFsaWRhdGlvbkNvbnRleHQuYWRkVmFsaWRhdGlvbkVycm9ycyA9PT0gJ2Z1bmN0aW9uJykgPyAnYWRkVmFsaWRhdGlvbkVycm9ycycgOiAnYWRkSW52YWxpZEtleXMnO1xuICByZXR1cm4gZnVuY3Rpb24gd3JhcHBlZENhbGxiYWNrRm9yUGFyc2luZ1NlcnZlckVycm9ycyhlcnJvcikge1xuICAgIHZhciBhcmdzID0gXy50b0FycmF5KGFyZ3VtZW50cyk7XG4gICAgLy8gSGFuZGxlIG91ciBvd24gdmFsaWRhdGlvbiBlcnJvcnNcbiAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBNZXRlb3IuRXJyb3IgJiZcbiAgICAgICAgZXJyb3IuZXJyb3IgPT09IDQwMCAmJlxuICAgICAgICBlcnJvci5yZWFzb24gPT09IFwiSU5WQUxJRFwiICYmXG4gICAgICAgIHR5cGVvZiBlcnJvci5kZXRhaWxzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICB2YXIgaW52YWxpZEtleXNGcm9tU2VydmVyID0gRUpTT04ucGFyc2UoZXJyb3IuZGV0YWlscyk7XG4gICAgICB2YWxpZGF0aW9uQ29udGV4dFthZGRWYWxpZGF0aW9uRXJyb3JzUHJvcE5hbWVdKGludmFsaWRLZXlzRnJvbVNlcnZlcik7XG4gICAgICBhcmdzWzBdID0gZ2V0RXJyb3JPYmplY3QodmFsaWRhdGlvbkNvbnRleHQpO1xuICAgIH1cbiAgICAvLyBIYW5kbGUgTW9uZ28gdW5pcXVlIGluZGV4IGVycm9ycywgd2hpY2ggYXJlIGZvcndhcmRlZCB0byB0aGUgY2xpZW50IGFzIDQwOSBlcnJvcnNcbiAgICBlbHNlIGlmIChlcnJvciBpbnN0YW5jZW9mIE1ldGVvci5FcnJvciAmJlxuICAgICAgICAgICAgIGVycm9yLmVycm9yID09PSA0MDkgJiZcbiAgICAgICAgICAgICBlcnJvci5yZWFzb24gJiZcbiAgICAgICAgICAgICBlcnJvci5yZWFzb24uaW5kZXhPZignRTExMDAwJykgIT09IC0xICYmXG4gICAgICAgICAgICAgZXJyb3IucmVhc29uLmluZGV4T2YoJ2MyXycpICE9PSAtMSkge1xuICAgICAgYWRkVW5pcXVlRXJyb3IodmFsaWRhdGlvbkNvbnRleHQsIGVycm9yLnJlYXNvbik7XG4gICAgICBhcmdzWzBdID0gZ2V0RXJyb3JPYmplY3QodmFsaWRhdGlvbkNvbnRleHQpO1xuICAgIH1cbiAgICByZXR1cm4gY2IuYXBwbHkodGhpcywgYXJncyk7XG4gIH07XG59XG5cbnZhciBhbHJlYWR5SW5zZWN1cmVkID0ge307XG5mdW5jdGlvbiBrZWVwSW5zZWN1cmUoYykge1xuICAvLyBJZiBpbnNlY3VyZSBwYWNrYWdlIGlzIGluIHVzZSwgd2UgbmVlZCB0byBhZGQgYWxsb3cgcnVsZXMgdGhhdCByZXR1cm5cbiAgLy8gdHJ1ZS4gT3RoZXJ3aXNlLCBpdCB3b3VsZCBzZWVtaW5nbHkgdHVybiBvZmYgaW5zZWN1cmUgbW9kZS5cbiAgaWYgKFBhY2thZ2UgJiYgUGFja2FnZS5pbnNlY3VyZSAmJiAhYWxyZWFkeUluc2VjdXJlZFtjLl9uYW1lXSkge1xuICAgIGMuYWxsb3coe1xuICAgICAgaW5zZXJ0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgICAgdXBkYXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9LFxuICAgICAgcmVtb3ZlOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSxcbiAgICAgIGZldGNoOiBbXSxcbiAgICAgIHRyYW5zZm9ybTogbnVsbFxuICAgIH0pO1xuICAgIGFscmVhZHlJbnNlY3VyZWRbYy5fbmFtZV0gPSB0cnVlO1xuICB9XG4gIC8vIElmIGluc2VjdXJlIHBhY2thZ2UgaXMgTk9UIGluIHVzZSwgdGhlbiBhZGRpbmcgdGhlIHR3byBkZW55IGZ1bmN0aW9uc1xuICAvLyBkb2VzIG5vdCBoYXZlIGFueSBlZmZlY3Qgb24gdGhlIG1haW4gYXBwJ3Mgc2VjdXJpdHkgcGFyYWRpZ20uIFRoZVxuICAvLyB1c2VyIHdpbGwgc3RpbGwgYmUgcmVxdWlyZWQgdG8gYWRkIGF0IGxlYXN0IG9uZSBhbGxvdyBmdW5jdGlvbiBvZiBoZXJcbiAgLy8gb3duIGZvciBlYWNoIG9wZXJhdGlvbiBmb3IgdGhpcyBjb2xsZWN0aW9uLiBBbmQgdGhlIHVzZXIgbWF5IHN0aWxsIGFkZFxuICAvLyBhZGRpdGlvbmFsIGRlbnkgZnVuY3Rpb25zLCBidXQgZG9lcyBub3QgaGF2ZSB0by5cbn1cblxudmFyIGFscmVhZHlEZWZpbmVkID0ge307XG5mdW5jdGlvbiBkZWZpbmVEZW55KGMsIG9wdGlvbnMpIHtcbiAgaWYgKCFhbHJlYWR5RGVmaW5lZFtjLl9uYW1lXSkge1xuXG4gICAgdmFyIGlzTG9jYWxDb2xsZWN0aW9uID0gKGMuX2Nvbm5lY3Rpb24gPT09IG51bGwpO1xuXG4gICAgLy8gRmlyc3QgZGVmaW5lIGRlbnkgZnVuY3Rpb25zIHRvIGV4dGVuZCBkb2Mgd2l0aCB0aGUgcmVzdWx0cyBvZiBjbGVhblxuICAgIC8vIGFuZCBhdXRvdmFsdWVzLiBUaGlzIG11c3QgYmUgZG9uZSB3aXRoIFwidHJhbnNmb3JtOiBudWxsXCIgb3Igd2Ugd291bGQgYmVcbiAgICAvLyBleHRlbmRpbmcgYSBjbG9uZSBvZiBkb2MgYW5kIHRoZXJlZm9yZSBoYXZlIG5vIGVmZmVjdC5cbiAgICBjLmRlbnkoe1xuICAgICAgaW5zZXJ0OiBmdW5jdGlvbih1c2VySWQsIGRvYykge1xuICAgICAgICAvLyBSZWZlcmVuY2VkIGRvYyBpcyBjbGVhbmVkIGluIHBsYWNlXG4gICAgICAgIGMuc2ltcGxlU2NoZW1hKGRvYykuY2xlYW4oZG9jLCB7XG4gICAgICAgICAgbXV0YXRlOiB0cnVlLFxuICAgICAgICAgIGlzTW9kaWZpZXI6IGZhbHNlLFxuICAgICAgICAgIC8vIFdlIGRvbid0IGRvIHRoZXNlIGhlcmUgYmVjYXVzZSB0aGV5IGFyZSBkb25lIG9uIHRoZSBjbGllbnQgaWYgZGVzaXJlZFxuICAgICAgICAgIGZpbHRlcjogZmFsc2UsXG4gICAgICAgICAgYXV0b0NvbnZlcnQ6IGZhbHNlLFxuICAgICAgICAgIHJlbW92ZUVtcHR5U3RyaW5nczogZmFsc2UsXG4gICAgICAgICAgdHJpbVN0cmluZ3M6IGZhbHNlLFxuICAgICAgICAgIGV4dGVuZEF1dG9WYWx1ZUNvbnRleHQ6IHtcbiAgICAgICAgICAgIGlzSW5zZXJ0OiB0cnVlLFxuICAgICAgICAgICAgaXNVcGRhdGU6IGZhbHNlLFxuICAgICAgICAgICAgaXNVcHNlcnQ6IGZhbHNlLFxuICAgICAgICAgICAgdXNlcklkOiB1c2VySWQsXG4gICAgICAgICAgICBpc0Zyb21UcnVzdGVkQ29kZTogZmFsc2UsXG4gICAgICAgICAgICBkb2NJZDogZG9jLl9pZCxcbiAgICAgICAgICAgIGlzTG9jYWxDb2xsZWN0aW9uOiBpc0xvY2FsQ29sbGVjdGlvblxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24odXNlcklkLCBkb2MsIGZpZWxkcywgbW9kaWZpZXIpIHtcbiAgICAgICAgLy8gUmVmZXJlbmNlZCBtb2RpZmllciBpcyBjbGVhbmVkIGluIHBsYWNlXG4gICAgICAgIGMuc2ltcGxlU2NoZW1hKG1vZGlmaWVyKS5jbGVhbihtb2RpZmllciwge1xuICAgICAgICAgIG11dGF0ZTogdHJ1ZSxcbiAgICAgICAgICBpc01vZGlmaWVyOiB0cnVlLFxuICAgICAgICAgIC8vIFdlIGRvbid0IGRvIHRoZXNlIGhlcmUgYmVjYXVzZSB0aGV5IGFyZSBkb25lIG9uIHRoZSBjbGllbnQgaWYgZGVzaXJlZFxuICAgICAgICAgIGZpbHRlcjogZmFsc2UsXG4gICAgICAgICAgYXV0b0NvbnZlcnQ6IGZhbHNlLFxuICAgICAgICAgIHJlbW92ZUVtcHR5U3RyaW5nczogZmFsc2UsXG4gICAgICAgICAgdHJpbVN0cmluZ3M6IGZhbHNlLFxuICAgICAgICAgIGV4dGVuZEF1dG9WYWx1ZUNvbnRleHQ6IHtcbiAgICAgICAgICAgIGlzSW5zZXJ0OiBmYWxzZSxcbiAgICAgICAgICAgIGlzVXBkYXRlOiB0cnVlLFxuICAgICAgICAgICAgaXNVcHNlcnQ6IGZhbHNlLFxuICAgICAgICAgICAgdXNlcklkOiB1c2VySWQsXG4gICAgICAgICAgICBpc0Zyb21UcnVzdGVkQ29kZTogZmFsc2UsXG4gICAgICAgICAgICBkb2NJZDogZG9jICYmIGRvYy5faWQsXG4gICAgICAgICAgICBpc0xvY2FsQ29sbGVjdGlvbjogaXNMb2NhbENvbGxlY3Rpb25cbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICBmZXRjaDogWydfaWQnXSxcbiAgICAgIHRyYW5zZm9ybTogbnVsbFxuICAgIH0pO1xuXG4gICAgLy8gU2Vjb25kIGRlZmluZSBkZW55IGZ1bmN0aW9ucyB0byB2YWxpZGF0ZSBhZ2FpbiBvbiB0aGUgc2VydmVyXG4gICAgLy8gZm9yIGNsaWVudC1pbml0aWF0ZWQgaW5zZXJ0cyBhbmQgdXBkYXRlcy4gVGhlc2Ugc2hvdWxkIGJlXG4gICAgLy8gY2FsbGVkIGFmdGVyIHRoZSBjbGVhbi9hdXRvdmFsdWUgZnVuY3Rpb25zIHNpbmNlIHdlJ3JlIGFkZGluZ1xuICAgIC8vIHRoZW0gYWZ0ZXIuIFRoZXNlIG11c3QgKm5vdCogaGF2ZSBcInRyYW5zZm9ybTogbnVsbFwiIGlmIG9wdGlvbnMudHJhbnNmb3JtIGlzIHRydWUgYmVjYXVzZVxuICAgIC8vIHdlIG5lZWQgdG8gcGFzcyB0aGUgZG9jIHRocm91Z2ggYW55IHRyYW5zZm9ybXMgdG8gYmUgc3VyZVxuICAgIC8vIHRoYXQgY3VzdG9tIHR5cGVzIGFyZSBwcm9wZXJseSByZWNvZ25pemVkIGZvciB0eXBlIHZhbGlkYXRpb24uXG4gICAgYy5kZW55KF8uZXh0ZW5kKHtcbiAgICAgIGluc2VydDogZnVuY3Rpb24odXNlcklkLCBkb2MpIHtcbiAgICAgICAgLy8gV2UgcGFzcyB0aGUgZmFsc2Ugb3B0aW9ucyBiZWNhdXNlIHdlIHdpbGwgaGF2ZSBkb25lIHRoZW0gb24gY2xpZW50IGlmIGRlc2lyZWRcbiAgICAgICAgZG9WYWxpZGF0ZS5jYWxsKFxuICAgICAgICAgIGMsXG4gICAgICAgICAgXCJpbnNlcnRcIixcbiAgICAgICAgICBbXG4gICAgICAgICAgICBkb2MsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIHRyaW1TdHJpbmdzOiBmYWxzZSxcbiAgICAgICAgICAgICAgcmVtb3ZlRW1wdHlTdHJpbmdzOiBmYWxzZSxcbiAgICAgICAgICAgICAgZmlsdGVyOiBmYWxzZSxcbiAgICAgICAgICAgICAgYXV0b0NvbnZlcnQ6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IE1ldGVvci5FcnJvcig0MDAsICdJTlZBTElEJywgRUpTT04uc3RyaW5naWZ5KGVycm9yLmludmFsaWRLZXlzKSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdLFxuICAgICAgICAgIGZhbHNlLCAvLyBnZXRBdXRvVmFsdWVzXG4gICAgICAgICAgdXNlcklkLFxuICAgICAgICAgIGZhbHNlIC8vIGlzRnJvbVRydXN0ZWRDb2RlXG4gICAgICAgICk7XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICAgIHVwZGF0ZTogZnVuY3Rpb24odXNlcklkLCBkb2MsIGZpZWxkcywgbW9kaWZpZXIpIHtcbiAgICAgICAgLy8gTk9URTogVGhpcyB3aWxsIG5ldmVyIGJlIGFuIHVwc2VydCBiZWNhdXNlIGNsaWVudC1zaWRlIHVwc2VydHNcbiAgICAgICAgLy8gYXJlIG5vdCBhbGxvd2VkIG9uY2UgeW91IGRlZmluZSBhbGxvdy9kZW55IGZ1bmN0aW9ucy5cbiAgICAgICAgLy8gV2UgcGFzcyB0aGUgZmFsc2Ugb3B0aW9ucyBiZWNhdXNlIHdlIHdpbGwgaGF2ZSBkb25lIHRoZW0gb24gY2xpZW50IGlmIGRlc2lyZWRcbiAgICAgICAgZG9WYWxpZGF0ZS5jYWxsKFxuICAgICAgICAgIGMsXG4gICAgICAgICAgXCJ1cGRhdGVcIixcbiAgICAgICAgICBbXG4gICAgICAgICAgICB7X2lkOiBkb2MgJiYgZG9jLl9pZH0sXG4gICAgICAgICAgICBtb2RpZmllcixcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdHJpbVN0cmluZ3M6IGZhbHNlLFxuICAgICAgICAgICAgICByZW1vdmVFbXB0eVN0cmluZ3M6IGZhbHNlLFxuICAgICAgICAgICAgICBmaWx0ZXI6IGZhbHNlLFxuICAgICAgICAgICAgICBhdXRvQ29udmVydDogZmFsc2VcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgTWV0ZW9yLkVycm9yKDQwMCwgJ0lOVkFMSUQnLCBFSlNPTi5zdHJpbmdpZnkoZXJyb3IuaW52YWxpZEtleXMpKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF0sXG4gICAgICAgICAgZmFsc2UsIC8vIGdldEF1dG9WYWx1ZXNcbiAgICAgICAgICB1c2VySWQsXG4gICAgICAgICAgZmFsc2UgLy8gaXNGcm9tVHJ1c3RlZENvZGVcbiAgICAgICAgKTtcblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LFxuICAgICAgZmV0Y2g6IFsnX2lkJ11cbiAgICB9LCBvcHRpb25zLnRyYW5zZm9ybSA9PT0gdHJ1ZSA/IHt9IDoge3RyYW5zZm9ybTogbnVsbH0pKTtcblxuICAgIC8vIG5vdGUgdGhhdCB3ZSd2ZSBhbHJlYWR5IGRvbmUgdGhpcyBjb2xsZWN0aW9uIHNvIHRoYXQgd2UgZG9uJ3QgZG8gaXQgYWdhaW5cbiAgICAvLyBpZiBhdHRhY2hTY2hlbWEgaXMgY2FsbGVkIGFnYWluXG4gICAgYWxyZWFkeURlZmluZWRbYy5fbmFtZV0gPSB0cnVlO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IENvbGxlY3Rpb24yO1xuIl19
