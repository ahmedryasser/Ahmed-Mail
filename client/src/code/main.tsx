import "normalize.css";
import "../css/main.css";
import React from "react";
import ReactDOM from "react-dom";
import BaseLayout from "./components/BaseLayout";
import * as IMAP from "./IMAP";
import * as Contacts from "./Contacts";


//Here we render the UI.
// This is the UI that contains all the other views inside it
const baseComponent = ReactDOM.render(<BaseLayout />, document.body);


// displays a please wait UI so that user cannot mess up server

baseComponent.state.showHidePleaseWait(true);
//adds every mailbox to the mailbox list and causing react to render the screen
async function getMailboxes() {
  const imapWorker: IMAP.Worker = new IMAP.Worker();
  const mailboxes: IMAP.IMailbox[] = await imapWorker.listMailboxes();
  mailboxes.forEach((inMailbox) => {
    baseComponent.state.addMailboxToList(inMailbox);
  });
}

getMailboxes().then(function() {
  // Now were fetching the users contacts
  async function getContacts() {
    const contactsWorker: Contacts.Worker = new Contacts.Worker();
    const contacts: Contacts.IContact[] = await contactsWorker.listContacts();
    contacts.forEach((inContact) => {
      baseComponent.state.addContactToList(inContact);
    });
  }
  getContacts().then(() => baseComponent.state.showHidePleaseWait(false));
});
