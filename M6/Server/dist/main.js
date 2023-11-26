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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = __importStar(require("path"));
const express = require("express");
const ServerInfo_1 = require("./ServerInfo");
const IMAP = __importStar(require("./IMAP"));
const SMTP = __importStar(require("./SMTP"));
const Contacts = __importStar(require("./contacts"));
const app = express();
//app.use() just adds middleware
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "../../client/dist")));
app.use(function (inRequest, inResponse, inNext) {
    inResponse.header("Access-Control-Allow-Origin", "*");
    // Uses Cors to return all the domains that can use it
    inResponse.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS"
    // Methods well accept from clients
    );
    inResponse.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
    // specifies what additional headers that were going to accept
    inNext();
});
// all app.XXX require a response and request method
app.get("/mailboxes", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
        // initiates an IMAP worker object
        const mailboxes = yield imapWorker.listMailboxes();
        // captures the array of Imailboxes objects which it returns
        inResponse.json(mailboxes);
        //transforms them to json
    }
    catch (inError) {
        console.log("mailboxes (1) error ", inError);
        inResponse.send("error retrieving list of mailboxes");
    }
}));
// Lists the messages in each mailbox
app.get("/mailboxes/:mailbox", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
        // initiates an IMAP worker object
        const messages = yield imapWorker.listMessages({
            mailbox: inRequest.params.mailbox
        });
        // Returns an array of Imessage objects
        inResponse.json(messages);
        //transforms them to json
    }
    catch (inError) {
        console.log("mailboxes (2) error ", inError);
        inResponse.send("error listing the messages");
    }
}));
//getting the message from the metadata
app.get("/messages/:mailbox/:id", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
        const messageBody = yield imapWorker.getMessageBody({
            mailbox: inRequest.params.mailbox,
            id: parseInt(inRequest.params.id, 10)
        });
        // gets the message body using the id of the mailbox and the id of the message
        inResponse.send(messageBody);
    }
    catch (inError) {
        inResponse.send("error getting the body of the message");
    }
}));
// deleting a message
app.delete("/messages/:mailbox/:id", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imapWorker = new IMAP.Worker(ServerInfo_1.serverInfo);
        yield imapWorker.deleteMessage({
            mailbox: inRequest.params.mailbox,
            id: parseInt(inRequest.params.id, 10)
        });
        inResponse.send("ok");
    }
    catch (inError) {
        inResponse.send("error deleting message");
    }
}));
// sends a message
app.post("/messages", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const smtpWorker = new SMTP.Worker(ServerInfo_1.serverInfo);
        yield smtpWorker.sendMessage(inRequest.body);
        inResponse.send("ok");
    }
    catch (inError) {
        inResponse.send("error sending message");
    }
}));
//listing contacts
app.get("/contacts", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactsWorker = new Contacts.Worker();
        const contacts = yield contactsWorker.listContacts();
        inResponse.json(contacts);
    }
    catch (inError) {
        inResponse.send("error listing contact");
    }
}));
// adding contacts
// here were returning the whole contact with the response 
// rather than an ok to include the id incase its later deleted
app.post("/contacts", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactsWorker = new Contacts.Worker();
        const contact = yield contactsWorker.addContact(inRequest.body);
        inResponse.json(contact);
    }
    catch (inError) {
        inResponse.send("error adding contact");
    }
}));
// updating contact
app.post("/contacts/:id", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let contactsWorker = new Contacts.Worker();
        yield contactsWorker.deleteContact(inRequest.params.id);
        const contact = yield contactsWorker.addContact(inRequest.body);
        inResponse.json(contact);
    }
    catch (inError) {
        inResponse.send("error updating contact");
    }
}));
// delete contacct
app.delete("/contacts/:id", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactsWorker = new Contacts.Worker();
        yield contactsWorker.deleteContact(inRequest.params.id);
        inResponse.send("ok");
    }
    catch (inError) {
        inResponse.send("error deleting contact");
    }
}));
app.put("/contacts", (inRequest, inResponse) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contactsWorker = new Contacts.Worker();
        yield contactsWorker.updateContact(inRequest.body);
        inResponse.send("ok");
    }
    catch (inError) {
        console.log(inError);
        inResponse.send("error updating contact");
    }
}));
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// 
//# sourceMappingURL=main.js.map