const path = require("path");
const fs = require("fs");

export interface IServerInfo {
    smtp : {
    host: string, port: number,
    auth: { user: string, pass: string }
    },
    imap : {
    host: string, port: number,
    auth: { user: string, pass: string }
    }
}

export let serverInfo: IServerInfo;

// reads the serverInfo.json file and creates an object that works with the Iserver info interface
const rawInfo: string =
fs.readFileSync(path.join(__dirname, "../serverInfo.json"));
serverInfo = JSON.parse(rawInfo);

