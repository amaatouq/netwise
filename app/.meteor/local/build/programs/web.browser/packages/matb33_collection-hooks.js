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
var Mongo = Package.mongo.Mongo;
var Tracker = Package.tracker.Tracker;
var Deps = Package.tracker.Deps;
var _ = Package.underscore._;
var EJSON = Package.ejson.EJSON;
var LocalCollection = Package.minimongo.LocalCollection;
var Minimongo = Package.minimongo.Minimongo;

/* Package-scope variables */
var CollectionHooks;

(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/matb33_collection-hooks/collection-hooks.js                                                               //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* global Package Meteor Mongo LocalCollection CollectionHooks _ EJSON */                                             // 1
/* eslint-disable no-proto, no-native-reassign */                                                                     // 2
                                                                                                                      // 3
// Relevant AOP terminology:                                                                                          // 4
// Aspect: User code that runs before/after (hook)                                                                    // 5
// Advice: Wrapper code that knows when to call user code (aspects)                                                   // 6
// Pointcut: before/after                                                                                             // 7
                                                                                                                      // 8
var advices = {}                                                                                                      // 9
var Tracker = Package.tracker && Package.tracker.Tracker || Package.deps.Deps                                         // 10
var publishUserId = Meteor.isServer && new Meteor.EnvironmentVariable()                                               // 11
                                                                                                                      // 12
CollectionHooks = {                                                                                                   // 13
  defaults: {                                                                                                         // 14
    before: {insert: {}, update: {}, remove: {}, upsert: {}, find: {}, findOne: {}, all: {}},                         // 15
    after: {insert: {}, update: {}, remove: {}, find: {}, findOne: {}, all: {}},                                      // 16
    all: {insert: {}, update: {}, remove: {}, find: {}, findOne: {}, all: {}}                                         // 17
  },                                                                                                                  // 18
  directEnv: new Meteor.EnvironmentVariable(),                                                                        // 19
  directOp: function directOp (func) {                                                                                // 20
    return this.directEnv.withValue(true, func)                                                                       // 21
  },                                                                                                                  // 22
  hookedOp: function hookedOp (func) {                                                                                // 23
    return this.directEnv.withValue(false, func)                                                                      // 24
  }                                                                                                                   // 25
}                                                                                                                     // 26
                                                                                                                      // 27
CollectionHooks.getUserId = function getUserId () {                                                                   // 28
  var userId                                                                                                          // 29
                                                                                                                      // 30
  if (Meteor.isClient) {                                                                                              // 31
    Tracker.nonreactive(function () {                                                                                 // 32
      userId = Meteor.userId && Meteor.userId()                                                                       // 33
    })                                                                                                                // 34
  }                                                                                                                   // 35
                                                                                                                      // 36
  if (Meteor.isServer) {                                                                                              // 37
    try {                                                                                                             // 38
      // Will throw an error unless within method call.                                                               // 39
      // Attempt to recover gracefully by catching:                                                                   // 40
      userId = Meteor.userId && Meteor.userId()                                                                       // 41
    } catch (e) {}                                                                                                    // 42
                                                                                                                      // 43
    if (!userId) {                                                                                                    // 44
      // Get the userId if we are in a publish function.                                                              // 45
      userId = publishUserId.get()                                                                                    // 46
    }                                                                                                                 // 47
  }                                                                                                                   // 48
                                                                                                                      // 49
  return userId                                                                                                       // 50
}                                                                                                                     // 51
                                                                                                                      // 52
CollectionHooks.extendCollectionInstance = function extendCollectionInstance (self, constructor) {                    // 53
  // Offer a public API to allow the user to define aspects                                                           // 54
  // Example: collection.before.insert(func);                                                                         // 55
  _.each(['before', 'after'], function (pointcut) {                                                                   // 56
    _.each(advices, function (advice, method) {                                                                       // 57
      if (advice === 'upsert' && pointcut === 'after') return                                                         // 58
                                                                                                                      // 59
      Meteor._ensure(self, pointcut, method)                                                                          // 60
      Meteor._ensure(self, '_hookAspects', method)                                                                    // 61
                                                                                                                      // 62
      self._hookAspects[method][pointcut] = []                                                                        // 63
      self[pointcut][method] = function (aspect, options) {                                                           // 64
        var len = self._hookAspects[method][pointcut].push({                                                          // 65
          aspect: aspect,                                                                                             // 66
          options: CollectionHooks.initOptions(options, pointcut, method)                                             // 67
        })                                                                                                            // 68
                                                                                                                      // 69
        return {                                                                                                      // 70
          replace: function (aspect, options) {                                                                       // 71
            self._hookAspects[method][pointcut].splice(len - 1, 1, {                                                  // 72
              aspect: aspect,                                                                                         // 73
              options: CollectionHooks.initOptions(options, pointcut, method)                                         // 74
            })                                                                                                        // 75
          },                                                                                                          // 76
          remove: function () {                                                                                       // 77
            self._hookAspects[method][pointcut].splice(len - 1, 1)                                                    // 78
          }                                                                                                           // 79
        }                                                                                                             // 80
      }                                                                                                               // 81
    })                                                                                                                // 82
  })                                                                                                                  // 83
                                                                                                                      // 84
  // Offer a publicly accessible object to allow the user to define                                                   // 85
  // collection-wide hook options.                                                                                    // 86
  // Example: collection.hookOptions.after.update = {fetchPrevious: false};                                           // 87
  self.hookOptions = EJSON.clone(CollectionHooks.defaults)                                                            // 88
                                                                                                                      // 89
  // Wrap mutator methods, letting the defined advice do the work                                                     // 90
  _.each(advices, function (advice, method) {                                                                         // 91
    var collection = Meteor.isClient || method === 'upsert' ? self : self._collection                                 // 92
                                                                                                                      // 93
    // Store a reference to the original mutator method                                                               // 94
    var _super = collection[method]                                                                                   // 95
                                                                                                                      // 96
    Meteor._ensure(self, 'direct', method)                                                                            // 97
    self.direct[method] = function () {                                                                               // 98
      var args = arguments                                                                                            // 99
      return CollectionHooks.directOp(function () {                                                                   // 100
        return constructor.prototype[method].apply(self, args)                                                        // 101
      })                                                                                                              // 102
    }                                                                                                                 // 103
                                                                                                                      // 104
    collection[method] = function () {                                                                                // 105
      if (CollectionHooks.directEnv.get() === true) {                                                                 // 106
        return _super.apply(collection, arguments)                                                                    // 107
      }                                                                                                               // 108
                                                                                                                      // 109
      // NOTE: should we decide to force `update` with `{upsert:true}` to use                                         // 110
      // the `upsert` hooks, this is what will accomplish it. It's important to                                       // 111
      // realize that Meteor won't distinguish between an `update` and an                                             // 112
      // `insert` though, so we'll end up with `after.update` getting called                                          // 113
      // even on an `insert`. That's why we've chosen to disable this for now.                                        // 114
      // if (method === "update" && _.isObject(arguments[2]) && arguments[2].upsert) {                                // 115
      //   method = "upsert";                                                                                         // 116
      //   advice = CollectionHooks.getAdvice(method);                                                                // 117
      // }                                                                                                            // 118
                                                                                                                      // 119
      return advice.call(this,                                                                                        // 120
        CollectionHooks.getUserId(),                                                                                  // 121
        _super,                                                                                                       // 122
        self,                                                                                                         // 123
        method === 'upsert' ? {                                                                                       // 124
          insert: self._hookAspects.insert || {},                                                                     // 125
          update: self._hookAspects.update || {},                                                                     // 126
          upsert: self._hookAspects.upsert || {}                                                                      // 127
        } : self._hookAspects[method] || {},                                                                          // 128
        function (doc) {                                                                                              // 129
          return (                                                                                                    // 130
            _.isFunction(self._transform)                                                                             // 131
            ? function (d) { return self._transform(d || doc) }                                                       // 132
            : function (d) { return d || doc }                                                                        // 133
          )                                                                                                           // 134
        },                                                                                                            // 135
        _.toArray(arguments),                                                                                         // 136
        false                                                                                                         // 137
      )                                                                                                               // 138
    }                                                                                                                 // 139
  })                                                                                                                  // 140
}                                                                                                                     // 141
                                                                                                                      // 142
CollectionHooks.defineAdvice = function defineAdvice (method, advice) {                                               // 143
  advices[method] = advice                                                                                            // 144
}                                                                                                                     // 145
                                                                                                                      // 146
CollectionHooks.getAdvice = function getAdvice (method) {                                                             // 147
  return advices[method]                                                                                              // 148
}                                                                                                                     // 149
                                                                                                                      // 150
CollectionHooks.initOptions = function initOptions (options, pointcut, method) {                                      // 151
  return CollectionHooks.extendOptions(CollectionHooks.defaults, options, pointcut, method)                           // 152
}                                                                                                                     // 153
                                                                                                                      // 154
CollectionHooks.extendOptions = function extendOptions (source, options, pointcut, method) {                          // 155
  options = _.extend(options || {}, source.all.all)                                                                   // 156
  options = _.extend(options, source[pointcut].all)                                                                   // 157
  options = _.extend(options, source.all[method])                                                                     // 158
  options = _.extend(options, source[pointcut][method])                                                               // 159
  return options                                                                                                      // 160
}                                                                                                                     // 161
                                                                                                                      // 162
CollectionHooks.getDocs = function getDocs (collection, selector, options) {                                          // 163
  var findOptions = {transform: null, reactive: false} // added reactive: false                                       // 164
                                                                                                                      // 165
  /*                                                                                                                  // 166
  // No "fetch" support at this time.                                                                                 // 167
  if (!this._validators.fetchAllFields) {                                                                             // 168
    findOptions.fields = {};                                                                                          // 169
    _.each(this._validators.fetch, function(fieldName) {                                                              // 170
      findOptions.fields[fieldName] = 1;                                                                              // 171
    });                                                                                                               // 172
  }                                                                                                                   // 173
  */                                                                                                                  // 174
                                                                                                                      // 175
  // Bit of a magic condition here... only "update" passes options, so this is                                        // 176
  // only relevant to when update calls getDocs:                                                                      // 177
  if (options) {                                                                                                      // 178
    // This was added because in our case, we are potentially iterating over                                          // 179
    // multiple docs. If multi isn't enabled, force a limit (almost like                                              // 180
    // findOne), as the default for update without multi enabled is to affect                                         // 181
    // only the first matched document:                                                                               // 182
    if (!options.multi) {                                                                                             // 183
      findOptions.limit = 1                                                                                           // 184
    }                                                                                                                 // 185
  }                                                                                                                   // 186
                                                                                                                      // 187
  // Unlike validators, we iterate over multiple docs, so use                                                         // 188
  // find instead of findOne:                                                                                         // 189
  return collection.find(selector, findOptions)                                                                       // 190
}                                                                                                                     // 191
                                                                                                                      // 192
// This function contains a snippet of code pulled and modified from:                                                 // 193
// ~/.meteor/packages/mongo-livedata/collection.js                                                                    // 194
// It's contained in these utility functions to make updates easier for us in                                         // 195
// case this code changes.                                                                                            // 196
CollectionHooks.getFields = function getFields (mutator) {                                                            // 197
  // compute modified fields                                                                                          // 198
  var fields = []                                                                                                     // 199
                                                                                                                      // 200
  _.each(mutator, function (params, op) {                                                                             // 201
    // ====ADDED START=======================                                                                         // 202
    if (_.contains(['$set', '$unset', '$inc', '$push', '$pull', '$pop', '$rename', '$pullAll', '$addToSet', '$bit'], op)) {
    // ====ADDED END=========================                                                                         // 204
      _.each(_.keys(params), function (field) {                                                                       // 205
        // treat dotted fields as if they are replacing their                                                         // 206
        // top-level part                                                                                             // 207
        if (field.indexOf('.') !== -1) {                                                                              // 208
          field = field.substring(0, field.indexOf('.'))                                                              // 209
        }                                                                                                             // 210
                                                                                                                      // 211
        // record the field we are trying to change                                                                   // 212
        if (!_.contains(fields, field)) {                                                                             // 213
          fields.push(field)                                                                                          // 214
        }                                                                                                             // 215
      })                                                                                                              // 216
      // ====ADDED START=======================                                                                       // 217
    } else {                                                                                                          // 218
      fields.push(op)                                                                                                 // 219
    }                                                                                                                 // 220
    // ====ADDED END=========================                                                                         // 221
  })                                                                                                                  // 222
                                                                                                                      // 223
  return fields                                                                                                       // 224
}                                                                                                                     // 225
                                                                                                                      // 226
CollectionHooks.reassignPrototype = function reassignPrototype (instance, constr) {                                   // 227
  var hasSetPrototypeOf = typeof Object.setPrototypeOf === 'function'                                                 // 228
                                                                                                                      // 229
  if (!constr) constr = typeof Mongo !== 'undefined' ? Mongo.Collection : Meteor.Collection                           // 230
                                                                                                                      // 231
  // __proto__ is not available in < IE11                                                                             // 232
  // Note: Assigning a prototype dynamically has performance implications                                             // 233
  if (hasSetPrototypeOf) {                                                                                            // 234
    Object.setPrototypeOf(instance, constr.prototype)                                                                 // 235
  } else if (instance.__proto__) {                                                                                    // 236
    instance.__proto__ = constr.prototype                                                                             // 237
  }                                                                                                                   // 238
}                                                                                                                     // 239
                                                                                                                      // 240
CollectionHooks.wrapCollection = function wrapCollection (ns, as) {                                                   // 241
  if (!as._CollectionConstructor) as._CollectionConstructor = as.Collection                                           // 242
  if (!as._CollectionPrototype) as._CollectionPrototype = new as.Collection(null)                                     // 243
                                                                                                                      // 244
  var constructor = as._CollectionConstructor                                                                         // 245
  var proto = as._CollectionPrototype                                                                                 // 246
                                                                                                                      // 247
  ns.Collection = function () {                                                                                       // 248
    var ret = constructor.apply(this, arguments)                                                                      // 249
    CollectionHooks.extendCollectionInstance(this, constructor)                                                       // 250
    return ret                                                                                                        // 251
  }                                                                                                                   // 252
                                                                                                                      // 253
  ns.Collection.prototype = proto                                                                                     // 254
  ns.Collection.prototype.constructor = ns.Collection                                                                 // 255
                                                                                                                      // 256
  for (var prop in constructor) {                                                                                     // 257
    if (constructor.hasOwnProperty(prop)) {                                                                           // 258
      ns.Collection[prop] = constructor[prop]                                                                         // 259
    }                                                                                                                 // 260
  }                                                                                                                   // 261
}                                                                                                                     // 262
                                                                                                                      // 263
CollectionHooks.modify = LocalCollection._modify                                                                      // 264
                                                                                                                      // 265
if (typeof Mongo !== 'undefined') {                                                                                   // 266
  CollectionHooks.wrapCollection(Meteor, Mongo)                                                                       // 267
  CollectionHooks.wrapCollection(Mongo, Mongo)                                                                        // 268
} else {                                                                                                              // 269
  CollectionHooks.wrapCollection(Meteor, Meteor)                                                                      // 270
}                                                                                                                     // 271
                                                                                                                      // 272
if (Meteor.isServer) {                                                                                                // 273
  var _publish = Meteor.publish                                                                                       // 274
  Meteor.publish = function (name, func) {                                                                            // 275
    return _publish.call(this, name, function () {                                                                    // 276
      // This function is called repeatedly in publications                                                           // 277
      var ctx = this                                                                                                  // 278
      var args = arguments                                                                                            // 279
      return publishUserId.withValue(ctx && ctx.userId, function () {                                                 // 280
        return func.apply(ctx, args)                                                                                  // 281
      })                                                                                                              // 282
    })                                                                                                                // 283
  }                                                                                                                   // 284
                                                                                                                      // 285
  // Make the above available for packages with hooks that want to determine                                          // 286
  // whether they are running inside a publish function or not.                                                       // 287
  CollectionHooks.isWithinPublish = function isWithinPublish () {                                                     // 288
    return publishUserId.get() !== undefined                                                                          // 289
  }                                                                                                                   // 290
}                                                                                                                     // 291
                                                                                                                      // 292
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/matb33_collection-hooks/insert.js                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* global CollectionHooks _ EJSON */                                                                                  // 1
                                                                                                                      // 2
CollectionHooks.defineAdvice('insert', function (userId, _super, instance, aspects, getTransform, args, suppressAspects) {
  var self = this                                                                                                     // 4
  var ctx = {context: self, _super: _super, args: args}                                                               // 5
  var callback = _.last(args)                                                                                         // 6
  var async = _.isFunction(callback)                                                                                  // 7
  var abort, ret                                                                                                      // 8
                                                                                                                      // 9
  // args[0] : doc                                                                                                    // 10
  // args[1] : callback                                                                                               // 11
                                                                                                                      // 12
  // before                                                                                                           // 13
  if (!suppressAspects) {                                                                                             // 14
    try {                                                                                                             // 15
      _.each(aspects.before, function (o) {                                                                           // 16
        var r = o.aspect.call(_.extend({transform: getTransform(args[0])}, ctx), userId, args[0])                     // 17
        if (r === false) abort = true                                                                                 // 18
      })                                                                                                              // 19
                                                                                                                      // 20
      if (abort) return false                                                                                         // 21
    } catch (e) {                                                                                                     // 22
      if (async) return callback.call(self, e)                                                                        // 23
      throw e                                                                                                         // 24
    }                                                                                                                 // 25
  }                                                                                                                   // 26
                                                                                                                      // 27
  function after (id, err) {                                                                                          // 28
    var doc = args[0]                                                                                                 // 29
    if (id) {                                                                                                         // 30
      // In some cases (namely Meteor.users on Meteor 1.4+), the _id property                                         // 31
      // is a raw mongo _id object. We need to extract the _id from this object                                       // 32
      if (_.isObject(id) && id.ops) {                                                                                 // 33
        // If _str then collection is using Mongo.ObjectID as ids                                                     // 34
        if (doc._id._str) {                                                                                           // 35
          id = new Mongo.ObjectID(doc._id._str.toString());                                                           // 36
        } else {                                                                                                      // 37
          id = id.ops && id.ops[0] && id.ops[0]._id                                                                   // 38
        }                                                                                                             // 39
      }                                                                                                               // 40
      doc = EJSON.clone(args[0])                                                                                      // 41
      doc._id = id                                                                                                    // 42
    }                                                                                                                 // 43
    if (!suppressAspects) {                                                                                           // 44
      var lctx = _.extend({transform: getTransform(doc), _id: id, err: err}, ctx)                                     // 45
      _.each(aspects.after, function (o) {                                                                            // 46
        o.aspect.call(lctx, userId, doc)                                                                              // 47
      })                                                                                                              // 48
    }                                                                                                                 // 49
    return id                                                                                                         // 50
  }                                                                                                                   // 51
                                                                                                                      // 52
  if (async) {                                                                                                        // 53
    args[args.length - 1] = function (err, obj) {                                                                     // 54
      after(obj && obj[0] && obj[0]._id || obj, err)                                                                  // 55
      return callback.apply(this, arguments)                                                                          // 56
    }                                                                                                                 // 57
    return _super.apply(self, args)                                                                                   // 58
  } else {                                                                                                            // 59
    ret = _super.apply(self, args)                                                                                    // 60
    return after(ret && ret[0] && ret[0]._id || ret)                                                                  // 61
  }                                                                                                                   // 62
})                                                                                                                    // 63
                                                                                                                      // 64
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/matb33_collection-hooks/update.js                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* global CollectionHooks _ EJSON */                                                                                  // 1
                                                                                                                      // 2
CollectionHooks.defineAdvice('update', function (userId, _super, instance, aspects, getTransform, args, suppressAspects) {
  var self = this                                                                                                     // 4
  var ctx = {context: self, _super: _super, args: args}                                                               // 5
  var callback = _.last(args)                                                                                         // 6
  var async = _.isFunction(callback)                                                                                  // 7
  var docs                                                                                                            // 8
  var docIds                                                                                                          // 9
  var fields                                                                                                          // 10
  var abort                                                                                                           // 11
  var prev = {}                                                                                                       // 12
  var collection = _.has(self, '_collection') ? self._collection : self                                               // 13
                                                                                                                      // 14
  // args[0] : selector                                                                                               // 15
  // args[1] : mutator                                                                                                // 16
  // args[2] : options (optional)                                                                                     // 17
  // args[3] : callback                                                                                               // 18
                                                                                                                      // 19
  if (_.isFunction(args[2])) {                                                                                        // 20
    callback = args[2]                                                                                                // 21
    args[2] = {}                                                                                                      // 22
  }                                                                                                                   // 23
                                                                                                                      // 24
  if (!suppressAspects) {                                                                                             // 25
    try {                                                                                                             // 26
      if (aspects.before || aspects.after) {                                                                          // 27
        fields = CollectionHooks.getFields(args[1])                                                                   // 28
        docs = CollectionHooks.getDocs.call(self, collection, args[0], args[2]).fetch()                               // 29
        docIds = _.map(docs, function (doc) { return doc._id })                                                       // 30
      }                                                                                                               // 31
                                                                                                                      // 32
      // copy originals for convenience for the 'after' pointcut                                                      // 33
      if (aspects.after) {                                                                                            // 34
        prev.mutator = EJSON.clone(args[1])                                                                           // 35
        prev.options = EJSON.clone(args[2])                                                                           // 36
        if (                                                                                                          // 37
          _.some(aspects.after, function (o) { return o.options.fetchPrevious !== false }) &&                         // 38
          CollectionHooks.extendOptions(instance.hookOptions, {}, 'after', 'update').fetchPrevious !== false          // 39
        ) {                                                                                                           // 40
          prev.docs = {}                                                                                              // 41
          _.each(docs, function (doc) {                                                                               // 42
            prev.docs[doc._id] = EJSON.clone(doc)                                                                     // 43
          })                                                                                                          // 44
        }                                                                                                             // 45
      }                                                                                                               // 46
                                                                                                                      // 47
      // before                                                                                                       // 48
      _.each(aspects.before, function (o) {                                                                           // 49
        _.each(docs, function (doc) {                                                                                 // 50
          var r = o.aspect.call(_.extend({transform: getTransform(doc)}, ctx), userId, doc, fields, args[1], args[2])
          if (r === false) abort = true                                                                               // 52
        })                                                                                                            // 53
      })                                                                                                              // 54
                                                                                                                      // 55
      if (abort) return false                                                                                         // 56
    } catch (e) {                                                                                                     // 57
      if (async) return callback.call(self, e)                                                                        // 58
      throw e                                                                                                         // 59
    }                                                                                                                 // 60
  }                                                                                                                   // 61
                                                                                                                      // 62
  function after (affected, err) {                                                                                    // 63
    if (!suppressAspects) {                                                                                           // 64
      var fields = CollectionHooks.getFields(args[1])                                                                 // 65
      var docs = CollectionHooks.getDocs.call(self, collection, {_id: {$in: docIds}}, args[2]).fetch()                // 66
                                                                                                                      // 67
      _.each(aspects.after, function (o) {                                                                            // 68
        _.each(docs, function (doc) {                                                                                 // 69
          o.aspect.call(_.extend({                                                                                    // 70
            transform: getTransform(doc),                                                                             // 71
            previous: prev.docs && prev.docs[doc._id],                                                                // 72
            affected: affected,                                                                                       // 73
            err: err                                                                                                  // 74
          }, ctx), userId, doc, fields, prev.mutator, prev.options)                                                   // 75
        })                                                                                                            // 76
      })                                                                                                              // 77
    }                                                                                                                 // 78
  }                                                                                                                   // 79
                                                                                                                      // 80
  if (async) {                                                                                                        // 81
    args[args.length - 1] = function (err, affected) {                                                                // 82
      after(affected, err)                                                                                            // 83
      return callback.apply(this, arguments)                                                                          // 84
    }                                                                                                                 // 85
    return _super.apply(this, args)                                                                                   // 86
  } else {                                                                                                            // 87
    var affected = _super.apply(self, args)                                                                           // 88
    after(affected)                                                                                                   // 89
    return affected                                                                                                   // 90
  }                                                                                                                   // 91
})                                                                                                                    // 92
                                                                                                                      // 93
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/matb33_collection-hooks/remove.js                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* global CollectionHooks _ EJSON */                                                                                  // 1
                                                                                                                      // 2
CollectionHooks.defineAdvice('remove', function (userId, _super, instance, aspects, getTransform, args, suppressAspects) {
  var self = this                                                                                                     // 4
  var ctx = {context: self, _super: _super, args: args}                                                               // 5
  var callback = _.last(args)                                                                                         // 6
  var async = _.isFunction(callback)                                                                                  // 7
  var docs                                                                                                            // 8
  var abort                                                                                                           // 9
  var prev = []                                                                                                       // 10
  var collection = _.has(self, '_collection') ? self._collection : self                                               // 11
                                                                                                                      // 12
  // args[0] : selector                                                                                               // 13
  // args[1] : callback                                                                                               // 14
                                                                                                                      // 15
  if (!suppressAspects) {                                                                                             // 16
    try {                                                                                                             // 17
      if (aspects.before || aspects.after) {                                                                          // 18
        docs = CollectionHooks.getDocs.call(self, collection, args[0]).fetch()                                        // 19
      }                                                                                                               // 20
                                                                                                                      // 21
      // copy originals for convenience for the 'after' pointcut                                                      // 22
      if (aspects.after) {                                                                                            // 23
        _.each(docs, function (doc) {                                                                                 // 24
          prev.push(EJSON.clone(doc))                                                                                 // 25
        })                                                                                                            // 26
      }                                                                                                               // 27
                                                                                                                      // 28
      // before                                                                                                       // 29
      _.each(aspects.before, function (o) {                                                                           // 30
        _.each(docs, function (doc) {                                                                                 // 31
          var r = o.aspect.call(_.extend({transform: getTransform(doc)}, ctx), userId, doc)                           // 32
          if (r === false) abort = true                                                                               // 33
        })                                                                                                            // 34
      })                                                                                                              // 35
                                                                                                                      // 36
      if (abort) return false                                                                                         // 37
    } catch (e) {                                                                                                     // 38
      if (async) return callback.call(self, e)                                                                        // 39
      throw e                                                                                                         // 40
    }                                                                                                                 // 41
  }                                                                                                                   // 42
                                                                                                                      // 43
  function after (err) {                                                                                              // 44
    if (!suppressAspects) {                                                                                           // 45
      _.each(aspects.after, function (o) {                                                                            // 46
        _.each(prev, function (doc) {                                                                                 // 47
          o.aspect.call(_.extend({transform: getTransform(doc), err: err}, ctx), userId, doc)                         // 48
        })                                                                                                            // 49
      })                                                                                                              // 50
    }                                                                                                                 // 51
  }                                                                                                                   // 52
                                                                                                                      // 53
  if (async) {                                                                                                        // 54
    args[args.length - 1] = function (err) {                                                                          // 55
      after(err)                                                                                                      // 56
      return callback.apply(this, arguments)                                                                          // 57
    }                                                                                                                 // 58
    return _super.apply(self, args)                                                                                   // 59
  } else {                                                                                                            // 60
    var result = _super.apply(self, args)                                                                             // 61
    after()                                                                                                           // 62
    return result                                                                                                     // 63
  }                                                                                                                   // 64
})                                                                                                                    // 65
                                                                                                                      // 66
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/matb33_collection-hooks/upsert.js                                                                         //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* global CollectionHooks _ EJSON */                                                                                  // 1
                                                                                                                      // 2
CollectionHooks.defineAdvice('upsert', function (userId, _super, instance, aspectGroup, getTransform, args, suppressAspects) {
  var self = this                                                                                                     // 4
  var ctx = {context: self, _super: _super, args: args}                                                               // 5
  var callback = _.last(args)                                                                                         // 6
  var async = _.isFunction(callback)                                                                                  // 7
  var docs                                                                                                            // 8
  var docIds                                                                                                          // 9
  var abort                                                                                                           // 10
  var prev = {}                                                                                                       // 11
  var collection = _.has(self, '_collection') ? self._collection : self                                               // 12
                                                                                                                      // 13
  // args[0] : selector                                                                                               // 14
  // args[1] : mutator                                                                                                // 15
  // args[2] : options (optional)                                                                                     // 16
  // args[3] : callback                                                                                               // 17
                                                                                                                      // 18
  if (_.isFunction(args[2])) {                                                                                        // 19
    callback = args[2]                                                                                                // 20
    args[2] = {}                                                                                                      // 21
  }                                                                                                                   // 22
                                                                                                                      // 23
  if (!suppressAspects) {                                                                                             // 24
    if (aspectGroup.upsert.before) {                                                                                  // 25
      docs = CollectionHooks.getDocs.call(self, collection, args[0], args[2]).fetch()                                 // 26
      docIds = _.map(docs, function (doc) { return doc._id })                                                         // 27
    }                                                                                                                 // 28
                                                                                                                      // 29
    // copy originals for convenience for the 'after' pointcut                                                        // 30
    if (aspectGroup.update.after) {                                                                                   // 31
      if (_.some(aspectGroup.update.after, function (o) { return o.options.fetchPrevious !== false }) &&              // 32
          CollectionHooks.extendOptions(instance.hookOptions, {}, 'after', 'update').fetchPrevious !== false) {       // 33
        prev.mutator = EJSON.clone(args[1])                                                                           // 34
        prev.options = EJSON.clone(args[2])                                                                           // 35
        prev.docs = {}                                                                                                // 36
        _.each(docs, function (doc) {                                                                                 // 37
          prev.docs[doc._id] = EJSON.clone(doc)                                                                       // 38
        })                                                                                                            // 39
      }                                                                                                               // 40
    }                                                                                                                 // 41
                                                                                                                      // 42
    // before                                                                                                         // 43
    if (!suppressAspects) {                                                                                           // 44
      _.each(aspectGroup.upsert.before, function (o) {                                                                // 45
        var r = o.aspect.call(ctx, userId, args[0], args[1], args[2])                                                 // 46
        if (r === false) abort = true                                                                                 // 47
      })                                                                                                              // 48
                                                                                                                      // 49
      if (abort) return false                                                                                         // 50
    }                                                                                                                 // 51
  }                                                                                                                   // 52
                                                                                                                      // 53
  function afterUpdate (affected, err) {                                                                              // 54
    if (!suppressAspects) {                                                                                           // 55
      var fields = CollectionHooks.getFields(args[1])                                                                 // 56
      var docs = CollectionHooks.getDocs.call(self, collection, {_id: {$in: docIds}}, args[2]).fetch()                // 57
                                                                                                                      // 58
      _.each(aspectGroup.update.after, function (o) {                                                                 // 59
        _.each(docs, function (doc) {                                                                                 // 60
          o.aspect.call(_.extend({                                                                                    // 61
            transform: getTransform(doc),                                                                             // 62
            previous: prev.docs && prev.docs[doc._id],                                                                // 63
            affected: affected,                                                                                       // 64
            err: err                                                                                                  // 65
          }, ctx), userId, doc, fields, prev.mutator, prev.options)                                                   // 66
        })                                                                                                            // 67
      })                                                                                                              // 68
    }                                                                                                                 // 69
  }                                                                                                                   // 70
                                                                                                                      // 71
  function afterInsert (id, err) {                                                                                    // 72
    if (!suppressAspects) {                                                                                           // 73
      var doc = CollectionHooks.getDocs.call(self, collection, {_id: id}, args[0], {}).fetch()[0] // 3rd argument passes empty object which causes magic logic to imply limit:1
      var lctx = _.extend({transform: getTransform(doc), _id: id, err: err}, ctx)                                     // 75
      _.each(aspectGroup.insert.after, function (o) {                                                                 // 76
        o.aspect.call(lctx, userId, doc)                                                                              // 77
      })                                                                                                              // 78
    }                                                                                                                 // 79
  }                                                                                                                   // 80
                                                                                                                      // 81
  if (async) {                                                                                                        // 82
    args[args.length - 1] = function (err, ret) {                                                                     // 83
      if (err || ret.insertedId) {                                                                                    // 84
        // Send any errors to afterInsert                                                                             // 85
        afterInsert(ret && ret.insertedId, err)                                                                       // 86
      } else {                                                                                                        // 87
        afterUpdate(ret && ret.numberAffected, err) // Note that err can never reach here                             // 88
      }                                                                                                               // 89
                                                                                                                      // 90
      return CollectionHooks.hookedOp(function () {                                                                   // 91
        return callback.call(this, err, ret)                                                                          // 92
      })                                                                                                              // 93
    }                                                                                                                 // 94
                                                                                                                      // 95
    return CollectionHooks.directOp(function () {                                                                     // 96
      return _super.apply(self, args)                                                                                 // 97
    })                                                                                                                // 98
  } else {                                                                                                            // 99
    var ret = CollectionHooks.directOp(function () {                                                                  // 100
      return _super.apply(self, args)                                                                                 // 101
    })                                                                                                                // 102
                                                                                                                      // 103
    if (ret && ret.insertedId) {                                                                                      // 104
      afterInsert(ret && ret.insertedId)                                                                              // 105
    } else {                                                                                                          // 106
      afterUpdate(ret && ret.numberAffected)                                                                          // 107
    }                                                                                                                 // 108
                                                                                                                      // 109
    return ret                                                                                                        // 110
  }                                                                                                                   // 111
})                                                                                                                    // 112
                                                                                                                      // 113
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/matb33_collection-hooks/find.js                                                                           //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* global CollectionHooks _ */                                                                                        // 1
                                                                                                                      // 2
CollectionHooks.defineAdvice('find', function (userId, _super, instance, aspects, getTransform, args, suppressAspects) {
  var self = this                                                                                                     // 4
  var ctx = {context: self, _super: _super, args: args}                                                               // 5
  var ret, abort                                                                                                      // 6
                                                                                                                      // 7
  // args[0] : selector                                                                                               // 8
  // args[1] : options                                                                                                // 9
                                                                                                                      // 10
  // before                                                                                                           // 11
  if (!suppressAspects) {                                                                                             // 12
    _.each(aspects.before, function (o) {                                                                             // 13
      var r = o.aspect.call(ctx, userId, args[0], args[1])                                                            // 14
      if (r === false) abort = true                                                                                   // 15
    })                                                                                                                // 16
                                                                                                                      // 17
    if (abort) return false                                                                                           // 18
  }                                                                                                                   // 19
                                                                                                                      // 20
  function after (cursor) {                                                                                           // 21
    if (!suppressAspects) {                                                                                           // 22
      _.each(aspects.after, function (o) {                                                                            // 23
        o.aspect.call(ctx, userId, args[0], args[1], cursor)                                                          // 24
      })                                                                                                              // 25
    }                                                                                                                 // 26
  }                                                                                                                   // 27
                                                                                                                      // 28
  ret = _super.apply(self, args)                                                                                      // 29
  after(ret)                                                                                                          // 30
                                                                                                                      // 31
  return ret                                                                                                          // 32
})                                                                                                                    // 33
                                                                                                                      // 34
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/matb33_collection-hooks/findone.js                                                                        //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* global CollectionHooks _ */                                                                                        // 1
                                                                                                                      // 2
CollectionHooks.defineAdvice('findOne', function (userId, _super, instance, aspects, getTransform, args, suppressAspects) {
  var self = this                                                                                                     // 4
  var ctx = {context: self, _super: _super, args: args}                                                               // 5
  var ret, abort                                                                                                      // 6
                                                                                                                      // 7
  // args[0] : selector                                                                                               // 8
  // args[1] : options                                                                                                // 9
                                                                                                                      // 10
  // before                                                                                                           // 11
  if (!suppressAspects) {                                                                                             // 12
    _.each(aspects.before, function (o) {                                                                             // 13
      var r = o.aspect.call(ctx, userId, args[0], args[1])                                                            // 14
      if (r === false) abort = true                                                                                   // 15
    })                                                                                                                // 16
                                                                                                                      // 17
    if (abort) return false                                                                                           // 18
  }                                                                                                                   // 19
                                                                                                                      // 20
  function after (doc) {                                                                                              // 21
    if (!suppressAspects) {                                                                                           // 22
      _.each(aspects.after, function (o) {                                                                            // 23
        o.aspect.call(ctx, userId, args[0], args[1], doc)                                                             // 24
      })                                                                                                              // 25
    }                                                                                                                 // 26
  }                                                                                                                   // 27
                                                                                                                      // 28
  ret = _super.apply(self, args)                                                                                      // 29
  after(ret)                                                                                                          // 30
                                                                                                                      // 31
  return ret                                                                                                          // 32
})                                                                                                                    // 33
                                                                                                                      // 34
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);






(function(){

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                    //
// packages/matb33_collection-hooks/users-compat.js                                                                   //
//                                                                                                                    //
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                      //
/* global CollectionHooks Meteor Mongo */                                                                             // 1
                                                                                                                      // 2
if (Meteor.users) {                                                                                                   // 3
  // If Meteor.users has been instantiated, attempt to re-assign its prototype:                                       // 4
  CollectionHooks.reassignPrototype(Meteor.users)                                                                     // 5
                                                                                                                      // 6
  // Next, give it the hook aspects:                                                                                  // 7
  var Collection = typeof Mongo !== 'undefined' && typeof Mongo.Collection !== 'undefined' ? Mongo.Collection : Meteor.Collection
  CollectionHooks.extendCollectionInstance(Meteor.users, Collection)                                                  // 9
}                                                                                                                     // 10
                                                                                                                      // 11
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}).call(this);


/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['matb33:collection-hooks'] = {}, {
  CollectionHooks: CollectionHooks
});

})();
