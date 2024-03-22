import * as path from "path";
const Datastore = require("nedb");

export interface IContact {
_id?: number, name: string, email: string
}
export class Worker {
    private db: Nedb;
    // creates database

    constructor() {
        this.db = new Datastore({
        filename : path.join(__dirname, "contacts.db"),
        autoload : true
        });
        // then its loaded automatically if its not created
    }
    // provides a list of contacts
    // uses promise to be able to use async/await
    // An async function always returns a promise. If the function 
    //returns a value that is not a promise, it will be automatically wrapped in a promise.
    // The await keyword is used inside an async function to wait for a promise to resolve.
    //When await is used, the execution of the async function is paused until the promise is resolved.
    public listContacts(): Promise<IContact[]> {
        return new Promise((inResolve, inReject) => {
            this.db.find({ },
                (inError: Error, inDocs: IContact[]) => {
                    if (inError) {
                        inReject(inError);
                    } 
                    else {
                        inResolve(inDocs);
                    }
                }
            );
        });
    }
    public addContact(inContact: IContact): Promise<IContact> {
        return new Promise((inResolve, inReject) => {
            this.db.insert(inContact,
                (inError: Error | null, inNewDoc: IContact) => {
                    if (inError) {
                    inReject(inError);
                    } else {
                    inResolve(inNewDoc);
                    }
                }
            );
        });
    }
    public updateContact(inContact: IContact): Promise<string | void> {
    return new Promise((inResolve, inReject) => {
      this.db.update(
        { _id: inContact._id },
        { $set: { email: inContact.email } },
        {},
        (inError: Error | null, inNumUpdated: number) => {
          if (inError) {
            inReject(inError);
          } else {
            inResolve();
          }
        }
      );
    });
}

    public deleteContact(inID: string): Promise<string> {
    return new Promise((inResolve, inReject) => {
        this.db.remove({ _id: inID }, {},
            (inError: Error | null, inNumRemoved: number) => {
                if (inError) {
                    inReject(inError);
                } else {
                    // Return a success message or the number of removed records
                    inResolve(`Contact with ID: ${inID} deleted successfully`);
                }
            }
        );
    });
}
    






}