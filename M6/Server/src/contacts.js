"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
var path = require("path");
var Datastore = require("nedb");
var Worker = /** @class */ (function () {
    // creates database
    function Worker() {
        this.db = new Datastore({
            filename: path.join(__dirname, "contacts.db"),
            autoload: true
        });
        // then its loaded automatically if its not created
    }
    // provides a list of contacts
    // uses promise to be able to use async/await
    // An async function always returns a promise. If the function 
    //returns a value that is not a promise, it will be automatically wrapped in a promise.
    // The await keyword is used inside an async function to wait for a promise to resolve.
    //When await is used, the execution of the async function is paused until the promise is resolved.
    Worker.prototype.listContacts = function () {
        var _this = this;
        return new Promise(function (inResolve, inReject) {
            _this.db.find({}, function (inError, inDocs) {
                if (inError) {
                    inReject(inError);
                }
                else {
                    inResolve(inDocs);
                }
            });
        });
    };
    Worker.prototype.addContact = function (inContact) {
        var _this = this;
        return new Promise(function (inResolve, inReject) {
            _this.db.insert(inContact, function (inError, inNewDoc) {
                if (inError) {
                    inReject(inError);
                }
                else {
                    inResolve(inNewDoc);
                }
            });
        });
    };
    Worker.prototype.deleteContact = function (inID) {
        var _this = this;
        return new Promise(function (inResolve, inReject) {
            _this.db.remove({ _id: inID }, {}, function (inError, inNumRemoved) {
                if (inError) {
                    inReject(inError);
                }
                else {
                    // Return a success message or the number of removed records
                    inResolve("Contact with ID: ".concat(inID, " deleted successfully"));
                }
            });
        });
    };
    return Worker;
}());
exports.Worker = Worker;
