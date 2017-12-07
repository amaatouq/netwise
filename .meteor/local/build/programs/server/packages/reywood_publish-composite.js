(function () {

/* Imports */
var Meteor = Package.meteor.Meteor;
var global = Package.meteor.global;
var meteorEnv = Package.meteor.meteorEnv;
var check = Package.check.check;
var Match = Package.check.Match;
var ECMAScript = Package.ecmascript.ECMAScript;
var meteorInstall = Package.modules.meteorInstall;
var _ = Package.underscore._;
var meteorBabelHelpers = Package['babel-runtime'].meteorBabelHelpers;
var Promise = Package.promise.Promise;

/* Package-scope variables */
var enableDebugLogging, publishComposite;

var require = meteorInstall({"node_modules":{"meteor":{"reywood:publish-composite":{"lib":{"publish_composite.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/reywood_publish-composite/lib/publish_composite.js                                                     //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
module.export({
    enableDebugLogging: () => enableDebugLogging,
    publishComposite: () => publishComposite
});

let _;

module.watch(require("meteor/underscore"), {
    _(v) {
        _ = v;
    }

}, 0);
let Meteor;
module.watch(require("meteor/meteor"), {
    Meteor(v) {
        Meteor = v;
    }

}, 1);
let Publication;
module.watch(require("./publication"), {
    default(v) {
        Publication = v;
    }

}, 2);
let Subscription;
module.watch(require("./subscription"), {
    default(v) {
        Subscription = v;
    }

}, 3);
let debugLog, enableDebugLogging;
module.watch(require("./logging"), {
    debugLog(v) {
        debugLog = v;
    },

    enableDebugLogging(v) {
        enableDebugLogging = v;
    }

}, 4);

function publishComposite(name, options) {
    return Meteor.publish(name, function publish(...args) {
        const subscription = new Subscription(this);
        const instanceOptions = prepareOptions.call(this, options, args);
        const publications = [];
        instanceOptions.forEach(opt => {
            const pub = new Publication(subscription, opt);
            pub.publish();
            publications.push(pub);
        });
        this.onStop(() => {
            publications.forEach(pub => pub.unpublish());
        });
        debugLog('Meteor.publish', 'ready');
        this.ready();
    });
} // For backwards compatibility


Meteor.publishComposite = publishComposite;

function prepareOptions(options, args) {
    let preparedOptions = options;

    if (typeof preparedOptions === 'function') {
        preparedOptions = preparedOptions.apply(this, args);
    }

    if (!preparedOptions) {
        return [];
    }

    if (!_.isArray(preparedOptions)) {
        preparedOptions = [preparedOptions];
    }

    return preparedOptions;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"doc_ref_counter.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/reywood_publish-composite/lib/doc_ref_counter.js                                                       //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
class DocumentRefCounter {
    constructor(observer) {
        this.heap = {};
        this.observer = observer;
    }

    increment(collectionName, docId) {
        const key = `${collectionName}:${docId.valueOf()}`;

        if (!this.heap[key]) {
            this.heap[key] = 0;
        }

        this.heap[key] += 1;
    }

    decrement(collectionName, docId) {
        const key = `${collectionName}:${docId.valueOf()}`;

        if (this.heap[key]) {
            this.heap[key] -= 1;
            this.observer.onChange(collectionName, docId, this.heap[key]);
        }
    }

}

module.exportDefault(DocumentRefCounter);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"logging.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/reywood_publish-composite/lib/logging.js                                                               //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
module.export({
    debugLog: () => debugLog,
    enableDebugLogging: () => enableDebugLogging
});
/* eslint-disable no-console */let debugLoggingEnabled = false;

function debugLog(source, message) {
    if (!debugLoggingEnabled) {
        return;
    }

    let paddedSource = source;

    while (paddedSource.length < 35) {
        paddedSource += ' ';
    }

    console.log(`[${paddedSource}] ${message}`);
}

function enableDebugLogging() {
    debugLoggingEnabled = true;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"publication.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/reywood_publish-composite/lib/publication.js                                                           //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
let Meteor;
module.watch(require("meteor/meteor"), {
    Meteor(v) {
        Meteor = v;
    }

}, 0);
let Match, check;
module.watch(require("meteor/check"), {
    Match(v) {
        Match = v;
    },

    check(v) {
        check = v;
    }

}, 1);

let _;

module.watch(require("meteor/underscore"), {
    _(v) {
        _ = v;
    }

}, 2);
let debugLog;
module.watch(require("./logging"), {
    debugLog(v) {
        debugLog = v;
    }

}, 3);
let PublishedDocumentList;
module.watch(require("./published_document_list"), {
    default(v) {
        PublishedDocumentList = v;
    }

}, 4);

class Publication {
    constructor(subscription, options, args) {
        check(options, {
            find: Function,
            children: Match.Optional([Object]),
            collectionName: Match.Optional(String)
        });
        this.subscription = subscription;
        this.options = options;
        this.args = args || [];
        this.childrenOptions = options.children || [];
        this.publishedDocs = new PublishedDocumentList();
        this.collectionName = options.collectionName;
    }

    publish() {
        this.cursor = this._getCursor();

        if (!this.cursor) {
            return;
        }

        const collectionName = this._getCollectionName(); // Use Meteor.bindEnvironment to make sure the callbacks are run with the same
        // environmentVariables as when publishing the "parent".
        // It's only needed when publish is being recursively run.


        this.observeHandle = this.cursor.observe({
            added: Meteor.bindEnvironment(doc => {
                const alreadyPublished = this.publishedDocs.has(doc._id);

                if (alreadyPublished) {
                    debugLog('Publication.observeHandle.added', `${collectionName}:${doc._id} already published`);
                    this.publishedDocs.unflagForRemoval(doc._id);

                    this._republishChildrenOf(doc);

                    this.subscription.changed(collectionName, doc._id, doc);
                } else {
                    this.publishedDocs.add(collectionName, doc._id);

                    this._publishChildrenOf(doc);

                    this.subscription.added(collectionName, doc);
                }
            }),
            changed: Meteor.bindEnvironment(newDoc => {
                debugLog('Publication.observeHandle.changed', `${collectionName}:${newDoc._id}`);

                this._republishChildrenOf(newDoc);
            }),
            removed: doc => {
                debugLog('Publication.observeHandle.removed', `${collectionName}:${doc._id}`);

                this._removeDoc(collectionName, doc._id);
            }
        });
        this.observeChangesHandle = this.cursor.observeChanges({
            changed: (id, fields) => {
                debugLog('Publication.observeChangesHandle.changed', `${collectionName}:${id}`);
                this.subscription.changed(collectionName, id, fields);
            }
        });
    }

    unpublish() {
        debugLog('Publication.unpublish', this._getCollectionName());

        this._stopObservingCursor();

        this._unpublishAllDocuments();
    }

    _republish() {
        this._stopObservingCursor();

        this.publishedDocs.flagAllForRemoval();
        debugLog('Publication._republish', 'run .publish again');
        this.publish();
        debugLog('Publication._republish', 'unpublish docs from old cursor');

        this._removeFlaggedDocs();
    }

    _getCursor() {
        return this.options.find.apply(this.subscription.meteorSub, this.args);
    }

    _getCollectionName() {
        return this.collectionName || this.cursor && this.cursor._getCollectionName();
    }

    _publishChildrenOf(doc) {
        _.each(this.childrenOptions, function createChildPublication(options) {
            const pub = new Publication(this.subscription, options, [doc].concat(this.args));
            this.publishedDocs.addChildPub(doc._id, pub);
            pub.publish();
        }, this);
    }

    _republishChildrenOf(doc) {
        this.publishedDocs.eachChildPub(doc._id, publication => {
            publication.args[0] = doc;

            publication._republish();
        });
    }

    _unpublishAllDocuments() {
        this.publishedDocs.eachDocument(doc => {
            this._removeDoc(doc.collectionName, doc.docId);
        }, this);
    }

    _stopObservingCursor() {
        debugLog('Publication._stopObservingCursor', 'stop observing cursor');

        if (this.observeHandle) {
            this.observeHandle.stop();
            delete this.observeHandle;
        }

        if (this.observeChangesHandle) {
            this.observeChangesHandle.stop();
            delete this.observeChangesHandle;
        }
    }

    _removeFlaggedDocs() {
        this.publishedDocs.eachDocument(doc => {
            if (doc.isFlaggedForRemoval()) {
                this._removeDoc(doc.collectionName, doc.docId);
            }
        }, this);
    }

    _removeDoc(collectionName, docId) {
        this.subscription.removed(collectionName, docId);

        this._unpublishChildrenOf(docId);

        this.publishedDocs.remove(docId);
    }

    _unpublishChildrenOf(docId) {
        debugLog('Publication._unpublishChildrenOf', `unpublishing children of ${this._getCollectionName()}:${docId}`);
        this.publishedDocs.eachChildPub(docId, publication => {
            publication.unpublish();
        });
    }

}

module.exportDefault(Publication);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"subscription.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/reywood_publish-composite/lib/subscription.js                                                          //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
let _;

module.watch(require("meteor/underscore"), {
    _(v) {
        _ = v;
    }

}, 0);
let DocumentRefCounter;
module.watch(require("./doc_ref_counter"), {
    default(v) {
        DocumentRefCounter = v;
    }

}, 1);
let debugLog;
module.watch(require("./logging"), {
    debugLog(v) {
        debugLog = v;
    }

}, 2);

class Subscription {
    constructor(meteorSub) {
        this.meteorSub = meteorSub;
        this.docHash = {};
        this.refCounter = new DocumentRefCounter({
            onChange: (collectionName, docId, refCount) => {
                debugLog('Subscription.refCounter.onChange', `${collectionName}:${docId.valueOf()} ${refCount}`);

                if (refCount <= 0) {
                    meteorSub.removed(collectionName, docId);

                    this._removeDocHash(collectionName, docId);
                }
            }
        });
    }

    added(collectionName, doc) {
        this.refCounter.increment(collectionName, doc._id);

        if (this._hasDocChanged(collectionName, doc._id, doc)) {
            debugLog('Subscription.added', `${collectionName}:${doc._id}`);
            this.meteorSub.added(collectionName, doc._id, doc);

            this._addDocHash(collectionName, doc);
        }
    }

    changed(collectionName, id, changes) {
        if (this._shouldSendChanges(collectionName, id, changes)) {
            debugLog('Subscription.changed', `${collectionName}:${id}`);
            this.meteorSub.changed(collectionName, id, changes);

            this._updateDocHash(collectionName, id, changes);
        }
    }

    removed(collectionName, id) {
        debugLog('Subscription.removed', `${collectionName}:${id.valueOf()}`);
        this.refCounter.decrement(collectionName, id);
    }

    _addDocHash(collectionName, doc) {
        this.docHash[buildHashKey(collectionName, doc._id)] = doc;
    }

    _updateDocHash(collectionName, id, changes) {
        const key = buildHashKey(collectionName, id);
        const existingDoc = this.docHash[key] || {};
        this.docHash[key] = _.extend(existingDoc, changes);
    }

    _shouldSendChanges(collectionName, id, changes) {
        return this._isDocPublished(collectionName, id) && this._hasDocChanged(collectionName, id, changes);
    }

    _isDocPublished(collectionName, id) {
        const key = buildHashKey(collectionName, id);
        return !!this.docHash[key];
    }

    _hasDocChanged(collectionName, id, doc) {
        const existingDoc = this.docHash[buildHashKey(collectionName, id)];

        if (!existingDoc) {
            return true;
        }

        return _.any(_.keys(doc), key => !_.isEqual(doc[key], existingDoc[key]));
    }

    _removeDocHash(collectionName, id) {
        const key = buildHashKey(collectionName, id);
        delete this.docHash[key];
    }

}

function buildHashKey(collectionName, id) {
    return `${collectionName}::${id.valueOf()}`;
}

module.exportDefault(Subscription);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"published_document.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/reywood_publish-composite/lib/published_document.js                                                    //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
class PublishedDocument {
    constructor(collectionName, docId) {
        this.collectionName = collectionName;
        this.docId = docId;
        this.childPublications = [];
        this._isFlaggedForRemoval = false;
    }

    addChildPub(childPublication) {
        this.childPublications.push(childPublication);
    }

    eachChildPub(callback) {
        this.childPublications.forEach(callback);
    }

    isFlaggedForRemoval() {
        return this._isFlaggedForRemoval;
    }

    unflagForRemoval() {
        this._isFlaggedForRemoval = false;
    }

    flagForRemoval() {
        this._isFlaggedForRemoval = true;
    }

}

module.exportDefault(PublishedDocument);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

},"published_document_list.js":function(require,exports,module){

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//                                                                                                                 //
// packages/reywood_publish-composite/lib/published_document_list.js                                               //
//                                                                                                                 //
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
                                                                                                                   //
let _;

module.watch(require("meteor/underscore"), {
    _(v) {
        _ = v;
    }

}, 0);
let PublishedDocument;
module.watch(require("./published_document"), {
    default(v) {
        PublishedDocument = v;
    }

}, 1);

class PublishedDocumentList {
    constructor() {
        this.documents = {};
    }

    add(collectionName, docId) {
        const key = valueOfId(docId);

        if (!this.documents[key]) {
            this.documents[key] = new PublishedDocument(collectionName, docId);
        }
    }

    addChildPub(docId, publication) {
        if (!publication) {
            return;
        }

        const key = valueOfId(docId);
        const doc = this.documents[key];

        if (typeof doc === 'undefined') {
            throw new Error(`Doc not found in list: ${key}`);
        }

        this.documents[key].addChildPub(publication);
    }

    get(docId) {
        const key = valueOfId(docId);
        return this.documents[key];
    }

    remove(docId) {
        const key = valueOfId(docId);
        delete this.documents[key];
    }

    has(docId) {
        return !!this.get(docId);
    }

    eachDocument(callback, context) {
        _.each(this.documents, function execCallbackOnDoc(doc) {
            callback.call(this, doc);
        }, context || this);
    }

    eachChildPub(docId, callback) {
        const doc = this.get(docId);

        if (doc) {
            doc.eachChildPub(callback);
        }
    }

    getIds() {
        const docIds = [];
        this.eachDocument(doc => {
            docIds.push(doc.docId);
        });
        return docIds;
    }

    unflagForRemoval(docId) {
        const doc = this.get(docId);

        if (doc) {
            doc.unflagForRemoval();
        }
    }

    flagAllForRemoval() {
        this.eachDocument(doc => {
            doc.flagForRemoval();
        });
    }

}

function valueOfId(docId) {
    if (docId === null) {
        throw new Error('Document ID is null');
    }

    if (typeof docId === 'undefined') {
        throw new Error('Document ID is undefined');
    }

    return docId.valueOf();
}

module.exportDefault(PublishedDocumentList);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

}}}}}},{
  "extensions": [
    ".js",
    ".json"
  ]
});
var exports = require("./node_modules/meteor/reywood:publish-composite/lib/publish_composite.js");
require("./node_modules/meteor/reywood:publish-composite/lib/doc_ref_counter.js");
require("./node_modules/meteor/reywood:publish-composite/lib/logging.js");
require("./node_modules/meteor/reywood:publish-composite/lib/publication.js");
require("./node_modules/meteor/reywood:publish-composite/lib/subscription.js");

/* Exports */
if (typeof Package === 'undefined') Package = {};
(function (pkg, symbols) {
  for (var s in symbols)
    (s in pkg) || (pkg[s] = symbols[s]);
})(Package['reywood:publish-composite'] = exports, {
  enableDebugLogging: enableDebugLogging,
  publishComposite: publishComposite
});

})();

//# sourceURL=meteor://💻app/packages/reywood_publish-composite.js
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcmV5d29vZDpwdWJsaXNoLWNvbXBvc2l0ZS9saWIvcHVibGlzaF9jb21wb3NpdGUuanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3JleXdvb2Q6cHVibGlzaC1jb21wb3NpdGUvbGliL2RvY19yZWZfY291bnRlci5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcmV5d29vZDpwdWJsaXNoLWNvbXBvc2l0ZS9saWIvbG9nZ2luZy5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcmV5d29vZDpwdWJsaXNoLWNvbXBvc2l0ZS9saWIvcHVibGljYXRpb24uanMiLCJtZXRlb3I6Ly/wn5K7YXBwL3BhY2thZ2VzL3JleXdvb2Q6cHVibGlzaC1jb21wb3NpdGUvbGliL3N1YnNjcmlwdGlvbi5qcyIsIm1ldGVvcjovL/CfkrthcHAvcGFja2FnZXMvcmV5d29vZDpwdWJsaXNoLWNvbXBvc2l0ZS9saWIvcHVibGlzaGVkX2RvY3VtZW50LmpzIiwibWV0ZW9yOi8v8J+Su2FwcC9wYWNrYWdlcy9yZXl3b29kOnB1Ymxpc2gtY29tcG9zaXRlL2xpYi9wdWJsaXNoZWRfZG9jdW1lbnRfbGlzdC5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnQiLCJlbmFibGVEZWJ1Z0xvZ2dpbmciLCJwdWJsaXNoQ29tcG9zaXRlIiwiXyIsIndhdGNoIiwicmVxdWlyZSIsInYiLCJNZXRlb3IiLCJQdWJsaWNhdGlvbiIsImRlZmF1bHQiLCJTdWJzY3JpcHRpb24iLCJkZWJ1Z0xvZyIsIm5hbWUiLCJvcHRpb25zIiwicHVibGlzaCIsImFyZ3MiLCJzdWJzY3JpcHRpb24iLCJpbnN0YW5jZU9wdGlvbnMiLCJwcmVwYXJlT3B0aW9ucyIsImNhbGwiLCJwdWJsaWNhdGlvbnMiLCJmb3JFYWNoIiwib3B0IiwicHViIiwicHVzaCIsIm9uU3RvcCIsInVucHVibGlzaCIsInJlYWR5IiwicHJlcGFyZWRPcHRpb25zIiwiYXBwbHkiLCJpc0FycmF5IiwiRG9jdW1lbnRSZWZDb3VudGVyIiwiY29uc3RydWN0b3IiLCJvYnNlcnZlciIsImhlYXAiLCJpbmNyZW1lbnQiLCJjb2xsZWN0aW9uTmFtZSIsImRvY0lkIiwia2V5IiwidmFsdWVPZiIsImRlY3JlbWVudCIsIm9uQ2hhbmdlIiwiZXhwb3J0RGVmYXVsdCIsImRlYnVnTG9nZ2luZ0VuYWJsZWQiLCJzb3VyY2UiLCJtZXNzYWdlIiwicGFkZGVkU291cmNlIiwibGVuZ3RoIiwiY29uc29sZSIsImxvZyIsIk1hdGNoIiwiY2hlY2siLCJQdWJsaXNoZWREb2N1bWVudExpc3QiLCJmaW5kIiwiRnVuY3Rpb24iLCJjaGlsZHJlbiIsIk9wdGlvbmFsIiwiT2JqZWN0IiwiU3RyaW5nIiwiY2hpbGRyZW5PcHRpb25zIiwicHVibGlzaGVkRG9jcyIsImN1cnNvciIsIl9nZXRDdXJzb3IiLCJfZ2V0Q29sbGVjdGlvbk5hbWUiLCJvYnNlcnZlSGFuZGxlIiwib2JzZXJ2ZSIsImFkZGVkIiwiYmluZEVudmlyb25tZW50IiwiZG9jIiwiYWxyZWFkeVB1Ymxpc2hlZCIsImhhcyIsIl9pZCIsInVuZmxhZ0ZvclJlbW92YWwiLCJfcmVwdWJsaXNoQ2hpbGRyZW5PZiIsImNoYW5nZWQiLCJhZGQiLCJfcHVibGlzaENoaWxkcmVuT2YiLCJuZXdEb2MiLCJyZW1vdmVkIiwiX3JlbW92ZURvYyIsIm9ic2VydmVDaGFuZ2VzSGFuZGxlIiwib2JzZXJ2ZUNoYW5nZXMiLCJpZCIsImZpZWxkcyIsIl9zdG9wT2JzZXJ2aW5nQ3Vyc29yIiwiX3VucHVibGlzaEFsbERvY3VtZW50cyIsIl9yZXB1Ymxpc2giLCJmbGFnQWxsRm9yUmVtb3ZhbCIsIl9yZW1vdmVGbGFnZ2VkRG9jcyIsIm1ldGVvclN1YiIsImVhY2giLCJjcmVhdGVDaGlsZFB1YmxpY2F0aW9uIiwiY29uY2F0IiwiYWRkQ2hpbGRQdWIiLCJlYWNoQ2hpbGRQdWIiLCJwdWJsaWNhdGlvbiIsImVhY2hEb2N1bWVudCIsInN0b3AiLCJpc0ZsYWdnZWRGb3JSZW1vdmFsIiwiX3VucHVibGlzaENoaWxkcmVuT2YiLCJyZW1vdmUiLCJkb2NIYXNoIiwicmVmQ291bnRlciIsInJlZkNvdW50IiwiX3JlbW92ZURvY0hhc2giLCJfaGFzRG9jQ2hhbmdlZCIsIl9hZGREb2NIYXNoIiwiY2hhbmdlcyIsIl9zaG91bGRTZW5kQ2hhbmdlcyIsIl91cGRhdGVEb2NIYXNoIiwiYnVpbGRIYXNoS2V5IiwiZXhpc3RpbmdEb2MiLCJleHRlbmQiLCJfaXNEb2NQdWJsaXNoZWQiLCJhbnkiLCJrZXlzIiwiaXNFcXVhbCIsIlB1Ymxpc2hlZERvY3VtZW50IiwiY2hpbGRQdWJsaWNhdGlvbnMiLCJfaXNGbGFnZ2VkRm9yUmVtb3ZhbCIsImNoaWxkUHVibGljYXRpb24iLCJjYWxsYmFjayIsImZsYWdGb3JSZW1vdmFsIiwiZG9jdW1lbnRzIiwidmFsdWVPZklkIiwiRXJyb3IiLCJnZXQiLCJjb250ZXh0IiwiZXhlY0NhbGxiYWNrT25Eb2MiLCJnZXRJZHMiLCJkb2NJZHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQUEsT0FBT0MsTUFBUCxDQUFjO0FBQUNDLHdCQUFtQixNQUFJQSxrQkFBeEI7QUFBMkNDLHNCQUFpQixNQUFJQTtBQUFoRSxDQUFkOztBQUFpRyxJQUFJQyxDQUFKOztBQUFNSixPQUFPSyxLQUFQLENBQWFDLFFBQVEsbUJBQVIsQ0FBYixFQUEwQztBQUFDRixNQUFFRyxDQUFGLEVBQUk7QUFBQ0gsWUFBRUcsQ0FBRjtBQUFJOztBQUFWLENBQTFDLEVBQXNELENBQXREO0FBQXlELElBQUlDLE1BQUo7QUFBV1IsT0FBT0ssS0FBUCxDQUFhQyxRQUFRLGVBQVIsQ0FBYixFQUFzQztBQUFDRSxXQUFPRCxDQUFQLEVBQVM7QUFBQ0MsaUJBQU9ELENBQVA7QUFBUzs7QUFBcEIsQ0FBdEMsRUFBNEQsQ0FBNUQ7QUFBK0QsSUFBSUUsV0FBSjtBQUFnQlQsT0FBT0ssS0FBUCxDQUFhQyxRQUFRLGVBQVIsQ0FBYixFQUFzQztBQUFDSSxZQUFR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QUFVLDBCQUFWLENBQU47QUFDSDs7QUFDRCxXQUFPeEYsTUFBTUUsT0FBTixFQUFQO0FBQ0g7O0FBNUZEeEMsT0FBTzJDLGFBQVAsQ0E4RmVVLHFCQTlGZixFIiwiZmlsZSI6Ii9wYWNrYWdlcy9yZXl3b29kX3B1Ymxpc2gtY29tcG9zaXRlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgXyB9IGZyb20gJ21ldGVvci91bmRlcnNjb3JlJztcbmltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuXG5pbXBvcnQgUHVibGljYXRpb24gZnJvbSAnLi9wdWJsaWNhdGlvbic7XG5pbXBvcnQgU3Vic2NyaXB0aW9uIGZyb20gJy4vc3Vic2NyaXB0aW9uJztcbmltcG9ydCB7IGRlYnVnTG9nLCBlbmFibGVEZWJ1Z0xvZ2dpbmcgfSBmcm9tICcuL2xvZ2dpbmcnO1xuXG5cbmZ1bmN0aW9uIHB1Ymxpc2hDb21wb3NpdGUobmFtZSwgb3B0aW9ucykge1xuICAgIHJldHVybiBNZXRlb3IucHVibGlzaChuYW1lLCBmdW5jdGlvbiBwdWJsaXNoKC4uLmFyZ3MpIHtcbiAgICAgICAgY29uc3Qgc3Vic2NyaXB0aW9uID0gbmV3IFN1YnNjcmlwdGlvbih0aGlzKTtcbiAgICAgICAgY29uc3QgaW5zdGFuY2VPcHRpb25zID0gcHJlcGFyZU9wdGlvbnMuY2FsbCh0aGlzLCBvcHRpb25zLCBhcmdzKTtcbiAgICAgICAgY29uc3QgcHVibGljYXRpb25zID0gW107XG5cbiAgICAgICAgaW5zdGFuY2VPcHRpb25zLmZvckVhY2goKG9wdCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcHViID0gbmV3IFB1YmxpY2F0aW9uKHN1YnNjcmlwdGlvbiwgb3B0KTtcbiAgICAgICAgICAgIHB1Yi5wdWJsaXNoKCk7XG4gICAgICAgICAgICBwdWJsaWNhdGlvbnMucHVzaChwdWIpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm9uU3RvcCgoKSA9PiB7XG4gICAgICAgICAgICBwdWJsaWNhdGlvbnMuZm9yRWFjaChwdWIgPT4gcHViLnVucHVibGlzaCgpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZGVidWdMb2coJ01ldGVvci5wdWJsaXNoJywgJ3JlYWR5Jyk7XG4gICAgICAgIHRoaXMucmVhZHkoKTtcbiAgICB9KTtcbn1cblxuLy8gRm9yIGJhY2t3YXJkcyBjb21wYXRpYmlsaXR5XG5NZXRlb3IucHVibGlzaENvbXBvc2l0ZSA9IHB1Ymxpc2hDb21wb3NpdGU7XG5cbmZ1bmN0aW9uIHByZXBhcmVPcHRpb25zKG9wdGlvbnMsIGFyZ3MpIHtcbiAgICBsZXQgcHJlcGFyZWRPcHRpb25zID0gb3B0aW9ucztcblxuICAgIGlmICh0eXBlb2YgcHJlcGFyZWRPcHRpb25zID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHByZXBhcmVkT3B0aW9ucyA9IHByZXBhcmVkT3B0aW9ucy5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG5cbiAgICBpZiAoIXByZXBhcmVkT3B0aW9ucykge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuXG4gICAgaWYgKCFfLmlzQXJyYXkocHJlcGFyZWRPcHRpb25zKSkge1xuICAgICAgICBwcmVwYXJlZE9wdGlvbnMgPSBbcHJlcGFyZWRPcHRpb25zXTtcbiAgICB9XG5cbiAgICByZXR1cm4gcHJlcGFyZWRPcHRpb25zO1xufVxuXG5cbmV4cG9ydCB7XG4gICAgZW5hYmxlRGVidWdMb2dnaW5nLFxuICAgIHB1Ymxpc2hDb21wb3NpdGUsXG59O1xuIiwiY2xhc3MgRG9jdW1lbnRSZWZDb3VudGVyIHtcbiAgICBjb25zdHJ1Y3RvcihvYnNlcnZlcikge1xuICAgICAgICB0aGlzLmhlYXAgPSB7fTtcbiAgICAgICAgdGhpcy5vYnNlcnZlciA9IG9ic2VydmVyO1xuICAgIH1cblxuICAgIGluY3JlbWVudChjb2xsZWN0aW9uTmFtZSwgZG9jSWQpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gYCR7Y29sbGVjdGlvbk5hbWV9OiR7ZG9jSWQudmFsdWVPZigpfWA7XG4gICAgICAgIGlmICghdGhpcy5oZWFwW2tleV0pIHtcbiAgICAgICAgICAgIHRoaXMuaGVhcFtrZXldID0gMDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhlYXBba2V5XSArPSAxO1xuICAgIH1cblxuICAgIGRlY3JlbWVudChjb2xsZWN0aW9uTmFtZSwgZG9jSWQpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gYCR7Y29sbGVjdGlvbk5hbWV9OiR7ZG9jSWQudmFsdWVPZigpfWA7XG4gICAgICAgIGlmICh0aGlzLmhlYXBba2V5XSkge1xuICAgICAgICAgICAgdGhpcy5oZWFwW2tleV0gLT0gMTtcblxuICAgICAgICAgICAgdGhpcy5vYnNlcnZlci5vbkNoYW5nZShjb2xsZWN0aW9uTmFtZSwgZG9jSWQsIHRoaXMuaGVhcFtrZXldKTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRG9jdW1lbnRSZWZDb3VudGVyO1xuIiwiLyogZXNsaW50LWRpc2FibGUgbm8tY29uc29sZSAqL1xuXG5sZXQgZGVidWdMb2dnaW5nRW5hYmxlZCA9IGZhbHNlO1xuXG5mdW5jdGlvbiBkZWJ1Z0xvZyhzb3VyY2UsIG1lc3NhZ2UpIHtcbiAgICBpZiAoIWRlYnVnTG9nZ2luZ0VuYWJsZWQpIHsgcmV0dXJuOyB9XG4gICAgbGV0IHBhZGRlZFNvdXJjZSA9IHNvdXJjZTtcbiAgICB3aGlsZSAocGFkZGVkU291cmNlLmxlbmd0aCA8IDM1KSB7IHBhZGRlZFNvdXJjZSArPSAnICc7IH1cbiAgICBjb25zb2xlLmxvZyhgWyR7cGFkZGVkU291cmNlfV0gJHttZXNzYWdlfWApO1xufVxuXG5mdW5jdGlvbiBlbmFibGVEZWJ1Z0xvZ2dpbmcoKSB7XG4gICAgZGVidWdMb2dnaW5nRW5hYmxlZCA9IHRydWU7XG59XG5cbmV4cG9ydCB7XG4gICAgZGVidWdMb2csXG4gICAgZW5hYmxlRGVidWdMb2dnaW5nLFxufTtcbiIsImltcG9ydCB7IE1ldGVvciB9IGZyb20gJ21ldGVvci9tZXRlb3InO1xuaW1wb3J0IHsgTWF0Y2gsIGNoZWNrIH0gZnJvbSAnbWV0ZW9yL2NoZWNrJztcbmltcG9ydCB7IF8gfSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5cbmltcG9ydCB7IGRlYnVnTG9nIH0gZnJvbSAnLi9sb2dnaW5nJztcbmltcG9ydCBQdWJsaXNoZWREb2N1bWVudExpc3QgZnJvbSAnLi9wdWJsaXNoZWRfZG9jdW1lbnRfbGlzdCc7XG5cblxuY2xhc3MgUHVibGljYXRpb24ge1xuICAgIGNvbnN0cnVjdG9yKHN1YnNjcmlwdGlvbiwgb3B0aW9ucywgYXJncykge1xuICAgICAgICBjaGVjayhvcHRpb25zLCB7XG4gICAgICAgICAgICBmaW5kOiBGdW5jdGlvbixcbiAgICAgICAgICAgIGNoaWxkcmVuOiBNYXRjaC5PcHRpb25hbChbT2JqZWN0XSksXG4gICAgICAgICAgICBjb2xsZWN0aW9uTmFtZTogTWF0Y2guT3B0aW9uYWwoU3RyaW5nKSxcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5zdWJzY3JpcHRpb24gPSBzdWJzY3JpcHRpb247XG4gICAgICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgICAgIHRoaXMuYXJncyA9IGFyZ3MgfHwgW107XG4gICAgICAgIHRoaXMuY2hpbGRyZW5PcHRpb25zID0gb3B0aW9ucy5jaGlsZHJlbiB8fCBbXTtcbiAgICAgICAgdGhpcy5wdWJsaXNoZWREb2NzID0gbmV3IFB1Ymxpc2hlZERvY3VtZW50TGlzdCgpO1xuICAgICAgICB0aGlzLmNvbGxlY3Rpb25OYW1lID0gb3B0aW9ucy5jb2xsZWN0aW9uTmFtZTtcbiAgICB9XG5cbiAgICBwdWJsaXNoKCkge1xuICAgICAgICB0aGlzLmN1cnNvciA9IHRoaXMuX2dldEN1cnNvcigpO1xuICAgICAgICBpZiAoIXRoaXMuY3Vyc29yKSB7IHJldHVybjsgfVxuXG4gICAgICAgIGNvbnN0IGNvbGxlY3Rpb25OYW1lID0gdGhpcy5fZ2V0Q29sbGVjdGlvbk5hbWUoKTtcblxuICAgICAgICAvLyBVc2UgTWV0ZW9yLmJpbmRFbnZpcm9ubWVudCB0byBtYWtlIHN1cmUgdGhlIGNhbGxiYWNrcyBhcmUgcnVuIHdpdGggdGhlIHNhbWVcbiAgICAgICAgLy8gZW52aXJvbm1lbnRWYXJpYWJsZXMgYXMgd2hlbiBwdWJsaXNoaW5nIHRoZSBcInBhcmVudFwiLlxuICAgICAgICAvLyBJdCdzIG9ubHkgbmVlZGVkIHdoZW4gcHVibGlzaCBpcyBiZWluZyByZWN1cnNpdmVseSBydW4uXG4gICAgICAgIHRoaXMub2JzZXJ2ZUhhbmRsZSA9IHRoaXMuY3Vyc29yLm9ic2VydmUoe1xuICAgICAgICAgICAgYWRkZWQ6IE1ldGVvci5iaW5kRW52aXJvbm1lbnQoKGRvYykgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGFscmVhZHlQdWJsaXNoZWQgPSB0aGlzLnB1Ymxpc2hlZERvY3MuaGFzKGRvYy5faWQpO1xuXG4gICAgICAgICAgICAgICAgaWYgKGFscmVhZHlQdWJsaXNoZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVidWdMb2coJ1B1YmxpY2F0aW9uLm9ic2VydmVIYW5kbGUuYWRkZWQnLCBgJHtjb2xsZWN0aW9uTmFtZX06JHtkb2MuX2lkfSBhbHJlYWR5IHB1Ymxpc2hlZGApO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnB1Ymxpc2hlZERvY3MudW5mbGFnRm9yUmVtb3ZhbChkb2MuX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmVwdWJsaXNoQ2hpbGRyZW5PZihkb2MpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbi5jaGFuZ2VkKGNvbGxlY3Rpb25OYW1lLCBkb2MuX2lkLCBkb2MpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHVibGlzaGVkRG9jcy5hZGQoY29sbGVjdGlvbk5hbWUsIGRvYy5faWQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9wdWJsaXNoQ2hpbGRyZW5PZihkb2MpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnN1YnNjcmlwdGlvbi5hZGRlZChjb2xsZWN0aW9uTmFtZSwgZG9jKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSxcbiAgICAgICAgICAgIGNoYW5nZWQ6IE1ldGVvci5iaW5kRW52aXJvbm1lbnQoKG5ld0RvYykgPT4ge1xuICAgICAgICAgICAgICAgIGRlYnVnTG9nKCdQdWJsaWNhdGlvbi5vYnNlcnZlSGFuZGxlLmNoYW5nZWQnLCBgJHtjb2xsZWN0aW9uTmFtZX06JHtuZXdEb2MuX2lkfWApO1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlcHVibGlzaENoaWxkcmVuT2YobmV3RG9jKTtcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgcmVtb3ZlZDogKGRvYykgPT4ge1xuICAgICAgICAgICAgICAgIGRlYnVnTG9nKCdQdWJsaWNhdGlvbi5vYnNlcnZlSGFuZGxlLnJlbW92ZWQnLCBgJHtjb2xsZWN0aW9uTmFtZX06JHtkb2MuX2lkfWApO1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZURvYyhjb2xsZWN0aW9uTmFtZSwgZG9jLl9pZCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLm9ic2VydmVDaGFuZ2VzSGFuZGxlID0gdGhpcy5jdXJzb3Iub2JzZXJ2ZUNoYW5nZXMoe1xuICAgICAgICAgICAgY2hhbmdlZDogKGlkLCBmaWVsZHMpID0+IHtcbiAgICAgICAgICAgICAgICBkZWJ1Z0xvZygnUHVibGljYXRpb24ub2JzZXJ2ZUNoYW5nZXNIYW5kbGUuY2hhbmdlZCcsIGAke2NvbGxlY3Rpb25OYW1lfToke2lkfWApO1xuICAgICAgICAgICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLmNoYW5nZWQoY29sbGVjdGlvbk5hbWUsIGlkLCBmaWVsZHMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdW5wdWJsaXNoKCkge1xuICAgICAgICBkZWJ1Z0xvZygnUHVibGljYXRpb24udW5wdWJsaXNoJywgdGhpcy5fZ2V0Q29sbGVjdGlvbk5hbWUoKSk7XG4gICAgICAgIHRoaXMuX3N0b3BPYnNlcnZpbmdDdXJzb3IoKTtcbiAgICAgICAgdGhpcy5fdW5wdWJsaXNoQWxsRG9jdW1lbnRzKCk7XG4gICAgfVxuXG4gICAgX3JlcHVibGlzaCgpIHtcbiAgICAgICAgdGhpcy5fc3RvcE9ic2VydmluZ0N1cnNvcigpO1xuXG4gICAgICAgIHRoaXMucHVibGlzaGVkRG9jcy5mbGFnQWxsRm9yUmVtb3ZhbCgpO1xuXG4gICAgICAgIGRlYnVnTG9nKCdQdWJsaWNhdGlvbi5fcmVwdWJsaXNoJywgJ3J1biAucHVibGlzaCBhZ2FpbicpO1xuICAgICAgICB0aGlzLnB1Ymxpc2goKTtcblxuICAgICAgICBkZWJ1Z0xvZygnUHVibGljYXRpb24uX3JlcHVibGlzaCcsICd1bnB1Ymxpc2ggZG9jcyBmcm9tIG9sZCBjdXJzb3InKTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlRmxhZ2dlZERvY3MoKTtcbiAgICB9XG5cbiAgICBfZ2V0Q3Vyc29yKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmZpbmQuYXBwbHkodGhpcy5zdWJzY3JpcHRpb24ubWV0ZW9yU3ViLCB0aGlzLmFyZ3MpO1xuICAgIH1cblxuICAgIF9nZXRDb2xsZWN0aW9uTmFtZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29sbGVjdGlvbk5hbWUgfHwgKHRoaXMuY3Vyc29yICYmIHRoaXMuY3Vyc29yLl9nZXRDb2xsZWN0aW9uTmFtZSgpKTtcbiAgICB9XG5cbiAgICBfcHVibGlzaENoaWxkcmVuT2YoZG9jKSB7XG4gICAgICAgIF8uZWFjaCh0aGlzLmNoaWxkcmVuT3B0aW9ucywgZnVuY3Rpb24gY3JlYXRlQ2hpbGRQdWJsaWNhdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICBjb25zdCBwdWIgPSBuZXcgUHVibGljYXRpb24odGhpcy5zdWJzY3JpcHRpb24sIG9wdGlvbnMsIFtkb2NdLmNvbmNhdCh0aGlzLmFyZ3MpKTtcbiAgICAgICAgICAgIHRoaXMucHVibGlzaGVkRG9jcy5hZGRDaGlsZFB1Yihkb2MuX2lkLCBwdWIpO1xuICAgICAgICAgICAgcHViLnB1Ymxpc2goKTtcbiAgICAgICAgfSwgdGhpcyk7XG4gICAgfVxuXG4gICAgX3JlcHVibGlzaENoaWxkcmVuT2YoZG9jKSB7XG4gICAgICAgIHRoaXMucHVibGlzaGVkRG9jcy5lYWNoQ2hpbGRQdWIoZG9jLl9pZCwgKHB1YmxpY2F0aW9uKSA9PiB7XG4gICAgICAgICAgICBwdWJsaWNhdGlvbi5hcmdzWzBdID0gZG9jO1xuICAgICAgICAgICAgcHVibGljYXRpb24uX3JlcHVibGlzaCgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBfdW5wdWJsaXNoQWxsRG9jdW1lbnRzKCkge1xuICAgICAgICB0aGlzLnB1Ymxpc2hlZERvY3MuZWFjaERvY3VtZW50KChkb2MpID0+IHtcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZURvYyhkb2MuY29sbGVjdGlvbk5hbWUsIGRvYy5kb2NJZCk7XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH1cblxuICAgIF9zdG9wT2JzZXJ2aW5nQ3Vyc29yKCkge1xuICAgICAgICBkZWJ1Z0xvZygnUHVibGljYXRpb24uX3N0b3BPYnNlcnZpbmdDdXJzb3InLCAnc3RvcCBvYnNlcnZpbmcgY3Vyc29yJyk7XG5cbiAgICAgICAgaWYgKHRoaXMub2JzZXJ2ZUhhbmRsZSkge1xuICAgICAgICAgICAgdGhpcy5vYnNlcnZlSGFuZGxlLnN0b3AoKTtcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLm9ic2VydmVIYW5kbGU7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5vYnNlcnZlQ2hhbmdlc0hhbmRsZSkge1xuICAgICAgICAgICAgdGhpcy5vYnNlcnZlQ2hhbmdlc0hhbmRsZS5zdG9wKCk7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5vYnNlcnZlQ2hhbmdlc0hhbmRsZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIF9yZW1vdmVGbGFnZ2VkRG9jcygpIHtcbiAgICAgICAgdGhpcy5wdWJsaXNoZWREb2NzLmVhY2hEb2N1bWVudCgoZG9jKSA9PiB7XG4gICAgICAgICAgICBpZiAoZG9jLmlzRmxhZ2dlZEZvclJlbW92YWwoKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZURvYyhkb2MuY29sbGVjdGlvbk5hbWUsIGRvYy5kb2NJZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgIH1cblxuICAgIF9yZW1vdmVEb2MoY29sbGVjdGlvbk5hbWUsIGRvY0lkKSB7XG4gICAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnJlbW92ZWQoY29sbGVjdGlvbk5hbWUsIGRvY0lkKTtcbiAgICAgICAgdGhpcy5fdW5wdWJsaXNoQ2hpbGRyZW5PZihkb2NJZCk7XG4gICAgICAgIHRoaXMucHVibGlzaGVkRG9jcy5yZW1vdmUoZG9jSWQpO1xuICAgIH1cblxuICAgIF91bnB1Ymxpc2hDaGlsZHJlbk9mKGRvY0lkKSB7XG4gICAgICAgIGRlYnVnTG9nKCdQdWJsaWNhdGlvbi5fdW5wdWJsaXNoQ2hpbGRyZW5PZicsIGB1bnB1Ymxpc2hpbmcgY2hpbGRyZW4gb2YgJHt0aGlzLl9nZXRDb2xsZWN0aW9uTmFtZSgpfToke2RvY0lkfWApO1xuXG4gICAgICAgIHRoaXMucHVibGlzaGVkRG9jcy5lYWNoQ2hpbGRQdWIoZG9jSWQsIChwdWJsaWNhdGlvbikgPT4ge1xuICAgICAgICAgICAgcHVibGljYXRpb24udW5wdWJsaXNoKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUHVibGljYXRpb247XG4iLCJpbXBvcnQgeyBfIH0gZnJvbSAnbWV0ZW9yL3VuZGVyc2NvcmUnO1xuXG5pbXBvcnQgRG9jdW1lbnRSZWZDb3VudGVyIGZyb20gJy4vZG9jX3JlZl9jb3VudGVyJztcbmltcG9ydCB7IGRlYnVnTG9nIH0gZnJvbSAnLi9sb2dnaW5nJztcblxuXG5jbGFzcyBTdWJzY3JpcHRpb24ge1xuICAgIGNvbnN0cnVjdG9yKG1ldGVvclN1Yikge1xuICAgICAgICB0aGlzLm1ldGVvclN1YiA9IG1ldGVvclN1YjtcbiAgICAgICAgdGhpcy5kb2NIYXNoID0ge307XG4gICAgICAgIHRoaXMucmVmQ291bnRlciA9IG5ldyBEb2N1bWVudFJlZkNvdW50ZXIoe1xuICAgICAgICAgICAgb25DaGFuZ2U6IChjb2xsZWN0aW9uTmFtZSwgZG9jSWQsIHJlZkNvdW50KSA9PiB7XG4gICAgICAgICAgICAgICAgZGVidWdMb2coJ1N1YnNjcmlwdGlvbi5yZWZDb3VudGVyLm9uQ2hhbmdlJywgYCR7Y29sbGVjdGlvbk5hbWV9OiR7ZG9jSWQudmFsdWVPZigpfSAke3JlZkNvdW50fWApO1xuICAgICAgICAgICAgICAgIGlmIChyZWZDb3VudCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG1ldGVvclN1Yi5yZW1vdmVkKGNvbGxlY3Rpb25OYW1lLCBkb2NJZCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX3JlbW92ZURvY0hhc2goY29sbGVjdGlvbk5hbWUsIGRvY0lkKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhZGRlZChjb2xsZWN0aW9uTmFtZSwgZG9jKSB7XG4gICAgICAgIHRoaXMucmVmQ291bnRlci5pbmNyZW1lbnQoY29sbGVjdGlvbk5hbWUsIGRvYy5faWQpO1xuXG4gICAgICAgIGlmICh0aGlzLl9oYXNEb2NDaGFuZ2VkKGNvbGxlY3Rpb25OYW1lLCBkb2MuX2lkLCBkb2MpKSB7XG4gICAgICAgICAgICBkZWJ1Z0xvZygnU3Vic2NyaXB0aW9uLmFkZGVkJywgYCR7Y29sbGVjdGlvbk5hbWV9OiR7ZG9jLl9pZH1gKTtcbiAgICAgICAgICAgIHRoaXMubWV0ZW9yU3ViLmFkZGVkKGNvbGxlY3Rpb25OYW1lLCBkb2MuX2lkLCBkb2MpO1xuICAgICAgICAgICAgdGhpcy5fYWRkRG9jSGFzaChjb2xsZWN0aW9uTmFtZSwgZG9jKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNoYW5nZWQoY29sbGVjdGlvbk5hbWUsIGlkLCBjaGFuZ2VzKSB7XG4gICAgICAgIGlmICh0aGlzLl9zaG91bGRTZW5kQ2hhbmdlcyhjb2xsZWN0aW9uTmFtZSwgaWQsIGNoYW5nZXMpKSB7XG4gICAgICAgICAgICBkZWJ1Z0xvZygnU3Vic2NyaXB0aW9uLmNoYW5nZWQnLCBgJHtjb2xsZWN0aW9uTmFtZX06JHtpZH1gKTtcbiAgICAgICAgICAgIHRoaXMubWV0ZW9yU3ViLmNoYW5nZWQoY29sbGVjdGlvbk5hbWUsIGlkLCBjaGFuZ2VzKTtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZURvY0hhc2goY29sbGVjdGlvbk5hbWUsIGlkLCBjaGFuZ2VzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJlbW92ZWQoY29sbGVjdGlvbk5hbWUsIGlkKSB7XG4gICAgICAgIGRlYnVnTG9nKCdTdWJzY3JpcHRpb24ucmVtb3ZlZCcsIGAke2NvbGxlY3Rpb25OYW1lfToke2lkLnZhbHVlT2YoKX1gKTtcbiAgICAgICAgdGhpcy5yZWZDb3VudGVyLmRlY3JlbWVudChjb2xsZWN0aW9uTmFtZSwgaWQpO1xuICAgIH1cblxuICAgIF9hZGREb2NIYXNoKGNvbGxlY3Rpb25OYW1lLCBkb2MpIHtcbiAgICAgICAgdGhpcy5kb2NIYXNoW2J1aWxkSGFzaEtleShjb2xsZWN0aW9uTmFtZSwgZG9jLl9pZCldID0gZG9jO1xuICAgIH1cblxuICAgIF91cGRhdGVEb2NIYXNoKGNvbGxlY3Rpb25OYW1lLCBpZCwgY2hhbmdlcykge1xuICAgICAgICBjb25zdCBrZXkgPSBidWlsZEhhc2hLZXkoY29sbGVjdGlvbk5hbWUsIGlkKTtcbiAgICAgICAgY29uc3QgZXhpc3RpbmdEb2MgPSB0aGlzLmRvY0hhc2hba2V5XSB8fCB7fTtcbiAgICAgICAgdGhpcy5kb2NIYXNoW2tleV0gPSBfLmV4dGVuZChleGlzdGluZ0RvYywgY2hhbmdlcyk7XG4gICAgfVxuXG4gICAgX3Nob3VsZFNlbmRDaGFuZ2VzKGNvbGxlY3Rpb25OYW1lLCBpZCwgY2hhbmdlcykge1xuICAgICAgICByZXR1cm4gdGhpcy5faXNEb2NQdWJsaXNoZWQoY29sbGVjdGlvbk5hbWUsIGlkKSAmJlxuICAgICAgICAgICAgdGhpcy5faGFzRG9jQ2hhbmdlZChjb2xsZWN0aW9uTmFtZSwgaWQsIGNoYW5nZXMpO1xuICAgIH1cblxuICAgIF9pc0RvY1B1Ymxpc2hlZChjb2xsZWN0aW9uTmFtZSwgaWQpIHtcbiAgICAgICAgY29uc3Qga2V5ID0gYnVpbGRIYXNoS2V5KGNvbGxlY3Rpb25OYW1lLCBpZCk7XG4gICAgICAgIHJldHVybiAhIXRoaXMuZG9jSGFzaFtrZXldO1xuICAgIH1cblxuICAgIF9oYXNEb2NDaGFuZ2VkKGNvbGxlY3Rpb25OYW1lLCBpZCwgZG9jKSB7XG4gICAgICAgIGNvbnN0IGV4aXN0aW5nRG9jID0gdGhpcy5kb2NIYXNoW2J1aWxkSGFzaEtleShjb2xsZWN0aW9uTmFtZSwgaWQpXTtcblxuICAgICAgICBpZiAoIWV4aXN0aW5nRG9jKSB7IHJldHVybiB0cnVlOyB9XG5cbiAgICAgICAgcmV0dXJuIF8uYW55KF8ua2V5cyhkb2MpLCBrZXkgPT4gIV8uaXNFcXVhbChkb2Nba2V5XSwgZXhpc3RpbmdEb2Nba2V5XSkpO1xuICAgIH1cblxuICAgIF9yZW1vdmVEb2NIYXNoKGNvbGxlY3Rpb25OYW1lLCBpZCkge1xuICAgICAgICBjb25zdCBrZXkgPSBidWlsZEhhc2hLZXkoY29sbGVjdGlvbk5hbWUsIGlkKTtcbiAgICAgICAgZGVsZXRlIHRoaXMuZG9jSGFzaFtrZXldO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gYnVpbGRIYXNoS2V5KGNvbGxlY3Rpb25OYW1lLCBpZCkge1xuICAgIHJldHVybiBgJHtjb2xsZWN0aW9uTmFtZX06OiR7aWQudmFsdWVPZigpfWA7XG59XG5cbmV4cG9ydCBkZWZhdWx0IFN1YnNjcmlwdGlvbjtcbiIsImNsYXNzIFB1Ymxpc2hlZERvY3VtZW50IHtcbiAgICBjb25zdHJ1Y3Rvcihjb2xsZWN0aW9uTmFtZSwgZG9jSWQpIHtcbiAgICAgICAgdGhpcy5jb2xsZWN0aW9uTmFtZSA9IGNvbGxlY3Rpb25OYW1lO1xuICAgICAgICB0aGlzLmRvY0lkID0gZG9jSWQ7XG4gICAgICAgIHRoaXMuY2hpbGRQdWJsaWNhdGlvbnMgPSBbXTtcbiAgICAgICAgdGhpcy5faXNGbGFnZ2VkRm9yUmVtb3ZhbCA9IGZhbHNlO1xuICAgIH1cblxuICAgIGFkZENoaWxkUHViKGNoaWxkUHVibGljYXRpb24pIHtcbiAgICAgICAgdGhpcy5jaGlsZFB1YmxpY2F0aW9ucy5wdXNoKGNoaWxkUHVibGljYXRpb24pO1xuICAgIH1cblxuICAgIGVhY2hDaGlsZFB1YihjYWxsYmFjaykge1xuICAgICAgICB0aGlzLmNoaWxkUHVibGljYXRpb25zLmZvckVhY2goY2FsbGJhY2spO1xuICAgIH1cblxuICAgIGlzRmxhZ2dlZEZvclJlbW92YWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9pc0ZsYWdnZWRGb3JSZW1vdmFsO1xuICAgIH1cblxuICAgIHVuZmxhZ0ZvclJlbW92YWwoKSB7XG4gICAgICAgIHRoaXMuX2lzRmxhZ2dlZEZvclJlbW92YWwgPSBmYWxzZTtcbiAgICB9XG5cbiAgICBmbGFnRm9yUmVtb3ZhbCgpIHtcbiAgICAgICAgdGhpcy5faXNGbGFnZ2VkRm9yUmVtb3ZhbCA9IHRydWU7XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQdWJsaXNoZWREb2N1bWVudDtcbiIsImltcG9ydCB7IF8gfSBmcm9tICdtZXRlb3IvdW5kZXJzY29yZSc7XG5cbmltcG9ydCBQdWJsaXNoZWREb2N1bWVudCBmcm9tICcuL3B1Ymxpc2hlZF9kb2N1bWVudCc7XG5cblxuY2xhc3MgUHVibGlzaGVkRG9jdW1lbnRMaXN0IHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5kb2N1bWVudHMgPSB7fTtcbiAgICB9XG5cbiAgICBhZGQoY29sbGVjdGlvbk5hbWUsIGRvY0lkKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IHZhbHVlT2ZJZChkb2NJZCk7XG5cbiAgICAgICAgaWYgKCF0aGlzLmRvY3VtZW50c1trZXldKSB7XG4gICAgICAgICAgICB0aGlzLmRvY3VtZW50c1trZXldID0gbmV3IFB1Ymxpc2hlZERvY3VtZW50KGNvbGxlY3Rpb25OYW1lLCBkb2NJZCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRDaGlsZFB1Yihkb2NJZCwgcHVibGljYXRpb24pIHtcbiAgICAgICAgaWYgKCFwdWJsaWNhdGlvbikgeyByZXR1cm47IH1cblxuICAgICAgICBjb25zdCBrZXkgPSB2YWx1ZU9mSWQoZG9jSWQpO1xuICAgICAgICBjb25zdCBkb2MgPSB0aGlzLmRvY3VtZW50c1trZXldO1xuXG4gICAgICAgIGlmICh0eXBlb2YgZG9jID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBEb2Mgbm90IGZvdW5kIGluIGxpc3Q6ICR7a2V5fWApO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5kb2N1bWVudHNba2V5XS5hZGRDaGlsZFB1YihwdWJsaWNhdGlvbik7XG4gICAgfVxuXG4gICAgZ2V0KGRvY0lkKSB7XG4gICAgICAgIGNvbnN0IGtleSA9IHZhbHVlT2ZJZChkb2NJZCk7XG4gICAgICAgIHJldHVybiB0aGlzLmRvY3VtZW50c1trZXldO1xuICAgIH1cblxuICAgIHJlbW92ZShkb2NJZCkge1xuICAgICAgICBjb25zdCBrZXkgPSB2YWx1ZU9mSWQoZG9jSWQpO1xuICAgICAgICBkZWxldGUgdGhpcy5kb2N1bWVudHNba2V5XTtcbiAgICB9XG5cbiAgICBoYXMoZG9jSWQpIHtcbiAgICAgICAgcmV0dXJuICEhdGhpcy5nZXQoZG9jSWQpO1xuICAgIH1cblxuICAgIGVhY2hEb2N1bWVudChjYWxsYmFjaywgY29udGV4dCkge1xuICAgICAgICBfLmVhY2godGhpcy5kb2N1bWVudHMsIGZ1bmN0aW9uIGV4ZWNDYWxsYmFja09uRG9jKGRvYykge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzLCBkb2MpO1xuICAgICAgICB9LCBjb250ZXh0IHx8IHRoaXMpO1xuICAgIH1cblxuICAgIGVhY2hDaGlsZFB1Yihkb2NJZCwgY2FsbGJhY2spIHtcbiAgICAgICAgY29uc3QgZG9jID0gdGhpcy5nZXQoZG9jSWQpO1xuXG4gICAgICAgIGlmIChkb2MpIHtcbiAgICAgICAgICAgIGRvYy5lYWNoQ2hpbGRQdWIoY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0SWRzKCkge1xuICAgICAgICBjb25zdCBkb2NJZHMgPSBbXTtcblxuICAgICAgICB0aGlzLmVhY2hEb2N1bWVudCgoZG9jKSA9PiB7XG4gICAgICAgICAgICBkb2NJZHMucHVzaChkb2MuZG9jSWQpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gZG9jSWRzO1xuICAgIH1cblxuICAgIHVuZmxhZ0ZvclJlbW92YWwoZG9jSWQpIHtcbiAgICAgICAgY29uc3QgZG9jID0gdGhpcy5nZXQoZG9jSWQpO1xuXG4gICAgICAgIGlmIChkb2MpIHtcbiAgICAgICAgICAgIGRvYy51bmZsYWdGb3JSZW1vdmFsKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBmbGFnQWxsRm9yUmVtb3ZhbCgpIHtcbiAgICAgICAgdGhpcy5lYWNoRG9jdW1lbnQoKGRvYykgPT4ge1xuICAgICAgICAgICAgZG9jLmZsYWdGb3JSZW1vdmFsKCk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gdmFsdWVPZklkKGRvY0lkKSB7XG4gICAgaWYgKGRvY0lkID09PSBudWxsKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignRG9jdW1lbnQgSUQgaXMgbnVsbCcpO1xuICAgIH1cbiAgICBpZiAodHlwZW9mIGRvY0lkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0RvY3VtZW50IElEIGlzIHVuZGVmaW5lZCcpO1xuICAgIH1cbiAgICByZXR1cm4gZG9jSWQudmFsdWVPZigpO1xufVxuXG5leHBvcnQgZGVmYXVsdCBQdWJsaXNoZWREb2N1bWVudExpc3Q7XG4iXX0=
