"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.serverInfo = void 0;
var path = require("path");
var fs = require("fs");
// reads the serverInfo.json file and creates an object that works with the Iserver info interface
var rawInfo = fs.readFileSync(path.join(__dirname, "../serverInfo.json"));
exports.serverInfo = JSON.parse(rawInfo);
