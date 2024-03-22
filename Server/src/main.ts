import * as path from "path";
import
{ Express, NextFunction, Request, Response } from "express";
import express = require("express");
import { serverInfo } from "./ServerInfo";
import * as IMAP from "./IMAP";
import * as SMTP from "./SMTP";
import * as Contacts from "./contacts";
import { IContact } from "./contacts";

const app: Express = express();
//app.use() just adds middleware
app.use(express.json());
app.use("/",
    express.static(path.join(__dirname, "../../client/dist"))
);

app.use(function(inRequest: Request, inResponse: Response,
    inNext: NextFunction) {
    inResponse.header("Access-Control-Allow-Origin", "*");
    // Uses Cors to return all the domains that can use it
    inResponse.header("Access-Control-Allow-Methods",
    "GET,PUT,POST,DELETE,OPTIONS"
    // Methods well accept from clients
);
inResponse.header("Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
);
// specifies what additional headers that were going to accept
inNext();
});
// all app.XXX require a response and request method
app.get("/mailboxes",async (inRequest: Request, inResponse: Response) => {
    try {
        const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
        // initiates an IMAP worker object
        const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();
        // captures the array of Imailboxes objects which it returns
        inResponse.json(mailboxes);
        //transforms them to json
        }   
    catch (inError) {
        console.log("mailboxes (1) error ", inError)
        inResponse.send("error retrieving list of mailboxes");
    } 
}
);
// Lists the messages in each mailbox
app.get("/mailboxes/:mailbox",
    async (inRequest: Request, inResponse: Response) => {
    try {
        const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
        // initiates an IMAP worker object
        const messages: IMAP.IMessage[] = await imapWorker.listMessages({
            mailbox : inRequest.params.mailbox
        });
        // Returns an array of Imessage objects
        inResponse.json(messages);
        //transforms them to json
    } 
    catch (inError) {
        console.log("mailboxes (2) error ", inError)
        inResponse.send("error listing the messages");
    }
    }
);

//getting the message from the metadata

app.get("/messages/:mailbox/:id",
    async (inRequest: Request, inResponse: Response) => {
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            const messageBody: string = await imapWorker.getMessageBody({
                mailbox : inRequest.params.mailbox,
                id : parseInt(inRequest.params.id, 10)

            });
            // gets the message body using the id of the mailbox and the id of the message
            inResponse.send(messageBody);
        } 
        catch (inError) {
            inResponse.send("error getting the body of the message");
        }
    }
);
// deleting a message
app.delete("/messages/:mailbox/:id",
    async (inRequest: Request, inResponse: Response) => {
        try {
            const imapWorker: IMAP.Worker = new IMAP.Worker(serverInfo);
            await imapWorker.deleteMessage({
                mailbox : inRequest.params.mailbox,
                id : parseInt(inRequest.params.id, 10)
            });
            inResponse.send("ok");
        } 
        catch (inError) {
            inResponse.send("error deleting message");
        }
    }
);
// sends a message
app.post("/messages",
    async (inRequest: Request, inResponse: Response) => {
        try {
            const smtpWorker: SMTP.Worker = new SMTP.Worker(serverInfo);
            await smtpWorker.sendMessage(inRequest.body);
            inResponse.send("ok");
        } 
        catch (inError) {
            inResponse.send("error sending message");
        }
    }
);

//listing contacts

app.get("/contacts",
    async (inRequest: Request, inResponse: Response) => {
        try {
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            const contacts: IContact[] = await contactsWorker.listContacts();
            inResponse.json(contacts);
        } 
        catch (inError) {
            inResponse.send("error listing contact");
        }
    }
);

// adding contacts
// here were returning the whole contact with the response 
// rather than an ok to include the id incase its later deleted
app.post("/contacts",
    async (inRequest: Request, inResponse: Response) => {
        try {
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            const contact: IContact = await contactsWorker.addContact
            (inRequest.body);
            inResponse.json(contact);
        } 
        catch (inError) {
            inResponse.send("error adding contact");
        }
    }
);

// updating contact
app.post("/contacts/:id", 
    async (inRequest: Request, inResponse: Response) => {
        try {
            let contactsWorker: Contacts.Worker = new Contacts.Worker();
            await contactsWorker.deleteContact(inRequest.params.id);
            const contact: IContact = await contactsWorker.addContact
            (inRequest.body);
            inResponse.json(contact);
        } 
        catch (inError) {
            inResponse.send("error updating contact");
        }
    })
// delete contacct

app.delete("/contacts/:id",
    async (inRequest: Request, inResponse: Response) => {
        try {
            const contactsWorker: Contacts.Worker = new Contacts.Worker();
            await contactsWorker.deleteContact(inRequest.params.id);
            inResponse.send("ok");
        } 
        catch (inError) {
            inResponse.send("error deleting contact");
        }
    }
);
app.put("/contacts", async (inRequest: Request, inResponse: Response) => {
  try {
    const contactsWorker: Contacts.Worker = new Contacts.Worker();
    await contactsWorker.updateContact(inRequest.body);
    inResponse.send("ok");
  } catch (inError) {
    console.log(inError)
    inResponse.send("error updating contact");
  }
});

const PORT = 3000
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
// 