"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
const path = __importStar(require("path"));
const Datastore = require("nedb");
class Worker {
    // creates database
    constructor() {
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
    listContacts() {
        return new Promise((inResolve, inReject) => {
            this.db.find({}, (inError, inDocs) => {
                if (inError) {
                    inReject(inError);
                }
                else {
                    inResolve(inDocs);
                }
            });
        });
    }
    addContact(inContact) {
        return new Promise((inResolve, inReject) => {
            this.db.insert(inContact, (inError, inNewDoc) => {
                if (inError) {
                    inReject(inError);
                }
                else {
                    inResolve(inNewDoc);
                }
            });
        });
    }
    updateContact(inContact) {
        return new Promise((inResolve, inReject) => {
            this.db.update({ _id: inContact._id }, { $set: { email: inContact.email } }, {}, (inError, inNumUpdated) => {
                if (inError) {
                    inReject(inError);
                }
                else {
                    inResolve();
                }
            });
        });
    }
    deleteContact(inID) {
        return new Promise((inResolve, inReject) => {
            this.db.remove({ _id: inID }, {}, (inError, inNumRemoved) => {
                if (inError) {
                    inReject(inError);
                }
                else {
                    // Return a success message or the number of removed records
                    inResolve(`Contact with ID: ${inID} deleted successfully`);
                }
            });
        });
    }
}
exports.Worker = Worker;
//# sourceMappingURL=contacts.js.map