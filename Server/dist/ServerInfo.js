"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverInfo = void 0;
const path = require("path");
const fs = require("fs");
// reads the serverInfo.json file and creates an object that works with the Iserver info interface
const rawInfo = fs.readFileSync(path.join(__dirname, "../serverInfo.json"));
exports.serverInfo = JSON.parse(rawInfo);
//# sourceMappingURL=ServerInfo.js.map